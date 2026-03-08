"""
Logistics 도메인 스키마
반출입 기본정보(AW01010) + 물품목록(AW01011) 요청/응답 모델
"""

import json
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# ── 물품 스키마 ────────────────────────────────────────────────────────────────

class ItemSchema(BaseModel):
    """물품 정보 (AW01011 단건)"""

    item_seq: int = Field(alias="itemSeq", description="순번")
    item_name: str = Field(alias="itemName", description="자재명")
    item_spec: Optional[str] = Field(None, alias="itemSpec", description="규격")
    unit_code: Optional[str] = Field(None, alias="unitCode", description="단위코드")
    maker: Optional[str] = Field(None, description="메이커")
    quantity: Optional[float] = Field(None, description="수량")
    reason: Optional[str] = Field(None, description="반출 사유")
    note: Optional[str] = Field(None, description="비고")
    photos: list[str] = Field(default_factory=list, description="사진 목록(base64)")

    model_config = {"populate_by_name": True}


class ItemCreateSchema(BaseModel):
    """물품 생성 요청"""

    item_name: str = Field(alias="itemName", description="자재명")
    item_spec: Optional[str] = Field(None, alias="itemSpec", description="규격")
    unit_code: Optional[str] = Field(None, alias="unitCode", description="단위코드")
    maker: Optional[str] = Field(None, description="메이커")
    quantity: Optional[float] = Field(None, description="수량")
    reason: Optional[str] = Field(None, description="반출 사유")
    note: Optional[str] = Field(None, description="비고")
    photos: list[str] = Field(default_factory=list, description="사진 목록(base64)")

    model_config = {"populate_by_name": True}


# ── 반출입 목록 응답 스키마 ───────────────────────────────────────────────────

class LogisticsListItemSchema(BaseModel):
    """반출입 목록 아이템 (카드 표시용)"""

    doc_no: str = Field(alias="docNo", description="반출입번호")
    out_site: str = Field(alias="outSite", description="반출 사업장코드")
    out_site_name: str = Field(alias="outSiteName", description="반출 사업장명")
    department: Optional[str] = Field(None, description="작성 담당자 부서")
    manager: Optional[str] = Field(None, description="작성 담당자명")
    company: Optional[str] = Field(None, description="협력업체")
    material: Optional[str] = Field(None, description="대표 자재명")
    quantity: Optional[float] = Field(None, description="대표 수량")
    unit: Optional[str] = Field(None, description="대표 단위코드")
    security_check: str = Field(alias="securityCheck", default="N", description="경비실 확인 여부")
    receiver_check: str = Field(alias="receiverCheck", default="N", description="인수자 확인 여부")
    status: str = Field(description="상태(반출/반입)")
    reg_dt: Optional[str] = Field(None, alias="regDt", description="등록 일시")

    model_config = {"populate_by_name": True}


class LogisticsListResponse(BaseModel):
    """반출입 목록 응답"""

    items: list[LogisticsListItemSchema]
    total: int


# ── 반출입 상세 스키마 ────────────────────────────────────────────────────────

class LogisticsDetailSchema(BaseModel):
    """반출입 상세 정보"""

    doc_no: str = Field(alias="docNo", description="반출입번호")
    busi_place: str = Field(alias="busiPlace", description="반출 사업장코드")
    export_date: Optional[str] = Field(None, alias="exportDate", description="반출 일자")
    author_name: Optional[str] = Field(None, alias="authorName", description="작성 담당자명")
    author_dept: Optional[str] = Field(None, alias="authorDept", description="작성 담당자 부서코드")
    author_phone: Optional[str] = Field(None, alias="authorPhone", description="작성 담당자 연락처")
    partner_company: Optional[str] = Field(None, alias="partnerCompany", description="협력업체")
    receiver_name: Optional[str] = Field(None, alias="receiverName", description="협력업체 인수자명")
    receiver_phone: Optional[str] = Field(None, alias="receiverPhone", description="협력업체 인수자 전화번호")
    transport_type: Optional[str] = Field(None, alias="transportType", description="운송 유형 코드")
    driver_name: Optional[str] = Field(None, alias="driverName", description="직납 운전자 성명")
    driver_phone: Optional[str] = Field(None, alias="driverPhone", description="직납 운전자 연락처")
    driver_vehicle_no: Optional[str] = Field(None, alias="driverVehicleNo", description="직납 운전자 차량번호")
    courier_name: Optional[str] = Field(None, alias="courierName", description="택배사명")
    courier_invoice_no: Optional[str] = Field(None, alias="courierInvoiceNo", description="송장번호")
    status: str = Field(description="상태(반출/반입)")
    security_check_yn: str = Field(alias="securityCheckYn", default="N", description="경비실 확인 여부")
    receiver_check_yn: str = Field(alias="receiverCheckYn", default="N", description="인수자 확인 여부")
    items: list[ItemSchema] = Field(default_factory=list, description="물품 목록")

    model_config = {"populate_by_name": True}


