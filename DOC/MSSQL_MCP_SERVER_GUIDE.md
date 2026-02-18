# MSSQL MCP 서버 설치 및 트러블슈팅 가이드

이 문서는 Docker를 이용한 MSSQL 데이터베이스 구축 및 Claude Code용 MCP 서버 설정 과정을 기록합니다.

## 1. 사전 요구 사항
- **Docker Desktop**: 설치 및 실행 필수.
- **PowerShell**: 윈도우 환경 권장.

## 2. MSSQL 데이터베이스 서버 구축 (Docker)

### 컨테이너 실행
윈도우 PowerShell에서 다음 명령어를 한 줄로 실행합니다.
```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=SqlPassword123!" \
   -p 1433:1433 --name mssql-server \
   -v mssql_data:/var/opt/mssql \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

### 데이터베이스 생성
```powershell
docker exec -it mssql-server /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "SqlPassword123!" -C -Q "CREATE DATABASE spMobileDB"
```

## 3. MSSQL MCP 서버 배포

### 설정 파일 (`.env`)
`mcp-servers/mssql/.env` 파일을 다음과 같이 설정합니다.
```env
MSSQL_SERVER=host.docker.internal
MSSQL_PORT=1433
MSSQL_USER=sa
MSSQL_PASSWORD=SqlPassword123!
MSSQL_DATABASE=spMobileDB
MSSQL_ENCRYPT=false
MSSQL_TRUST_SERVER_CERTIFICATE=true
```

### 서버 빌드 및 실행
```powershell
cd mcp-servers/mssql
docker compose up -d --build
```

## 4. 트러블슈팅 (Troubleshooting)

### Docker 연결 오류 (`//./pipe/docker_engine`)
- **현상**: `error during connect: ... open //./pipe/docker_engine: The system cannot find the file specified.`
- **해결**: Docker Desktop이 꺼져 있는 경우입니다. Docker Desktop을 실행하고 트레이 아이콘의 고래 모양이 멈출 때까지 기다려야 합니다.

### PowerShell 명령어 구문 오류 (`\`)
- **현상**: `Sqlcmd: '\': Unknown Option.`
- **해결**: 리눅스용 줄 바꿈 기호(`\`) 대신 PowerShell용 기호(`` ` ``)를 사용하거나, 모든 명령어를 한 줄로 이어 붙여 실행합니다.

### 접속 거부 오류 (18456)
- **현상**: `Login failed for user 'sa' (Error: 18456)`
- **해결**: 비밀번호 정책(복잡성)을 충족하지 못했거나 컨테이너 초기화가 실패한 경우입니다. 컨테이너를 삭제(`docker rm -f`) 후 다시 생성하세요.

### 컨테이너 간 통신
- **현상**: MCP 서버가 호스트의 MSSQL에 접속하지 못함.
- **해결**: `MSSQL_SERVER` 주소를 `localhost`가 아닌 `host.docker.internal`로 설정해야 도커 네트워크 내부에서 호스트 포트에 접근 가능합니다.

## 5. 최종 확인
- **SSE URL**: `http://localhost:8080/sse`
- **로그 확인**: `docker logs -f mssql-mcp-server`
