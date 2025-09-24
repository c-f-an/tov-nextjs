#!/bin/bash

# TOV Homepage Keep-Alive Service Script
# This script maintains database connections for the TOV homepage
# Run this on the production server to prevent connection timeouts

# Configuration
HEALTH_URL="http://localhost:3000/api/health"
LOG_FILE="/var/log/tov-keepalive.log"
CHECK_INTERVAL=120  # 2 minutes
MAX_LOG_SIZE=10485760  # 10MB

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"

    # Rotate log if it gets too large
    if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null) -gt $MAX_LOG_SIZE ]; then
        mv "$LOG_FILE" "${LOG_FILE}.old"
        echo "${timestamp} [INFO] Log rotated" > "$LOG_FILE"
    fi
}

# Function to check health
check_health() {
    local response=$(curl -s -w "\n%{http_code}" "$HEALTH_URL" 2>/dev/null)
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "200" ]; then
        local connection_id=$(echo "$body" | grep -o '"currentConnectionId":[0-9]*' | cut -d':' -f2)
        local status=$(echo "$body" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        log_message "INFO" "Health check OK - Status: ${status}, Connection ID: ${connection_id}"
        return 0
    else
        log_message "ERROR" "Health check failed - HTTP ${http_code}"
        return 1
    fi
}

# Function to force reconnection
force_reconnect() {
    log_message "WARN" "Forcing database reconnection..."

    local response=$(curl -s -X POST "$HEALTH_URL" \
        -H "Content-Type: application/json" \
        -d '{"action":"reconnect"}' 2>/dev/null)

    if echo "$response" | grep -q '"success":true'; then
        local connection_id=$(echo "$response" | grep -o '"connectionId":[0-9]*' | cut -d':' -f2)
        log_message "INFO" "Reconnection successful - New Connection ID: ${connection_id}"
        return 0
    else
        log_message "ERROR" "Reconnection failed"
        return 1
    fi
}

# Function to check PM2 process
check_pm2() {
    if command -v pm2 &> /dev/null; then
        local pm2_status=$(pm2 list | grep -E "tov|nextjs" | grep -c "online")
        if [ "$pm2_status" -eq "0" ]; then
            log_message "ERROR" "PM2 process not running"
            return 1
        fi
    fi
    return 0
}

# Function to restart service if needed
restart_service() {
    log_message "WARN" "Attempting to restart TOV service..."

    # Try PM2 first
    if command -v pm2 &> /dev/null; then
        pm2 restart tov-homepage 2>/dev/null || pm2 restart 0 2>/dev/null
        sleep 5
        if check_pm2; then
            log_message "INFO" "Service restarted via PM2"
            return 0
        fi
    fi

    # Try systemd
    if systemctl is-active --quiet tov.service; then
        sudo systemctl restart tov.service
        sleep 5
        log_message "INFO" "Service restarted via systemd"
        return 0
    fi

    # Try direct npm/node
    if [ -d "/home/ec2-user/tov-homepage" ]; then
        cd /home/ec2-user/tov-homepage
        npm run build && nohup npm start > /dev/null 2>&1 &
        log_message "INFO" "Service restarted directly"
        return 0
    fi

    log_message "ERROR" "Failed to restart service"
    return 1
}

# Signal handlers
trap 'log_message "INFO" "Keep-alive service stopped"; exit 0' SIGTERM SIGINT

# Main loop
log_message "INFO" "Starting TOV Keep-Alive Service (Check interval: ${CHECK_INTERVAL}s)"

consecutive_failures=0
max_failures=3

while true; do
    if check_health; then
        consecutive_failures=0
    else
        consecutive_failures=$((consecutive_failures + 1))
        log_message "WARN" "Health check failed (${consecutive_failures}/${max_failures})"

        # Try to reconnect first
        if [ $consecutive_failures -eq 1 ]; then
            force_reconnect
        fi

        # If failures continue, restart the service
        if [ $consecutive_failures -ge $max_failures ]; then
            log_message "ERROR" "Max failures reached, restarting service..."
            restart_service
            consecutive_failures=0
            sleep 30  # Wait for service to fully start
        fi
    fi

    # Check PM2 status periodically
    if [ $((RANDOM % 10)) -eq 0 ]; then
        check_pm2 || log_message "WARN" "PM2 check failed"
    fi

    sleep $CHECK_INTERVAL
done