# ── 반출 등록 요청 스키마 ─────────────────────────────────────────────────────

class LogisticsCreateRequest(BaseModel):
    """반출 등록 요청"""

    busi_place: str = Field(alias="busiPlace", description="반출 사업장코드")
    export_date: str = Field(alias="exportDate", description="반출 일자 (YYYY-MM-DD)")
    author_name: str = Field(alias="authorName", description="작성 담당자명")
    author_dept: str = Field(alias="authorDept", description="작성 담당자 부서코드")
    author_phone: Optional[str] = Field(None, alias="authorPhone", description="작성 담당자 연락처")
    partner_company: str = Field(alias="partnerCompany", description="협력업체")
    receiver_name: Optional[str] = Field(None, alias="receiverName", description="협력업체 인수자명")
    receiver_phone: Optional[str] = Field(None, alias="receiverPhone", description="협력업체 인수자 전화번호")
    transport_type: str = Field(alias="transportType", description="운송 유형 코드")
    driver_name: Optional[str] = Field(None, alias="driverName", description="직납 운전자 성명")
    driver_phone: Optional[str] = Field(None, alias="driverPhone", description="직납 운전자 연락처")
    driver_vehicle_no: Optional[str] = Field(None, alias="driverVehicleNo", description="직납 운전자 차량번호")
    courier_name: Optional[str] = Field(None, alias="courierName", description="택배사명")
    courier_invoice_no: Optional[str] = Field(None, alias="courierInvoiceNo", description="송장번호")
    items: list[ItemCreateSchema] = Field(description="물품 목록")

    model_config = {"populate_by_name": True}


# ── 반출입 수정 요청 스키마 ───────────────────────────────────────────────────

class LogisticsUpdateRequest(BaseModel):
    """반출입 수정 요청"""

    export_date: Optional[str] = Field(None, alias="exportDate", description="반출 일자")
    author_name: Optional[str] = Field(None, alias="authorName", description="작성 담당자명")
    author_dept: Optional[str] = Field(None, alias="authorDept", description="작성 담당자 부서코드")
    author_phone: Optional[str] = Field(None, alias="authorPhone", description="작성 담당자 연락처")
    partner_company: Optional[str] = Field(None, alias="partnerCompany", description="협력업체")
    receiver_name: Optional[str] = Field(None, alias="receiverName", description="협력업체 인수자명")
    receiver_phone: Optional[str] = Field(None, alias="receiverPhone", description="협력업체 인수자 전화번호")
    transport_type: Optional[str] = Field(None, alias="transportType", description="운송 유형 코드")
    driver_name: Optional[str] = Field(None, alias="driverName", description="직납 운전자 성명")
    driver_phone: Optional[str] = Field(None, alias="driverPhone", description="직납 운전자 연락처")
    driver_vehicle_no: Optional[str] = Field(None, alias="driverVehicleNo", description="직납 운전자 차량번호")
    courier_name: Optional[str] = Field(None, alias="courierName", description="택배사명")
    courier_invoice_no: Optional[str] = Field(None, alias="courierInvoiceNo", description="송장번호")
    status: Optional[str] = Field(None, description="상태(반출/반입)")
    security_check_yn: Optional[str] = Field(None, alias="securityCheckYn", description="경비실 확인 여부")
    receiver_check_yn: Optional[str] = Field(None, alias="receiverCheckYn", description="인수자 확인 여부")
    items: Optional[list[ItemCreateSchema]] = Field(None, description="물품 목록 (전체 교체)")

    model_config = {"populate_by_name": True}


# ── 검색 파라미터 스키마 ──────────────────────────────────────────────────────

class LogisticsSearchParams(BaseModel):
    """반출입 검색 파라미터"""

    out_site: Optional[str] = None
    out_dept: Optional[str] = None
    in_site: Optional[str] = None
    company: Optional[str] = None
    material: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None


# ── 단순 응답 스키마 ──────────────────────────────────────────────────────────

class DocNoResponse(BaseModel):
    """반출입번호 응답"""

    doc_no: str = Field(alias="docNo", description="반출입번호")

    model_config = {"populate_by_name": True}
