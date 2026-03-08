"""
Logistics Service
반출입 도메인 비즈니스 로직
"""

import json
import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.logistics.repositories.logistics_repository import LogisticsRepository
from server.app.domain.logistics.schemas import (
    DocNoResponse,
    ItemSchema,
    LogisticsCreateRequest,
    LogisticsDetailSchema,
    LogisticsListItemSchema,
    LogisticsListResponse,
    LogisticsSearchParams,
    LogisticsUpdateRequest,
)

logger = logging.getLogger(__name__)


class LogisticsService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = LogisticsRepository(db)

    def _to_list_item(self, header) -> LogisticsListItemSchema:
        """ORM 헤더 → 목록 아이템 스키마 변환"""
        first_item = header.items[0] if header.items else None
        return LogisticsListItemSchema(
            doc_no=header.doc_no,
            out_site=header.busi_place,
            out_site_name=header.busi_place,  # 사업장명은 프론트에서 매핑
            department=header.author_dept,
            manager=header.author_name,
            company=header.partner_company,
            material=first_item.item_name if first_item else None,
            quantity=float(first_item.quantity) if first_item and first_item.quantity else None,
            unit=first_item.unit_code if first_item else None,
            security_check=header.security_check_yn,
            receiver_check=header.receiver_check_yn,
            status=header.status,
            reg_dt=header.in_date.isoformat() if header.in_date else None,
        )

    def _to_detail(self, header) -> LogisticsDetailSchema:
        """ORM 헤더 → 상세 스키마 변환"""
        items = []
        for orm_item in header.items:
            photos: list[str] = []
            if orm_item.photo_data:
                try:
                    photos = json.loads(orm_item.photo_data)
                except (json.JSONDecodeError, ValueError):
                    photos = []

            items.append(
                ItemSchema(
                    item_seq=orm_item.item_seq,
                    item_name=orm_item.item_name,
                    item_spec=orm_item.item_spec,
                    unit_code=orm_item.unit_code,
                    maker=orm_item.maker,
                    quantity=float(orm_item.quantity) if orm_item.quantity is not None else None,
                    reason=orm_item.reason,
                    note=orm_item.note,
                    photos=photos,
                )
            )

        return LogisticsDetailSchema(
            doc_no=header.doc_no,
            busi_place=header.busi_place,
            export_date=(
                header.export_date.strftime("%Y-%m-%d") if header.export_date else None
            ),
            author_name=header.author_name,
            author_dept=header.author_dept,
            author_phone=header.author_phone,
            partner_company=header.partner_company,
            receiver_name=header.receiver_name,
            receiver_phone=header.receiver_phone,
            transport_type=header.transport_type,
            driver_name=header.driver_name,
            driver_phone=header.driver_phone,
            driver_vehicle_no=header.driver_vehicle_no,
            courier_name=header.courier_name,
            courier_invoice_no=header.courier_invoice_no,
            status=header.status,
            security_check_yn=header.security_check_yn,
            receiver_check_yn=header.receiver_check_yn,
            items=items,
        )

    async def get_list(self, params: LogisticsSearchParams) -> LogisticsListResponse:
        """반출입 목록 조회"""
        rows = await self.repo.get_list(params)
        items = [self._to_list_item(row) for row in rows]
        return LogisticsListResponse(items=items, total=len(items))

    async def get_detail(self, doc_no: str) -> Optional[LogisticsDetailSchema]:
        """반출입 상세 조회"""
        header = await self.repo.get_by_doc_no(doc_no)
        if header is None:
            return None
        return self._to_detail(header)

    async def create(self, req: LogisticsCreateRequest, login_id: str) -> DocNoResponse:
        """반출 등록"""
        header = await self.repo.create(req, login_id)
        await self.db.commit()
        return DocNoResponse(doc_no=header.doc_no)

    async def update(
        self, doc_no: str, req: LogisticsUpdateRequest, login_id: str
    ) -> Optional[LogisticsDetailSchema]:
        """반출입 수정"""
        header = await self.repo.update(doc_no, req, login_id)
        if header is None:
            return None
        await self.db.commit()
        # commit 후 재조회
        updated = await self.repo.get_by_doc_no(doc_no)
        return self._to_detail(updated)  # type: ignore[arg-type]

    async def delete(self, doc_no: str) -> bool:
        """반출입 삭제"""
        result = await self.repo.delete(doc_no)
        if result:
            await self.db.commit()
        return result
