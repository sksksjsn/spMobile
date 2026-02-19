-- ============================================================
-- MSSQL: spMobileDB 데이터베이스에 test_table 생성
-- ============================================================

-- 1. 데이터베이스가 없으면 생성
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'spMobileDB')
BEGIN
    CREATE DATABASE spMobileDB;
    PRINT 'spMobileDB 데이터베이스가 생성되었습니다.';
END
ELSE
BEGIN
    PRINT 'spMobileDB 데이터베이스가 이미 존재합니다.';
END
GO

-- 2. spMobileDB 사용
USE spMobileDB;
GO

-- 3. test_table이 없으면 생성
IF NOT EXISTS (
    SELECT name FROM sys.tables WHERE name = 'test_table'
)
BEGIN
    CREATE TABLE test_table (
        id   INT           IDENTITY(1,1) NOT NULL,
        name NVARCHAR(200) NOT NULL,
        CONSTRAINT PK_test_table PRIMARY KEY (id)
    );
    PRINT 'test_table이 생성되었습니다.';
END
ELSE
BEGIN
    PRINT 'test_table이 이미 존재합니다.';
END
GO

-- 4. 결과 확인
SELECT
    c.name        AS column_name,
    t.name        AS data_type,
    c.max_length,
    c.is_identity,
    c.is_nullable
FROM sys.columns c
JOIN sys.types   t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('test_table')
ORDER BY c.column_id;
GO
