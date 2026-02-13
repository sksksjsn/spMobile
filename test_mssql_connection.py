"""
MSSQL Connection Test Script
Tests connection to SEAH_SP database
"""
import sys

def test_pymssql():
    """Test using pymssql library"""
    try:
        import pymssql
        print("✓ pymssql library available")

        conn = pymssql.connect(
            server='172.17.1.36',
            port='1433',
            user='SeahSP',
            password='SeahSP#',
            database='SEAH_SP',
            timeout=10
        )
        print("✓ Connection successful using pymssql!")

        cursor = conn.cursor()
        cursor.execute("SELECT @@VERSION")
        version = cursor.fetchone()
        print(f"✓ Database version: {version[0][:100]}...")

        cursor.close()
        conn.close()
        return True

    except ImportError:
        print("✗ pymssql not installed")
        return False
    except Exception as e:
        print(f"✗ pymssql connection failed: {type(e).__name__}: {e}")
        return False


def test_pyodbc():
    """Test using pyodbc library"""
    try:
        import pyodbc
        print("\n✓ pyodbc library available")

        # List available drivers
        drivers = pyodbc.drivers()
        print(f"✓ Available ODBC drivers: {drivers}")

        if not drivers:
            print("✗ No ODBC drivers found")
            return False

        # Try different connection strings
        connection_strings = [
            f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER=172.17.1.36,1433;DATABASE=SEAH_SP;UID=SeahSP;PWD=SeahSP#;TrustServerCertificate=yes',
            f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER=172.17.1.36,1433;DATABASE=SEAH_SP;UID=SeahSP;PWD=SeahSP#;TrustServerCertificate=yes',
            f'DRIVER={{FreeTDS}};SERVER=172.17.1.36;PORT=1433;DATABASE=SEAH_SP;UID=SeahSP;PWD=SeahSP#;TDS_Version=8.0',
        ]

        for i, conn_str in enumerate(connection_strings, 1):
            try:
                print(f"\n  Attempt {i}: {conn_str.split(';')[0]}...")
                conn = pyodbc.connect(conn_str, timeout=10)
                print(f"  ✓ Connection successful!")

                cursor = conn.cursor()
                cursor.execute("SELECT @@VERSION")
                version = cursor.fetchone()
                print(f"  ✓ Database version: {version[0][:100]}...")

                cursor.close()
                conn.close()
                return True

            except Exception as e:
                print(f"  ✗ Failed: {type(e).__name__}: {e}")
                continue

        return False

    except ImportError:
        print("✗ pyodbc not installed")
        return False
    except Exception as e:
        print(f"✗ pyodbc test failed: {type(e).__name__}: {e}")
        return False


def test_sqlalchemy():
    """Test using SQLAlchemy with pymssql or pyodbc"""
    try:
        from sqlalchemy import create_engine, text
        from sqlalchemy.pool import NullPool
        print("\n✓ SQLAlchemy available")

        # Try pymssql first
        try:
            import pymssql
            url = "mssql+pymssql://SeahSP:SeahSP%23@172.17.1.36:1433/SEAH_SP"
            print(f"  Trying: {url.replace('SeahSP#', '***')}")

            engine = create_engine(
                url,
                poolclass=NullPool,
                connect_args={"timeout": 10}
            )

            with engine.connect() as conn:
                result = conn.execute(text("SELECT @@VERSION"))
                version = result.fetchone()
                print(f"  ✓ SQLAlchemy + pymssql connection successful!")
                print(f"  ✓ Database version: {version[0][:100]}...")
                return True

        except ImportError:
            print("  ✗ pymssql not available for SQLAlchemy")
        except Exception as e:
            print(f"  ✗ SQLAlchemy + pymssql failed: {type(e).__name__}: {e}")

        # Try pyodbc
        try:
            import pyodbc
            # URL encode the password
            url = "mssql+pyodbc://SeahSP:SeahSP%23@172.17.1.36:1433/SEAH_SP?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes"
            print(f"\n  Trying: {url.replace('SeahSP%23', '***')}")

            engine = create_engine(
                url,
                poolclass=NullPool,
                connect_args={"timeout": 10}
            )

            with engine.connect() as conn:
                result = conn.execute(text("SELECT @@VERSION"))
                version = result.fetchone()
                print(f"  ✓ SQLAlchemy + pyodbc connection successful!")
                print(f"  ✓ Database version: {version[0][:100]}...")
                return True

        except ImportError:
            print("  ✗ pyodbc not available for SQLAlchemy")
        except Exception as e:
            print(f"  ✗ SQLAlchemy + pyodbc failed: {type(e).__name__}: {e}")

        return False

    except ImportError:
        print("✗ SQLAlchemy not installed")
        return False
    except Exception as e:
        print(f"✗ SQLAlchemy test failed: {type(e).__name__}: {e}")
        return False


def main():
    print("=" * 70)
    print("MSSQL Connection Test")
    print("=" * 70)
    print(f"Server: 172.17.1.36:1433")
    print(f"Database: SEAH_SP")
    print(f"Username: SeahSP")
    print("=" * 70)

    results = []

    # Test pymssql
    print("\n[1] Testing pymssql...")
    print("-" * 70)
    results.append(("pymssql", test_pymssql()))

    # Test pyodbc
    print("\n[2] Testing pyodbc...")
    print("-" * 70)
    results.append(("pyodbc", test_pyodbc()))

    # Test SQLAlchemy
    print("\n[3] Testing SQLAlchemy...")
    print("-" * 70)
    results.append(("SQLAlchemy", test_sqlalchemy()))

    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    for method, success in results:
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"{method:20s}: {status}")
    print("=" * 70)

    if any(success for _, success in results):
        print("\n✓ At least one connection method works!")
        return 0
    else:
        print("\n✗ All connection methods failed")
        print("\nTroubleshooting steps:")
        print("1. Check network connectivity: ping 172.17.1.36")
        print("2. Check if port 1433 is accessible: telnet 172.17.1.36 1433")
        print("3. Verify credentials with database administrator")
        print("4. Check firewall settings")
        print("5. Verify SQL Server allows remote connections")
        print("6. Check if SQL Server Browser service is running")
        return 1


if __name__ == "__main__":
    sys.exit(main())
