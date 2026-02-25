# MSSQL 데이터베이스 설계서

> **대상 시스템**: spMobile - SeAH Special Steel 모바일 웹 플랫폼
> **DB 엔진**: Microsoft SQL Server 2019+
> **작성일**: 2026-02-25
> **문서 버전**: v1.0

---

## 1. 설계 원칙

| 원칙 | 내용 |
|------|------|
| 네이밍 컨벤션 | 테이블: `TB_` 접두사, 컬럼: 대문자 스네이크 케이스 |
| 공통 감사 컬럼 | 모든 테이블에 `CREATE_DT`, `CREATE_USER`, `UPDATE_DT`, `UPDATE_USER` 포함 |
| 논리 삭제 | 물리 삭제 금지, `USE_YN` 컬럼으로 비활성화 처리 |
| 문자셋 | `NVARCHAR` 사용 (한글 지원) |
| 기본키 | `INT IDENTITY(1,1)` 또는 의미 있는 코드값 |

---

## 2. ERD 개요

```
TB_DEPT ──< TB_USER >──< TB_USER_ROLE >── TB_ROLE
                │
                ├──< TB_LOGIN_LOG
                └──< TB_TOKEN_BLACKLIST
```

---

## 3. 테이블 정의

### 3.1 TB_USER (사용자 마스터)

사용자 기본 정보 및 인증 정보를 관리합니다.

```sql
CREATE TABLE TB_USER (
    USER_ID         INT             NOT NULL IDENTITY(1,1),  -- 사용자 일련번호 (PK)
    LOGIN_ID        NVARCHAR(50)    NOT NULL,                 -- 로그인 아이디 (사번 or ID)
    PASSWORD        NVARCHAR(256)   NOT NULL,                 -- 비밀번호 (bcrypt 해시)
    USER_NAME       NVARCHAR(50)    NOT NULL,                 -- 사용자 이름
    EMAIL           NVARCHAR(100)       NULL,                 -- 이메일 주소
    DEPT_CD         NVARCHAR(20)        NULL,                 -- 부서코드 (FK → TB_DEPT)
    POSITION_NM     NVARCHAR(30)        NULL,                 -- 직급명
    PHONE_NO        NVARCHAR(20)        NULL,                 -- 전화번호
    MOBILE_NO       NVARCHAR(20)        NULL,                 -- 휴대폰번호
    PROFILE_IMG     NVARCHAR(500)       NULL,                 -- 프로필 이미지 경로
    LAST_LOGIN_DT   DATETIME2           NULL,                 -- 마지막 로그인 일시
    PWD_CHANGE_DT   DATETIME2           NULL,                 -- 비밀번호 변경 일시
    LOGIN_FAIL_CNT  INT             NOT NULL DEFAULT 0,       -- 로그인 실패 횟수
    LOCK_YN         CHAR(1)         NOT NULL DEFAULT 'N',     -- 계정 잠금 여부 (Y/N)
    USE_YN          CHAR(1)         NOT NULL DEFAULT 'Y',     -- 사용 여부 (Y/N)
    CREATE_DT       DATETIME2       NOT NULL DEFAULT GETDATE(), -- 생성 일시
    CREATE_USER     NVARCHAR(50)    NOT NULL DEFAULT 'SYSTEM', -- 생성자
    UPDATE_DT       DATETIME2           NULL,                 -- 수정 일시
    UPDATE_USER     NVARCHAR(50)        NULL,                 -- 수정자

    CONSTRAINT PK_TB_USER PRIMARY KEY (USER_ID),
    CONSTRAINT UQ_TB_USER_LOGIN_ID UNIQUE (LOGIN_ID),
    CONSTRAINT FK_TB_USER_DEPT FOREIGN KEY (DEPT_CD)
        REFERENCES TB_DEPT (DEPT_CD),
    CONSTRAINT CHK_TB_USER_LOCK_YN CHECK (LOCK_YN IN ('Y', 'N')),
    CONSTRAINT CHK_TB_USER_USE_YN  CHECK (USE_YN  IN ('Y', 'N'))
);

-- 인덱스
CREATE INDEX IX_TB_USER_LOGIN_ID   ON TB_USER (LOGIN_ID);
CREATE INDEX IX_TB_USER_DEPT_CD    ON TB_USER (DEPT_CD);
CREATE INDEX IX_TB_USER_USE_YN     ON TB_USER (USE_YN);
```

