"""
Common 도메인 스키마
사업장, 부서 응답 모델
"""

from pydantic import BaseModel, Field


class SiteSchema(BaseModel):
    """사업장 정보"""

    busi_place: str = Field(alias="busiPlace", description="사업장 코드")
    busi_place_name: str = Field(alias="busiPlaceName", description="사업장명")

    model_config = {"populate_by_name": True}


class DeptSchema(BaseModel):
    """부서 정보"""

    dept_code: str = Field(alias="deptCode", description="부서 코드")
    dept_name: str = Field(alias="deptName", description="부서명")
    busi_place: str = Field(alias="busiPlace", description="소속 사업장 코드")

    model_config = {"populate_by_name": True}


class SitesDeptResponse(BaseModel):
    """사업장 + 부서 목록 응답"""

    sites: list[SiteSchema]
    depts: list[DeptSchema]
