"""
System 도메인 Repositories
데이터 조회 로직
"""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.system.models import ConnectionTest, TestTable
from server.app.shared.base.repository import BaseRepository


class ConnectionTestRepository(BaseRepository[None, Optional[ConnectionTest]]):
    """
    연결 테스트 데이터 조회
    """

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def provide(self, input_data: None = None) -> Optional[ConnectionTest]:
        """
        가장 최근의 연결 테스트 데이터 조회

        Returns:
            가장 최근의 ConnectionTest 레코드 또는 None
        """
        result = await self.db.execute(
            select(ConnectionTest).order_by(ConnectionTest.created_at.desc()).limit(1)
        )
        return result.scalar_one_or_none()


class TestTableRepository(BaseRepository[None, list[TestTable]]):
    """
    TestTable ORM 테스트 Repository
    """

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def provide(self, input_data: None = None) -> list[TestTable]:
        """
        TestTable 전체 레코드 조회

        Returns:
            TestTable 전체 레코드 리스트
        """
        result = await self.db.execute(
            select(TestTable).order_by(TestTable.id.asc())
        )
        return list(result.scalars().all())

    async def insert(self) -> TestTable:
        """
        TestTable에 새 레코드 추가
        name = 'name' + (새로 생성된 id)

        Returns:
            생성된 TestTable 레코드
        """
        new_record = TestTable(name="temp")
        self.db.add(new_record)
        await self.db.flush()
        new_record.name = f"name{new_record.id}"
        await self.db.commit()
        await self.db.refresh(new_record)
        return new_record