**컬럼 설명**

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| USER_ID | INT IDENTITY | Y | 자동증가 PK |
| LOGIN_ID | NVARCHAR(50) | Y | 로그인 ID, 사번 등 유니크 |
| PASSWORD | NVARCHAR(256) | Y | bcrypt 해시값 저장 (평문 금지) |
| DEPT_CD | NVARCHAR(20) | N | TB_DEPT 참조 |
| LOGIN_FAIL_CNT | INT | Y | 5회 초과 시 LOCK_YN = 'Y' 처리 |
| LOCK_YN | CHAR(1) | Y | 'Y': 잠금, 'N': 정상 |

---

### 3.2 TB_DEPT (부서 마스터)

조직도 기반 부서 정보를 계층형으로 관리합니다.

```sql
CREATE TABLE TB_DEPT (
    DEPT_CD         NVARCHAR(20)    NOT NULL,                 -- 부서코드 (PK)
    DEPT_NM         NVARCHAR(100)   NOT NULL,                 -- 부서명
    DEPT_ENG_NM     NVARCHAR(100)       NULL,                 -- 부서 영문명
    PARENT_DEPT_CD  NVARCHAR(20)        NULL,                 -- 상위 부서코드 (자기 참조)
    DEPT_LEVEL      INT             NOT NULL DEFAULT 1,       -- 계층 레벨 (1: 최상위)
    SORT_ORDER      INT             NOT NULL DEFAULT 0,       -- 정렬 순서
    USE_YN          CHAR(1)         NOT NULL DEFAULT 'Y',     -- 사용 여부
    CREATE_DT       DATETIME2       NOT NULL DEFAULT GETDATE(),
    CREATE_USER     NVARCHAR(50)    NOT NULL DEFAULT 'SYSTEM',
    UPDATE_DT       DATETIME2           NULL,
    UPDATE_USER     NVARCHAR(50)        NULL,

    CONSTRAINT PK_TB_DEPT PRIMARY KEY (DEPT_CD),
    CONSTRAINT FK_TB_DEPT_PARENT FOREIGN KEY (PARENT_DEPT_CD)
        REFERENCES TB_DEPT (DEPT_CD),
    CONSTRAINT CHK_TB_DEPT_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);

CREATE INDEX IX_TB_DEPT_PARENT_CD ON TB_DEPT (PARENT_DEPT_CD);
```

---

### 3.3 TB_ROLE (권한 역할)

시스템 내 역할(Role) 기반 접근 제어(RBAC)를 위한 권한 정의 테이블입니다.

```sql
CREATE TABLE TB_ROLE (
    ROLE_ID         INT             NOT NULL IDENTITY(1,1),   -- 권한 일련번호 (PK)
    ROLE_CD         NVARCHAR(30)    NOT NULL,                 -- 권한 코드 (ADMIN, USER 등)
    ROLE_NM         NVARCHAR(50)    NOT NULL,                 -- 권한명
    ROLE_DESC       NVARCHAR(200)       NULL,                 -- 권한 설명
    USE_YN          CHAR(1)         NOT NULL DEFAULT 'Y',
    CREATE_DT       DATETIME2       NOT NULL DEFAULT GETDATE(),
    CREATE_USER     NVARCHAR(50)    NOT NULL DEFAULT 'SYSTEM',
    UPDATE_DT       DATETIME2           NULL,
    UPDATE_USER     NVARCHAR(50)        NULL,

    CONSTRAINT PK_TB_ROLE PRIMARY KEY (ROLE_ID),
    CONSTRAINT UQ_TB_ROLE_CD UNIQUE (ROLE_CD),
    CONSTRAINT CHK_TB_ROLE_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);

-- 기본 역할 데이터
INSERT INTO TB_ROLE (ROLE_CD, ROLE_NM, ROLE_DESC, CREATE_USER)
VALUES
    ('ADMIN',   '시스템 관리자',  '전체 시스템 관리 권한', 'SYSTEM'),
    ('MANAGER', '부서 관리자',    '부서 내 관리 권한',     'SYSTEM'),
    ('USER',    '일반 사용자',    '기본 사용 권한',        'SYSTEM');
```

---

### 3.4 TB_USER_ROLE (사용자-역할 매핑)

사용자와 역할의 N:M 관계를 관리합니다.

