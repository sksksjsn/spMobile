"""
System 도메인 Pydantic 스키마
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ConnectionTestResponse(BaseModel):
    """DB 연결 테스트 응답"""

    id: int = Field(..., description="레코드 ID")
    message: str = Field(..., description="연결 메시지")
    created_at: datetime = Field(..., description="생성 시각")

    model_config = {"from_attributes": True}


class DBCheckResponse(BaseModel):
    """DB 연결 체크 응답"""

    success: bool = Field(..., description="연결 성공 여부")
    message: str = Field(..., description="연결 메시지")
    timestamp: datetime = Field(..., description="응답 시각")


class MSSQLConnectionRequest(BaseModel):
    """MSSQL 연결 테스트 요청"""

    driver: str = Field(
        default="ODBC Driver 17 for SQL Server",
        description="MSSQL ODBC 드라이버 이름"
    )
    server: str = Field(..., description="MSSQL 서버 주소")
    port: int = Field(default=1433, description="MSSQL 포트 번호", ge=1, le=65535)
    database: str = Field(default="master", description="데이터베이스명")
    username: str = Field(..., description="사용자명")
    password: str = Field(..., description="비밀번호")
    timeout: int = Field(default=5, description="연결 타임아웃 (초)", ge=1, le=30)
