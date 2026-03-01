"""
Board 도메인 Repository
WB_BOARD_INFO 팝업 공지사항 조회
"""

from datetime import date

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.board.models.notice import WbBoardInfo


class BoardRepository:
    """게시판 Repository - WB_BOARD_INFO 데이터 접근"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_popup_notices(self) -> list[WbBoardInfo]:
        """
        오늘 날짜 기준 팝업 표시 대상 공지사항을 조회합니다.

        조건:
          - BOARD_CATEGORY = '02'
          - POPUP_YN = 'Y'
          - 오늘 날짜(YYYYMMDD)가 POPUP_START_DT ~ POPUP_END_DT 범위 안
        정렬: REG_DT ASC
        """
        today = date.today().strftime("%Y%m%d")
        stmt = (
            select(WbBoardInfo)
            .where(
                and_(
                    WbBoardInfo.board_category == "02",
                    WbBoardInfo.popup_yn == "Y",
                    WbBoardInfo.popup_start_dt <= today,
                    WbBoardInfo.popup_end_dt >= today,
                )
            )
            .order_by(WbBoardInfo.reg_dt.asc())
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
