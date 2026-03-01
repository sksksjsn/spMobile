"""
Board API 엔드포인트
공지사항 팝업 조회
"""

import logging

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.dependencies import get_current_user, get_database_session
from server.app.domain.board.schemas import PopupNoticeListResponse
from server.app.domain.board.service import BoardService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/board", tags=["board"])


@router.get(
    "/popup-notices",
    response_model=PopupNoticeListResponse,
    status_code=status.HTTP_200_OK,
    summary="팝업 공지사항 조회",
    description="로그인 후 표시할 팝업 공지사항 목록을 조회합니다.",
    response_model_by_alias=True,
)
async def get_popup_notices(
    db: AsyncSession = Depends(get_database_session),
    current_user: dict = Depends(get_current_user),
) -> PopupNoticeListResponse:
    """
    팝업 공지사항 목록 조회

    오늘 날짜 기준으로 팝업 표시 기간 내의 공지사항을 반환합니다.
    """
    service = BoardService(db)
    return await service.get_popup_notices()
