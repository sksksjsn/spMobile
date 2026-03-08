"""
Common Service
사업장 + 부서 + 단위 데이터 제공
"""

import logging

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.common.repositories.common_repository import CommonRepository
from server.app.domain.common.schemas import DeptSchema, SiteSchema, SitesDeptResponse, UnitSchema, UnitsResponse

logger = logging.getLogger(__name__)


class CommonService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.common_repo = CommonRepository(db)

    async def get_sites_and_depts(self) -> SitesDeptResponse:
        """
        사업장 + 부서 목록을 함께 반환합니다.
        사업장-부서 연결: CM_BusiPlace.BUSI_PLACE = CM_CodeDetail.MGT_CHAR1
        """
        sites_rows = await self.common_repo.get_sites()
        depts_rows = await self.common_repo.get_depts()

        sites = [
            SiteSchema(
                busi_place=row.busi_place,
                busi_place_name=row.busi_place_name or row.busi_place,
            )
            for row in sites_rows
        ]

        depts = [
            DeptSchema(
                dept_code=row.code,
                dept_name=row.code_name or row.code,
                busi_place=row.mgt_char1 or "",
            )
            for row in depts_rows
        ]

        logger.info(f"sites={len(sites)}, depts={len(depts)} 조회 완료")
        return SitesDeptResponse(sites=sites, depts=depts)

    async def get_units(self) -> UnitsResponse:
        """
        단위 목록을 반환합니다.
        CM_CodeDetail.CODE_TYPE = 'MT35'
        """
        units_rows = await self.common_repo.get_units()

        units = [
            UnitSchema(
                unit_code=row.code,
                unit_name=row.code_name or row.code,
            )
            for row in units_rows
        ]

        logger.info(f"units={len(units)} 조회 완료")
        return UnitsResponse(units=units)
