"""
System API 엔드포인트
시스템 관리 및 모니터링 관련 API
"""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.config import settings
from server.app.core.database import get_db
from server.app.domain.system.repositories import ConnectionTestRepository
from server.app.domain.system.schemas import DBCheckResponse, MSSQLConnectionRequest

router = APIRouter(prefix="/system", tags=["system"])


def test_mssql_connection(config: MSSQLConnectionRequest) -> bool:
    """
    MSSQL 데이터베이스 연결 테스트

    Args:
        config: MSSQL 연결 정보

    Returns:
        bool: 연결 성공 시 True

    Raises:
        HTTPException: 연결 실패 시 500 에러
    """
    try:
        import pymssql

        # 연결 시도 (pymssql은 ODBC 드라이버 없이 직접 연결)
        conn = pymssql.connect(
            server=config.server,
            user=config.username,
            password=config.password,
            database=config.database,
            timeout=config.timeout,
            login_timeout=config.timeout,
        )
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        conn.close()

        return True
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="pymssql 패키지가 설치되지 않았습니다. pip install pymssql을 실행하세요.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"MSSQL 연결 실패: {str(e)}",
        )


@router.get(
    "/db-check",
    response_model=DBCheckResponse,
    summary="데이터베이스 연결 테스트",
    description="Supabase 데이터베이스 연결 상태를 확인하고 테스트 메시지를 반환합니다.",
)
async def check_database_connection(
    db: AsyncSession = Depends(get_db),
) -> DBCheckResponse:
    """
    데이터베이스 연결 테스트

    connection_tests 테이블에서 가장 최근 레코드를 조회하여
    데이터베이스 연결 상태를 확인합니다.

    Args:
        db: 데이터베이스 세션 (자동 주입)

    Returns:
        DBCheckResponse: 연결 상태 및 메시지

    Raises:
        HTTPException: 데이터베이스 조회 실패 시 500 에러
    """
    try:
        # Repository를 사용하여 데이터 조회
        repository = ConnectionTestRepository(db)
        connection_test = await repository.provide()

        if connection_test is None:
            raise HTTPException(
                status_code=404,
                detail="connection_tests 테이블에 데이터가 없습니다. supabase_schema.sql을 실행하세요.",
            )

        return DBCheckResponse(
            success=True,
            message=connection_test.message,
            timestamp=datetime.utcnow(),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"데이터베이스 연결 테스트 실패: {str(e)}",
        )


@router.post(
    "/mssql-check",
    response_model=DBCheckResponse,
    summary="MSSQL 데이터베이스 연결 테스트",
    description="사용자가 입력한 MSSQL 연결 정보로 연결 테스트를 수행합니다.",
)
async def check_mssql_connection(config: MSSQLConnectionRequest) -> DBCheckResponse:
    """
    MSSQL 데이터베이스 연결 테스트

    요청 바디로 받은 MSSQL 연결 정보로 실제 연결을 시도합니다.
    민감한 정보는 저장되지 않으며 연결 테스트에만 사용됩니다.

    Args:
        config: MSSQL 연결 정보 (서버, 데이터베이스, 사용자명, 비밀번호 등)

    Returns:
        DBCheckResponse: 연결 상태 및 메시지

    Raises:
        HTTPException: 연결 실패 시 500 에러
    """
    try:
        test_mssql_connection(config)

        return DBCheckResponse(
            success=True,
            message=f"MSSQL 데이터베이스 연결 성공! (Server: {config.server}, Database: {config.database})",
            timestamp=datetime.utcnow(),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"MSSQL 데이터베이스 연결 테스트 실패: {str(e)}",
        )
