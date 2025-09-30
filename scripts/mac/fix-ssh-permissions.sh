#!/bin/bash

# SSH 키 권한 수정 스크립트 (Mac/Linux)
# 사용법: ./scripts/mac/fix-ssh-permissions.sh

SSH_KEY_PATH="/Users/$(whoami)/.ssh/AWS/TFAN_SEOUL.pem"

echo "🔐 Fixing SSH key permissions for: $SSH_KEY_PATH"
echo ""

# SSH 키 파일 존재 여부 확인
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "❌ SSH key file not found at: $SSH_KEY_PATH"
    echo ""
    echo "💡 Common SSH key locations:"
    echo "   ~/.ssh/id_rsa"
    echo "   ~/.ssh/id_ed25519"
    echo "   ~/.ssh/AWS/TFAN_SEOUL.pem"
    echo ""
    echo "Please update the SSH_KEY_PATH variable in this script or create the key file."
    exit 1
fi

# 현재 권한 확인
current_perms=$(stat -c "%a" "$SSH_KEY_PATH" 2>/dev/null || stat -f "%A" "$SSH_KEY_PATH" 2>/dev/null)
echo "👀 Current permissions: $current_perms"

# 권한이 이미 올바른지 확인
if [ "$current_perms" = "600" ]; then
    echo "✅ Permissions are already correct (600)!"
    echo ""
    echo "✨ You can now use the SSH tunnel script!"
    exit 0
fi

echo "🔧 Setting correct permissions (600 - read/write for owner only)..."

# 권한 수정
chmod 600 "$SSH_KEY_PATH"

# 결과 확인
if [ $? -eq 0 ]; then
    new_perms=$(stat -c "%a" "$SSH_KEY_PATH" 2>/dev/null || stat -f "%A" "$SSH_KEY_PATH" 2>/dev/null)
    echo "✅ Permissions fixed successfully!"
    echo "📝 New permissions: $new_perms"
    echo ""

    # 소유자 정보 표시
    owner_info=$(ls -la "$SSH_KEY_PATH")
    echo "📋 File details:"
    echo "   $owner_info"
    echo ""

    echo "✨ You can now use the SSH tunnel script!"
else
    echo "❌ Error fixing permissions"
    echo ""
    echo "💡 Try running with sudo if you continue to have permission issues:"
    echo "   sudo ./scripts/mac/fix-ssh-permissions.sh"
    exit 1
fi

echo ""
echo "📌 Note: SSH keys should have 600 permissions (readable/writable by owner only)"
echo "📌 If you're still having issues, ensure the key file is owned by your user account"