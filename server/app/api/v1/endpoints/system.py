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
from server.app.domain.system.schemas import DBCheckResponse

router = APIRouter(prefix="/system", tags=["system"])


def test_mssql_connection() -> bool:
    """
    MSSQL 데이터베이스 연결 테스트

    환경변수 MSSQL_ENABLED=False인 경우 Mock 응답을 반환합니다.
    환경변수 MSSQL_ENABLED=True인 경우 실제 MSSQL 서버에 연결을 시도합니다.

    Returns:
        bool: 연결 성공 시 True

    Raises:
        HTTPException: 연결 실패 시 500 에러
    """
    # Mock 모드: MSSQL 서버 없이 성공 응답
    if not settings.MSSQL_ENABLED:
        return True

    # 실제 MSSQL 연결 시도
    try:
        import pyodbc

        # 환경변수에서 MSSQL 연결 정보 가져오기
        connection_string = (
            f"DRIVER={{{settings.MSSQL_DRIVER}}};"
            f"SERVER={settings.MSSQL_SERVER};"
            f"DATABASE={settings.MSSQL_DATABASE};"
            f"UID={settings.MSSQL_USER};"
            f"PWD={settings.MSSQL_PASSWORD};"
        )

        # 연결 시도
        conn = pyodbc.connect(connection_string, timeout=settings.MSSQL_TIMEOUT)
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        conn.close()

        return True
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="pyodbc 패키지가 설치되지 않았습니다. pip install pyodbc를 실행하세요.",
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


@router.get(
    "/mssql-check",
    response_model=DBCheckResponse,
    summary="MSSQL 데이터베이스 연결 테스트",
    description="MSSQL 데이터베이스 연결 상태를 확인합니다.",
)
async def check_mssql_connection() -> DBCheckResponse:
    """
    MSSQL 데이터베이스 연결 테스트

    MSSQL_ENABLED=False(기본값): Mock 응답 반환
    MSSQL_ENABLED=True: 실제 MSSQL 서버에 연결 시도

    Returns:
        DBCheckResponse: 연결 상태 및 메시지

    Raises:
        HTTPException: 연결 실패 시 500 에러
    """
    try:
        test_mssql_connection()

        # Mock 모드와 실제 연결 모드에 따라 다른 메시지 반환
        if settings.MSSQL_ENABLED:
            message = f"MSSQL 데이터베이스 연결 성공! (Server: {settings.MSSQL_SERVER})"
        else:
            message = "MSSQL 연결 테스트 성공! (Mock 모드 - .env에서 MSSQL_ENABLED=True로 설정하여 실제 연결 테스트)"

        return DBCheckResponse(
            success=True,
            message=message,
            timestamp=datetime.utcnow(),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"MSSQL 데이터베이스 연결 테스트 실패: {str(e)}",
        )
