"""
Auth 도메인 Repository
St00400 사용자 조회 및 관련 데이터 접근
"""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from server.app.domain.auth.models.user import St00400
from server.app.domain.auth.models.user_role import TbUserRole
from server.app.domain.auth.models.role import TbRole


class UserRepository:
    """사용자 Repository - St00400 데이터 접근"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_user_by_id(self, user_id: str) -> Optional[St00400]:
        """USER_ID로 사용자를 조회합니다 (roles 포함)."""
        stmt = (
            select(St00400)
            .where(St00400.user_id == user_id)
            .options(
                selectinload(St00400.user_roles).selectinload(TbUserRole.role)
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_role_codes_by_user_id(self, user_id: str) -> list[str]:
        """사용자의 권한 코드 목록을 조회합니다."""
        stmt = (
            select(TbRole.role_cd)
            .join(TbUserRole, TbUserRole.role_id == TbRole.role_id)
            .where(TbUserRole.user_id == user_id)
            .where(TbRole.use_yn == "Y")
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
