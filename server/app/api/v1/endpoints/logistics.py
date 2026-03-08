"""
Logistics API 엔드포인트
반출입 등록, 조회, 수정, 삭제
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.dependencies import get_current_user, get_database_session
from server.app.domain.logistics.schemas import (
    DocNoResponse,
    LogisticsCreateRequest,
    LogisticsDetailSchema,
    LogisticsListResponse,
    LogisticsSearchParams,
    LogisticsUpdateRequest,
)
from server.app.domain.logistics.service import LogisticsService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/logistics", tags=["logistics"])


@router.get(
    "",
    response_model=LogisticsListResponse,
    summary="반출입 목록 조회",
    response_model_by_alias=True,
)
async def get_logistics_list(
    out_site: str | None = Query(None, alias="outSite", description="반출 사업장코드"),
    out_dept: str | None = Query(None, alias="outDept", description="반출 부서코드"),
    in_site: str | None = Query(None, alias="inSite", description="반입 사업장코드"),
    company: str | None = Query(None, description="협력업체명"),
    material: str | None = Query(None, description="자재명"),
    start_date: str | None = Query(None, alias="startDate", description="시작일 (YYYY-MM-DD)"),
    end_date: str | None = Query(None, alias="endDate", description="종료일 (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_database_session),
    _current_user: dict = Depends(get_current_user),
) -> LogisticsListResponse:
    """반출입 목록을 검색 조건으로 조회합니다."""
    params = LogisticsSearchParams(
        out_site=out_site,
        out_dept=out_dept,
        in_site=in_site,
        company=company,
        material=material,
        start_date=start_date,
        end_date=end_date,
        status=None,
    )
    service = LogisticsService(db)
    return await service.get_list(params)


@router.get(
    "/completed",
    response_model=LogisticsListResponse,
    summary="반출입 완료 목록 조회",
    response_model_by_alias=True,
)
async def get_logistics_completed(
    out_site: str | None = Query(None, alias="outSite"),
    out_dept: str | None = Query(None, alias="outDept"),
    company: str | None = Query(None),
    material: str | None = Query(None),
    start_date: str | None = Query(None, alias="startDate"),
    end_date: str | None = Query(None, alias="endDate"),
    db: AsyncSession = Depends(get_database_session),
    _current_user: dict = Depends(get_current_user),
) -> LogisticsListResponse:
    """반입 완료된 목록을 조회합니다."""
    params = LogisticsSearchParams(
        out_site=out_site,
        out_dept=out_dept,
        company=company,
        material=material,
        start_date=start_date,
        end_date=end_date,
        status="반입",
    )
    service = LogisticsService(db)
    return await service.get_list(params)


@router.get(
    "/{doc_no}",
    response_model=LogisticsDetailSchema,
    summary="반출입 상세 조회",
    response_model_by_alias=True,
)
async def get_logistics_detail(
    doc_no: str,
    db: AsyncSession = Depends(get_database_session),
    _current_user: dict = Depends(get_current_user),
) -> LogisticsDetailSchema:
    """반출입번호로 상세 정보를 조회합니다."""
    service = LogisticsService(db)
    result = await service.get_detail(doc_no)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"반출입 문서를 찾을 수 없습니다: {doc_no}",
        )
    return result


@router.post(
    "",
    response_model=DocNoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="반출 등록",
    response_model_by_alias=True,
)
async def create_logistics(
    req: LogisticsCreateRequest,
    db: AsyncSession = Depends(get_database_session),
    current_user: dict = Depends(get_current_user),
) -> DocNoResponse:
    """반출을 등록하고 생성된 반출입번호를 반환합니다."""
    login_id: str = current_user.get("login_id", "UNKNOWN")
    service = LogisticsService(db)
    return await service.create(req, login_id)


@router.put(
    "/{doc_no}",
    response_model=LogisticsDetailSchema,
    summary="반출입 수정",
    response_model_by_alias=True,
)
async def update_logistics(
    doc_no: str,
    req: LogisticsUpdateRequest,
    db: AsyncSession = Depends(get_database_session),
    current_user: dict = Depends(get_current_user),
) -> LogisticsDetailSchema:
    """반출입 정보를 수정합니다."""
    login_id: str = current_user.get("login_id", "UNKNOWN")
    service = LogisticsService(db)
    result = await service.update(doc_no, req, login_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"반출입 문서를 찾을 수 없습니다: {doc_no}",
        )
    return result


@router.delete(
    "/{doc_no}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="반출입 삭제",
)
async def delete_logistics(
    doc_no: str,
    db: AsyncSession = Depends(get_database_session),
    current_user: dict = Depends(get_current_user),
) -> None:
    """반출입 문서를 삭제합니다."""
    service = LogisticsService(db)
    deleted = await service.delete(doc_no)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"반출입 문서를 찾을 수 없습니다: {doc_no}",
        )