```sql
CREATE TABLE TB_USER_ROLE (
    USER_ID         INT             NOT NULL,                 -- 사용자 ID (FK)
    ROLE_ID         INT             NOT NULL,                 -- 권한 ID (FK)
    GRANT_DT        DATETIME2       NOT NULL DEFAULT GETDATE(), -- 권한 부여 일시
    GRANT_USER      NVARCHAR(50)    NOT NULL,                 -- 권한 부여자
    EXPIRE_DT       DATETIME2           NULL,                 -- 권한 만료 일시 (NULL: 무기한)
    USE_YN          CHAR(1)         NOT NULL DEFAULT 'Y',

    CONSTRAINT PK_TB_USER_ROLE PRIMARY KEY (USER_ID, ROLE_ID),
    CONSTRAINT FK_TB_USER_ROLE_USER FOREIGN KEY (USER_ID)
        REFERENCES TB_USER (USER_ID),
    CONSTRAINT FK_TB_USER_ROLE_ROLE FOREIGN KEY (ROLE_ID)
        REFERENCES TB_ROLE (ROLE_ID),
    CONSTRAINT CHK_TB_USER_ROLE_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);
```

---

### 3.5 TB_LOGIN_LOG (로그인 이력)

보안 감사 및 접속 이력 추적을 위한 로그인/로그아웃 기록 테이블입니다.

```sql
CREATE TABLE TB_LOGIN_LOG (
    LOG_ID          BIGINT          NOT NULL IDENTITY(1,1),   -- 로그 일련번호 (PK)
    USER_ID         INT                 NULL,                 -- 사용자 ID (실패 시 NULL 가능)
    LOGIN_ID        NVARCHAR(50)    NOT NULL,                 -- 입력된 로그인 ID
    LOGIN_DT        DATETIME2       NOT NULL DEFAULT GETDATE(), -- 로그인 시도 일시
    LOGOUT_DT       DATETIME2           NULL,                 -- 로그아웃 일시
    IP_ADDR         NVARCHAR(50)    NOT NULL,                 -- 접속 IP 주소
    USER_AGENT      NVARCHAR(500)       NULL,                 -- 브라우저/디바이스 정보
    SUCCESS_YN      CHAR(1)         NOT NULL,                 -- 성공 여부 (Y/N)
    FAIL_REASON     NVARCHAR(200)       NULL,                 -- 실패 사유

    CONSTRAINT PK_TB_LOGIN_LOG PRIMARY KEY (LOG_ID),
    CONSTRAINT FK_TB_LOGIN_LOG_USER FOREIGN KEY (USER_ID)
        REFERENCES TB_USER (USER_ID),
    CONSTRAINT CHK_TB_LOGIN_LOG_SUCCESS CHECK (SUCCESS_YN IN ('Y', 'N'))
);

-- 조회 성능을 위한 인덱스
CREATE INDEX IX_TB_LOGIN_LOG_USER_ID   ON TB_LOGIN_LOG (USER_ID);
CREATE INDEX IX_TB_LOGIN_LOG_LOGIN_DT  ON TB_LOGIN_LOG (LOGIN_DT DESC);
CREATE INDEX IX_TB_LOGIN_LOG_IP_ADDR   ON TB_LOGIN_LOG (IP_ADDR);
```

---

### 3.6 TB_TOKEN_BLACKLIST (JWT 토큰 블랙리스트)

로그아웃 또는 강제 만료된 JWT 토큰을 관리합니다.

```sql
CREATE TABLE TB_TOKEN_BLACKLIST (
    TOKEN_ID        BIGINT          NOT NULL IDENTITY(1,1),   -- 토큰 일련번호 (PK)
    JTI             NVARCHAR(100)   NOT NULL,                 -- JWT ID (토큰 고유 식별자)
    USER_ID         INT             NOT NULL,                 -- 사용자 ID (FK)
    ISSUED_DT       DATETIME2       NOT NULL,                 -- 토큰 발급 일시
    EXPIRE_DT       DATETIME2       NOT NULL,                 -- 토큰 만료 일시
    REVOKE_DT       DATETIME2       NOT NULL DEFAULT GETDATE(), -- 무효화 일시
    REVOKE_REASON   NVARCHAR(100)       NULL,                 -- 무효화 사유 (LOGOUT, FORCE_EXPIRE 등)

    CONSTRAINT PK_TB_TOKEN_BLACKLIST PRIMARY KEY (TOKEN_ID),
    CONSTRAINT UQ_TB_TOKEN_BLACKLIST_JTI UNIQUE (JTI),
    CONSTRAINT FK_TB_TOKEN_BLACKLIST_USER FOREIGN KEY (USER_ID)
        REFERENCES TB_USER (USER_ID)
);

-- 만료된 토큰 자동 정리를 위한 인덱스
CREATE INDEX IX_TB_TOKEN_BLACKLIST_JTI        ON TB_TOKEN_BLACKLIST (JTI);
CREATE INDEX IX_TB_TOKEN_BLACKLIST_EXPIRE_DT  ON TB_TOKEN_BLACKLIST (EXPIRE_DT);
```

