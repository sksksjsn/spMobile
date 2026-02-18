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
    "/mssql-mcp-check",
    response_model=DBCheckResponse,
    summary="DB 연결 테스트 (MCP)",
    description="MCP 서버 설정(.env)을 사용하여 MSSQL에 연결하고 @@VERSION 정보를 반환합니다.",
)
async def check_mssql_mcp_connection() -> DBCheckResponse:
    """
    DB 연결 테스트 (MCP)

    .env 파일의 MSSQL 설정으로 연결 후 @@VERSION 정보를 조회합니다.
    """
    try:
        import pymssql

        conn = pymssql.connect(
            server=settings.MSSQL_HOST,
            port=settings.MSSQL_PORT,
            user=settings.MSSQL_USER,
            password=settings.MSSQL_PASSWORD,
            database=settings.MSSQL_DATABASE,
            timeout=settings.MSSQL_TIMEOUT,
            login_timeout=settings.MSSQL_TIMEOUT,
        )
        cursor = conn.cursor()
        cursor.execute("SELECT @@VERSION")
        row = cursor.fetchone()
        version_info = row[0] if row else "버전 정보를 가져올 수 없습니다."
        cursor.close()
        conn.close()

        return DBCheckResponse(
            success=True,
            message=f"✅ DB 연결 성공!\n\n{version_info}",
            timestamp=datetime.utcnow(),
        )

    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="pymssql 패키지가 설치되지 않았습니다. pip install pymssql을 실행하세요.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"DB 연결 실패 (MCP): {str(e)}",
        )
