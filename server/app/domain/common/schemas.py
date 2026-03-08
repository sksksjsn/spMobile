"""
Common 도메인 스키마
사업장, 부서, 단위, 운송유형 응답 모델
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


class UnitSchema(BaseModel):
    """단위 정보"""

    unit_code: str = Field(alias="unitCode", description="단위 코드")
    unit_name: str = Field(alias="unitName", description="단위명")

    model_config = {"populate_by_name": True}


class UnitsResponse(BaseModel):
    """단위 목록 응답"""

    units: list[UnitSchema]


class TransportTypeSchema(BaseModel):
    """운송 유형 정보"""

    tran_code: str = Field(alias="tranCode", description="운송 유형 코드")
    tran_name: str = Field(alias="tranName", description="운송 유형명")

    model_config = {"populate_by_name": True}


class TransportTypesResponse(BaseModel):
    """운송 유형 목록 응답"""

    transport_types: list[TransportTypeSchema] = Field(alias="transportTypes")

    model_config = {"populate_by_name": True}
