# MSSQL MCP Server

**Claude Code 웹 버전**에서 MSSQL 데이터베이스를 사용할 수 있도록 HTTP/SSE 기반 MCP 서버를 Docker로 배포합니다.

## 아키텍처

```
Claude Code 웹 ──SSE──▶ supergateway (포트 8080) ──stdio──▶ mssql-mcp-node ──▶ MSSQL DB
```

- **`mssql-mcp-node`**: MSSQL용 stdio MCP 서버
- **`supergateway`**: stdio MCP → HTTP/SSE 브리지 (웹 클라이언트 연결용)

## 빠른 시작

### 1. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어 MSSQL 연결 정보 입력
```

### 2. 컨테이너 실행

```bash
# 빌드 후 실행
docker compose up -d --build

# 로그 확인
docker compose logs -f
```

### 3. 동작 확인

```bash
# SSE 엔드포인트 확인
curl http://localhost:8080/sse
```

## Claude Code 웹에서 연결

프로젝트 루트의 `.mcp.json`이 자동으로 인식됩니다.
컨테이너가 실행 중이면 Claude Code 웹 세션에서 MSSQL 도구를 사용할 수 있습니다.

> **공개 서버 배포 시**: `localhost` 대신 실제 서버 IP/도메인으로 `.mcp.json`의 URL을 변경하세요.

## 지원 도구 (mssql-mcp-node)

| 도구 | 설명 |
|------|------|
| `query` | SQL 쿼리 실행 |
| `list_tables` | 테이블 목록 조회 |
| `describe_table` | 테이블 스키마 조회 |
| `list_databases` | DB 목록 조회 |

## 관리 명령어

```bash
# 중지
docker compose down

# 재시작
docker compose restart

# 이미지 재빌드
docker compose up -d --build
```
