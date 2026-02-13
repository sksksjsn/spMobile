#!/usr/bin/env python3
"""MSSQL 연결 테스트 스크립트"""
import pymssql
from datetime import datetime

# 연결 정보
server = "172.17.1.36"
database = "SEAH_SP"
username = "SeahSP"
password = "SeahSP#"

print(f"[{datetime.now()}] MSSQL 연결 테스트 시작...")
print(f"서버: {server}")
print(f"데이터베이스: {database}")
print(f"사용자: {username}")
print("-" * 50)

try:
    # 연결 시도 (포트 명시)
    print("연결 중...")
    conn = pymssql.connect(
        server=server,
        port=1433,
        user=username,
        password=password,
        database=database,
        timeout=3
    )

    print("✅ 연결 성공!")

    # 간단한 쿼리 테스트
    cursor = conn.cursor()
    cursor.execute("SELECT @@VERSION")
    version = cursor.fetchone()

    print("\n📊 SQL Server 버전:")
    print(version[0])

    # 데이터베이스 정보
    cursor.execute("SELECT DB_NAME()")
    db_name = cursor.fetchone()
    print(f"\n📁 현재 데이터베이스: {db_name[0]}")

    # 테이블 목록 (상위 10개)
    cursor.execute("""
        SELECT TOP 10 TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
    """)
    tables = cursor.fetchall()

    if tables:
        print(f"\n📋 테이블 목록 (상위 10개):")
        for idx, table in enumerate(tables, 1):
            print(f"  {idx}. {table[0]}")

    cursor.close()
    conn.close()

    print("\n" + "=" * 50)
    print("✅ 연결 테스트 완료!")

except pymssql.Error as e:
    print(f"\n❌ 연결 실패!")
    print(f"오류: {e}")
except Exception as e:
    print(f"\n❌ 예외 발생!")
    print(f"오류: {type(e).__name__}: {e}")
