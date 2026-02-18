"""
System 도메인 Pydantic 스키마
"""

from datetime import datetime

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


class TestTableItem(BaseModel):
    """TestTable 단일 레코드"""

    id: int = Field(..., description="레코드 ID")
    name: str = Field(..., description="이름")

    model_config = {"from_attributes": True}


class OrmTestResponse(BaseModel):
    """ORM 테스트 응답"""

    success: bool = Field(..., description="성공 여부")
    message: str = Field(..., description="결과 메시지")
    inserted: TestTableItem = Field(..., description="저장된 레코드")
    all_records: list[TestTableItem] = Field(..., description="전체 레코드 목록")


