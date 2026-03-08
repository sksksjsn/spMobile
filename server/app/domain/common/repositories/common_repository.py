"""
Common Repository
사업장(CM_BusiPlace), 부서(CM_CodeDetail MT20), 단위(CM_CodeDetail MT35),
운송유형(CM_CodeDetail MT16) 조회
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.auth.models.cm_busi_place import CmBusiPlace
from server.app.domain.auth.models.cm_code import CmCodeDetail


class CommonRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_sites(self) -> list[CmBusiPlace]:
        """전체 사업장 목록 조회 (사업장코드 순)"""
        stmt = select(CmBusiPlace).order_by(CmBusiPlace.busi_place)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_depts(self) -> list[CmCodeDetail]:
        """부서 목록 조회 - CM_CodeDetail.CODE_TYPE = 'MT20', USE_YN = 'Y'
        MGT_CHAR1 = 소속 사업장코드 (CM_BusiPlace.BUSI_PLACE 와 연결)
        """
        stmt = (
            select(CmCodeDetail)
            .where(CmCodeDetail.code_type == "MT20", CmCodeDetail.use_yn == "Y")
            .order_by(CmCodeDetail.mgt_char1, CmCodeDetail.sort_seq)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_units(self) -> list[CmCodeDetail]:
        """단위 목록 조회 - CM_CodeDetail.CODE_TYPE = 'MT35', USE_YN = 'Y'"""
        stmt = (
            select(CmCodeDetail)
            .where(CmCodeDetail.code_type == "MT35", CmCodeDetail.use_yn == "Y")
            .order_by(CmCodeDetail.sort_seq)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_transport_types(self) -> list[CmCodeDetail]:
        """운송 유형 목록 조회 - CM_CodeDetail.CODE_TYPE = 'MT16', USE_YN = 'Y'"""
        stmt = (
            select(CmCodeDetail)
            .where(CmCodeDetail.code_type == "MT16", CmCodeDetail.use_yn == "Y")
            .order_by(CmCodeDetail.sort_seq)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
