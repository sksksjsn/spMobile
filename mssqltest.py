"""
MSSQL 연결 테스트 스크립트

.env 파일에 설정된 MSSQL 정보로 연결을 시도하고
SELECT 1 쿼리를 실행하여 연결 상태를 확인합니다.

사용법:
    python mssqltest.py
"""

import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()


def test_mssql_connection():
    """MSSQL 연결 테스트"""
    print("=" * 60)
    print("MSSQL 연결 테스트 시작")
    print("=" * 60)

    # .env에서 설정 읽기
    server = os.getenv("MSSQL_HOST", "localhost")
    port = int(os.getenv("MSSQL_PORT", "1433"))
    database = os.getenv("MSSQL_DATABASE", "master")
    username = os.getenv("MSSQL_USER", "sa")
    password = os.getenv("MSSQL_PASSWORD", "")
    timeout = int(os.getenv("MSSQL_TIMEOUT", "30"))

    print(f"\n📋 연결 정보:")
    print(f"   - 서버: {server}:{port}")
    print(f"   - 데이터베이스: {database}")
    print(f"   - 사용자: {username}")
    print(f"   - 타임아웃: {timeout}초")
    print(f"   - 비밀번호: {'*' * len(password) if password else '(설정되지 않음)'}")

    # pymssql 임포트 확인
    try:
        import pymssql
        print(f"\n✅ pymssql 패키지 설치됨 (버전: {pymssql.__version__})")
    except ImportError:
        print("\n❌ pymssql 패키지가 설치되지 않았습니다.")
        print("   설치 명령: pip install pymssql")
        return False

    # MSSQL 연결 시도
    print(f"\n🔌 MSSQL 서버 연결 시도 중...")

    try:
        # 연결
        conn = pymssql.connect(
            server=server,
            port=port,
            user=username,
            password=password,
            database=database,
            timeout=timeout,
            login_timeout=timeout,
        )
        print("✅ 연결 성공!")

        # SELECT 1 쿼리 실행
        print("\n📊 SELECT 1 쿼리 실행 중...")
        cursor = conn.cursor()
        cursor.execute("SELECT 1 AS test_value")
        result = cursor.fetchone()

        if result and result[0] == 1:
            print(f"✅ 쿼리 실행 성공! (결과: {result[0]})")
        else:
            print(f"⚠️  예상치 못한 결과: {result}")

        cursor.close()
        conn.close()

        print("\n" + "=" * 60)
        print("🎉 DB 연결 성공!")
        print("=" * 60)
        return True

    except pymssql.OperationalError as e:
        print(f"\n❌ 연결 실패 (Operational Error):")
        print(f"   {str(e)}")
        print("\n💡 해결 방법:")
        print("   1. MSSQL 서버가 실행 중인지 확인")
        print("   2. 서버 주소와 포트가 올바른지 확인")
        print("   3. 방화벽에서 1433 포트가 열려있는지 확인")
        print("   4. SQL Server가 TCP/IP 연결을 허용하는지 확인")
        return False

    except pymssql.InterfaceError as e:
        print(f"\n❌ 연결 실패 (Interface Error):")
        print(f"   {str(e)}")
        print("\n💡 해결 방법:")
        print("   1. 사용자명과 비밀번호가 올바른지 확인")
        print("   2. 데이터베이스 이름이 올바른지 확인")
        return False

    except Exception as e:
        print(f"\n❌ 연결 실패 (예상치 못한 오류):")
        print(f"   타입: {type(e).__name__}")
        print(f"   메시지: {str(e)}")
        return False


if __name__ == "__main__":
    success = test_mssql_connection()
    exit(0 if success else 1)
