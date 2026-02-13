#!/usr/bin/env python3
"""호스트 연결 테스트"""
import pymssql
import sys

# 시도할 서버 주소들
servers = [
    "host.docker.internal",
    "localhost",
    "127.0.0.1",
    "172.17.0.1",  # Docker bridge gateway
    "172.17.1.36",
]

config = {
    "port": 1433,
    "user": "SeahSP",
    "password": "SeahSP#",
    "database": "SEAH_SP",
    "timeout": 2,
}

print("=" * 60)
print("다양한 서버 주소로 MSSQL 연결 시도")
print("=" * 60)

for server in servers:
    print(f"\n🔄 시도 중: {server}:1433")
    try:
        conn = pymssql.connect(server=server, **config)
        cursor = conn.cursor()
        cursor.execute("SELECT @@VERSION")
        version = cursor.fetchone()
        cursor.close()
        conn.close()

        print(f"✅ 성공! 서버: {server}")
        print(f"   버전: {version[0][:50]}...")
        print(f"\n💡 사용할 서버 주소: {server}")
        sys.exit(0)

    except Exception as e:
        print(f"❌ 실패: {str(e)[:80]}")

print("\n" + "=" * 60)
print("❌ 모든 서버 주소 시도 실패")
print("=" * 60)
print("\n💡 다음을 확인하세요:")
print("  1. SQL Server가 실제로 어디서 실행 중인지")
print("  2. Docker 네트워크 설정")
print("  3. 방화벽 설정")