---

## 4. 초기 데이터 스크립트

### 4.1 기본 부서 데이터

```sql
-- 최상위 부서
INSERT INTO TB_DEPT (DEPT_CD, DEPT_NM, DEPT_ENG_NM, PARENT_DEPT_CD, DEPT_LEVEL, SORT_ORDER, CREATE_USER)
VALUES
    ('D001', '경영지원본부',   'Management Support HQ', NULL,   1, 10, 'SYSTEM'),
    ('D002', '생산기술본부',   'Production Tech HQ',    NULL,   1, 20, 'SYSTEM'),
    ('D003', '품질보증본부',   'Quality Assurance HQ',  NULL,   1, 30, 'SYSTEM'),
    ('D004', '영업본부',       'Sales HQ',              NULL,   1, 40, 'SYSTEM');

-- 하위 부서
INSERT INTO TB_DEPT (DEPT_CD, DEPT_NM, DEPT_ENG_NM, PARENT_DEPT_CD, DEPT_LEVEL, SORT_ORDER, CREATE_USER)
VALUES
    ('D011', '인사팀',         'HR Team',               'D001', 2, 11, 'SYSTEM'),
    ('D012', 'IT팀',           'IT Team',               'D001', 2, 12, 'SYSTEM'),
    ('D021', '공정기술팀',     'Process Tech Team',     'D002', 2, 21, 'SYSTEM'),
    ('D031', '품질관리팀',     'QC Team',               'D003', 2, 31, 'SYSTEM');
```

### 4.2 관리자 계정 생성

```sql
-- 비밀번호는 반드시 애플리케이션에서 bcrypt 해시 처리 후 INSERT
-- 아래는 예시 (실제 운영 시 비밀번호 변경 필수)
INSERT INTO TB_USER (LOGIN_ID, PASSWORD, USER_NAME, EMAIL, DEPT_CD, POSITION_NM, CREATE_USER)
VALUES (
    'admin',
    -- bcrypt hash of 'Admin@1234!' (cost=12)
    '$2b$12$examplehashvaluehere...',
    '시스템관리자',
    'admin@seahsp.co.kr',
    'D012',
    '팀장',
    'SYSTEM'
);

-- 관리자 권한 부여
INSERT INTO TB_USER_ROLE (USER_ID, ROLE_ID, GRANT_USER)
SELECT u.USER_ID, r.ROLE_ID, 'SYSTEM'
FROM TB_USER u, TB_ROLE r
WHERE u.LOGIN_ID = 'admin' AND r.ROLE_CD = 'ADMIN';
```

---

## 5. 공통 유지보수 쿼리

### 5.1 계정 잠금 해제

```sql
UPDATE TB_USER
SET    LOCK_YN        = 'N',
       LOGIN_FAIL_CNT = 0,
       UPDATE_DT      = GETDATE(),
       UPDATE_USER    = '관리자ID'
WHERE  LOGIN_ID = '대상_로그인ID';
```

### 5.2 비밀번호 초기화

```sql
-- 1. 애플리케이션에서 신규 해시 생성 후 UPDATE
UPDATE TB_USER
SET    PASSWORD      = '새_bcrypt_해시값',
       PWD_CHANGE_DT = GETDATE(),
       LOGIN_FAIL_CNT = 0,
       LOCK_YN       = 'N',
       UPDATE_DT     = GETDATE(),
       UPDATE_USER   = '관리자ID'
WHERE  LOGIN_ID = '대상_로그인ID';
```

### 5.3 만료된 블랙리스트 토큰 정리 (배치용)

```sql
-- 만료된 토큰 삭제 (스케줄러에서 주기적으로 실행)
DELETE FROM TB_TOKEN_BLACKLIST
WHERE  EXPIRE_DT < GETDATE();
```

### 5.4 최근 로그인 실패 조회

```sql
SELECT TOP 100
    u.LOGIN_ID,
    u.USER_NAME,
    l.IP_ADDR,
    l.LOGIN_DT,
    l.FAIL_REASON
FROM   TB_LOGIN_LOG l
LEFT   JOIN TB_USER u ON l.USER_ID = u.USER_ID
WHERE  l.SUCCESS_YN = 'N'
ORDER  BY l.LOGIN_DT DESC;
```

---

## 6. 변경 이력

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0 | 2026-02-25 | Claude | 최초 작성 - 사용자 인증 관련 테이블 설계 |
