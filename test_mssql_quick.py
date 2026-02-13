#!/usr/bin/env python3
"""MSSQL 빠른 연결 테스트"""
import pymssql
import sys
import traceback

# 연결 정보
config = {
    "server": "172.17.1.36",
    "port": 1433,
    "user": "SeahSP",
    "password": "SeahSP#",
    "database": "SEAH_SP",
    "timeout": 2,
    "login_timeout": 2
}

print("=" * 60)
print("MSSQL 연결 테스트")
print("=" * 60)
print(f"서버: {config['server']}:{config['port']}")
print(f"데이터베이스: {config['database']}")
print(f"사용자: {config['user']}")
print(f"타임아웃: {config['timeout']}초")
print("-" * 60)

try:
    print("\n🔄 연결 시도 중...")
    sys.stdout.flush()

    conn = pymssql.connect(**config)

    print("✅ 연결 성공!\n")

    # 버전 확인
    cursor = conn.cursor()
    cursor.execute("SELECT @@VERSION AS Version")
    row = cursor.fetchone()
    print(f"📌 SQL Server 버전:\n{row[0]}\n")

    # 현재 DB 확인
    cursor.execute("SELECT DB_NAME() AS CurrentDB")
    row = cursor.fetchone()
    print(f"✅ 현재 데이터베이스: {row[0]}\n")

    cursor.close()
    conn.close()

    print("=" * 60)
    print("✅ 테스트 완료!")
    print("=" * 60)

except pymssql.OperationalError as e:
    print(f"\n❌ 연결 실패 (Operational Error)")
    print(f"상세: {e}")
    print("\n가능한 원인:")
    print("  - 서버 주소 또는 포트 오류")
    print("  - 네트워크 연결 불가")
    print("  - 방화벽 차단")
    print("  - SQL Server가 실행되지 않음")
    sys.exit(1)

except pymssql.InterfaceError as e:
    print(f"\n❌ 인터페이스 오류")
    print(f"상세: {e}")
    print("\n가능한 원인:")
    print("  - 잘못된 연결 파라미터")
    print("  - pymssql 라이브러리 문제")
    sys.exit(1)

except pymssql.DatabaseError as e:
    print(f"\n❌ 데이터베이스 오류")
    print(f"상세: {e}")
    print("\n가능한 원인:")
    print("  - 잘못된 사용자명 또는 비밀번호")
    print("  - 데이터베이스가 존재하지 않음")
    print("  - 권한 부족")
    sys.exit(1)

except Exception as e:
    print(f"\n❌ 예상치 못한 오류")
    print(f"오류 타입: {type(e).__name__}")
    print(f"상세: {e}")
    print(f"\n전체 스택:")
    traceback.print_exc()
    sys.exit(1)
