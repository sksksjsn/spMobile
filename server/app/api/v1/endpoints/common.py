"""
Common API 엔드포인트
사업장, 부서 공통 마스터 데이터 제공
"""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.dependencies import get_current_user, get_database_session
from server.app.domain.common.schemas import SitesDeptResponse, UnitsResponse
from server.app.domain.common.service import CommonService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/common", tags=["common"])


@router.get(
    "/sites-depts",
    response_model=SitesDeptResponse,
    summary="사업장 + 부서 목록 조회",
    description="CM_BusiPlace(사업장)와 CM_CodeDetail(CODE_TYPE=MT20, 부서)를 함께 반환합니다.",
    response_model_by_alias=True,
)
async def get_sites_and_depts(
    db: AsyncSession = Depends(get_database_session),
    _current_user: dict = Depends(get_current_user),
) -> SitesDeptResponse:
    """사업장 + 부서 목록을 반환합니다."""
    service = CommonService(db)
    return await service.get_sites_and_depts()


@router.get(
    "/units",
    response_model=UnitsResponse,
    summary="단위 목록 조회",
    description="CM_CodeDetail(CODE_TYPE=MT35) 단위 목록을 반환합니다.",
    response_model_by_alias=True,
)
async def get_units(
    db: AsyncSession = Depends(get_database_session),
    _current_user: dict = Depends(get_current_user),
) -> UnitsResponse:
    """단위 목록을 반환합니다."""
    service = CommonService(db)
    return await service.get_units()
