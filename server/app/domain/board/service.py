"""
Board 도메인 Service
공지사항 팝업 조회 처리
"""

import logging

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.board.repositories.board_repository import BoardRepository
from server.app.domain.board.schemas import (
    NoticeListResponse,
    NoticeSchema,
    PopupNoticeListResponse,
    PopupNoticeSchema,
)

logger = logging.getLogger(__name__)


class BoardService:
    """게시판 Service - 공지사항 비즈니스 로직"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.board_repo = BoardRepository(db)

    async def get_popup_notices(self) -> PopupNoticeListResponse:
        """
        오늘 날짜 기준 팝업 공지사항 목록을 반환합니다.

        Returns:
            PopupNoticeListResponse: 팝업 공지사항 목록
        """
        notices = await self.board_repo.get_popup_notices()
        logger.info(f"Popup notices fetched: {len(notices)} items")

        return PopupNoticeListResponse(
            notices=[
                PopupNoticeSchema.model_validate(notice, from_attributes=True)
                for notice in notices
            ]
        )

    async def get_notices(self) -> NoticeListResponse:
        """
        공지사항 목록을 반환합니다 (최신순).

        Returns:
            NoticeListResponse: 공지사항 목록
        """
        notices = await self.board_repo.get_notices()
        logger.info(f"Notices fetched: {len(notices)} items")

        return NoticeListResponse(
            notices=[
                NoticeSchema.model_validate(notice, from_attributes=True)
                for notice in notices
            ]
        )
