#!/bin/bash

# Setup script for TOV Keep-Alive Service on production server
# Run this script on the production server with sudo privileges

echo "Setting up TOV Keep-Alive Service..."

# Create systemd service file
sudo tee /etc/systemd/system/tov-keepalive.service > /dev/null << 'EOF'
[Unit]
Description=TOV Database Keep-Alive Service
After=network.target tov.service
Wants=tov.service

[Service]
Type=simple
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/tov-homepage
ExecStart=/home/ec2-user/tov-homepage/scripts/keep-alive.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=tov-keepalive

# Environment
Environment="NODE_ENV=production"

# Resource limits
LimitNOFILE=65535
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
EOF

# Create log directory
sudo mkdir -p /var/log
sudo touch /var/log/tov-keepalive.log
sudo chown ec2-user:ec2-user /var/log/tov-keepalive.log

# Copy keep-alive script to server location
if [ -f "./keep-alive.sh" ]; then
    sudo cp ./keep-alive.sh /home/ec2-user/tov-homepage/scripts/
    sudo chown ec2-user:ec2-user /home/ec2-user/tov-homepage/scripts/keep-alive.sh
    sudo chmod +x /home/ec2-user/tov-homepage/scripts/keep-alive.sh
fi

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable tov-keepalive.service
sudo systemctl start tov-keepalive.service

# Check status
sleep 2
sudo systemctl status tov-keepalive.service

echo "Setup complete!"
echo ""
echo "Useful commands:"
echo "  View logs:        sudo journalctl -u tov-keepalive -f"
echo "  Check status:     sudo systemctl status tov-keepalive"
echo "  Stop service:     sudo systemctl stop tov-keepalive"
echo "  Start service:    sudo systemctl start tov-keepalive"
echo "  Restart service:  sudo systemctl restart tov-keepalive"
echo "  View log file:    tail -f /var/log/tov-keepalive.log"