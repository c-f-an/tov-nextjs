# SSH 키 권한 수정 스크립트 (관리자 권한으로 실행 필요)
# 사용법: 관리자 PowerShell에서 .\scripts\fix-ssh-permissions.ps1 실행

$SSH_KEY_PATH = "C:\.ssh\TFAN_SEOUL.pem"

Write-Host "🔐 Fixing SSH key permissions for: $SSH_KEY_PATH" -ForegroundColor Yellow
Write-Host ""

# 파일 존재 여부 확인
if (-not (Test-Path $SSH_KEY_PATH)) {
    Write-Host "❌ SSH key file not found at: $SSH_KEY_PATH" -ForegroundColor Red
    exit 1
}

try {
    # 현재 사용자 정보 가져오기
    $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

    Write-Host "👤 Current user: $currentUser" -ForegroundColor Cyan
    Write-Host "🔧 Removing inheritance and setting exclusive permissions..." -ForegroundColor Yellow

    # 파일의 ACL 가져오기
    $acl = Get-Acl $SSH_KEY_PATH

    # 상속 비활성화
    $acl.SetAccessRuleProtection($true, $false)

    # 모든 권한 제거
    $acl.Access | ForEach-Object { $acl.RemoveAccessRule($_) | Out-Null }

    # 현재 사용자에게만 전체 권한 부여
    $permission = $currentUser, "FullControl", "Allow"
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
    $acl.SetAccessRule($accessRule)

    # ACL 적용
    Set-Acl $SSH_KEY_PATH $acl

    Write-Host "✅ Permissions fixed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Current permissions:" -ForegroundColor Cyan
    Get-Acl $SSH_KEY_PATH | Format-List

} catch {
    Write-Host "❌ Error fixing permissions: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Try running this script as Administrator" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✨ You can now use the SSH tunnel script!" -ForegroundColor Green