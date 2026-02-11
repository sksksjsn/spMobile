# CLAUDE.md

이 파일은 Claude Code가 이 프로젝트를 이해하고 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

FastAPI + SQLAlchemy 2.0 (async) + React 19 + Tailwind 4 기반의 풀스택 웹 애플리케이션.
**"유지보수성 최우선"** 및 **"모듈화"**가 핵심 가치입니다.

## 기술 스택

- **백엔드**: FastAPI 0.109, SQLAlchemy 2.0 (asyncpg), Pydantic v2, Alembic, JWT (python-jose)
- **프론트엔드**: React 19, Vite 7, Tailwind CSS 4, Zustand 5, React Router DOM 7
- **Python**: 3.12+
- **DB**: PostgreSQL (async)

## 프로젝트 구조

```
server/              # 백엔드 (FastAPI)
  main.py            # 진입점
  app/
    core/            # 핵심 인프라 (미들웨어, 로깅, 설정)
    shared/          # 공유 컴포넌트
    domain/          # 비즈니스 도메인 (플러그인 구조)
    api/             # API 엔드포인트
client/              # 프론트엔드 (React)
  src/
    core/            # 핵심 유틸리티
    domains/         # 도메인별 기능
alembic/             # DB 마이그레이션
  versions/          # 마이그레이션 파일 (Append-only)
tests/
  unit/              # 단위 테스트
  integration/       # 통합 테스트
DOC/                 # 프로젝트 문서 (ARCHITECTURE.md, DEVELOPMENT_GUIDE.md 등)
```

## 절대 금지 사항 (NEVER DO)

1. **아키텍처**: 레이어드 구조(`Router -> Service -> Repository`) 파괴, 도메인 간 내부 구현 직접 참조
2. **백엔드**: 비즈니스 로직에 절차지향 함수 사용 (클래스 기반 필수), 직접 DB 쿼리 (Service/Repo 필수), 타입 힌트 누락
3. **프론트엔드**: 직접 `axios` 호출 (`apiClient` 사용), 인라인 스타일 (`Tailwind` 사용), `any` 타입 사용
4. **데이터베이스**: DB 콘솔/GUI에서 직접 스키마 수정, 마이그레이션 파일(`alembic/versions/`) 수정 (Append-only 필수)

## 계층별 책임

- **Router (API)**: HTTP 입출력 처리만 담당. 비즈니스 로직 금지
- **Service**: 도메인 로직 오케스트레이션 및 트랜잭션 관리. `BaseService` 상속 필수
- **Repository**: DB 조회 및 데이터 소스 접근. `BaseRepository` 상속, `provide()` 구현
- **Calculator**: 순수 함수 기반 계산. `BaseCalculator` 상속, 외부 의존성/부수효과 금지
- **Formatter**: 응답 변환. `BaseFormatter` 상속, 비즈니스 로직 금지
- **도메인 간 통신**: 반드시 다른 도메인의 `Service`나 `Repository`를 통해서만

## 코드 스타일

### Python
- SQLAlchemy 2.0 비동기 패턴 사용
- Pydantic v2 `BaseModel` 필수
- line-length: 100 (black)
- isort profile: black
- ruff: E, W, F, I, C, B, UP 규칙 적용

### TypeScript
- React 19 패턴
- `Zustand` 기반 도메인 상태 관리
- `cn()` 유틸을 이용한 조건부 클래스 처리
- `any` 타입 사용 금지

### 로깅
- 모든 로그에 `request_id` 포함
- 민감 정보(PW, 토큰 등) 로깅 절대 금지

## DB 변경 워크플로우 (Alembic)

스키마/데이터 변경 시 반드시 다음 절차를 따를 것:
1. 변경 사항을 사용자에게 설명하고 승인 요청
2. `server/app/domain/{domain}/models/` 수정
3. `alembic revision --autogenerate -m "description"`으로 마이그레이션 생성
4. 생성된 마이그레이션 파일 검토 보고 후 `alembic upgrade head` 안내

## 개발 명령어

```bash
# 백엔드 실행
python -m server.main

# 프론트엔드 실행
cd client && npm run dev

# 코드 품질 검사 (백엔드)
black server/
isort server/
ruff check server/
mypy server/

# 프론트엔드 린트
cd client && npm run lint

# 테스트
pytest tests/

# 마이그레이션
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1
```

## 새 도메인 추가 시

```bash
# 백엔드
mkdir -p server/app/domain/{domain_name}/{models,schemas,repositories,calculators,formatters}
# service.py 생성

# 프론트엔드
mkdir -p client/src/domains/{domain_name}/{components,pages}
```

## 변경 제안 규칙

아키텍처나 스키마 변경 시 반드시 **현재 상황 / 제안 / 영향 범위 / 리스크** 형식으로 제안할 것.
기능 변경 시 관련 `DOC/` 내 가이드를 반드시 업데이트할 것.

## 참고 문서

- `DOC/ARCHITECTURE.md` - 시스템 아키텍처 및 설계 원칙
- `DOC/DEVELOPMENT_GUIDE.md` - 개발 가이드 및 코딩 규칙
- `DOC/BEGINNER_QUICK_START.md` - 빠른 시작 가이드
- `DOC/PROJECT_HANDOVER.md` - 인수인계 문서
