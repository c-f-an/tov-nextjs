# 1. 시스템 업데이트 및 기본 도구 설치

먼저 시스템을 최신 상태로 업데이트하고, 컴파일 등에 필요한 도구와 Git을 설치합니다.

```Bash

# 시스템 업데이트

sudo dnf update -y

# Git 설치

sudo dnf install git -y
```

# 2. nvm 및 Node.js LTS 설치

nvm(Node Version Manager)을 사용하면 노드 버전을 쉽게 관리할 수 있습니다.

```Bash

# nvm 설치 스크립트 실행

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 스크립트 활성화 (터미널 재접속 없이 바로 반영)

. ~/.nvm/nvm.sh

# Node.js LTS 버전 설치 및 확인

nvm install --lts
node -v
npm -v
```

# 3. PM2 글로벌 설치

Node.js 프로세스 관리 도구인 PM2를 설치합니다.

```Bash

npm install -g pm2
```

# 4. 작업 디렉토리(/apps) 생성 및 권한 설정

루트 경로에 /apps 폴더를 만들고, ec2-user가 자유롭게 쓰기 및 Git 클론을 할 수 있도록 권한을 부여합니다.

```Bash

# 폴더 생성

sudo mkdir /apps

# 소유자 변경 (ec2-user)

sudo chown ec2-user:ec2-user /apps

# 권한 변경 (755: 소유자 읽기/쓰기/실행 가능)

sudo chmod 755 /apps
```

# 5. GitHub SSH Key 설정

GitHub 토큰(개인키)을 EC2로 옮긴 후 SSH 설정을 진행합니다. (토큰 파일이 이미 서버에 업로드되었다고 가정하거나, 직접 생성하는 단계입니다.)

```Bash

# .ssh 디렉토리 이동 및 권한 설정

mkdir -p ~/.ssh
chmod 700 ~/.ssh

# (가정) GitHub에서 사용하는 개인키 파일명이 id_rsa_github 인 경우

# 해당 파일을 ~/.ssh/ 경로로 이동시킨 후 권한을 설정해야 합니다.

chmod 600 ~/.ssh/id_rsa_github

# SSH Config 파일 작성

cat <<EOT >> ~/.ssh/config
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_github
EOT

# Config 파일 권한 설정

chmod 600 ~/.ssh/config

# 연결 테스트 (성공 시 Hi 유저명! 메시지 출력)

ssh -T git@github.com

```
