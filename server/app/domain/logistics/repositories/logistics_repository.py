"""
Logistics Repository
AW01010(반출입 기본정보) + AW01011(물품목록) DB 접근
"""

import json
import logging
from datetime import datetime
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from server.app.domain.logistics.models.aw01010 import Aw01010
from server.app.domain.logistics.models.aw01011 import Aw01011
from server.app.domain.logistics.schemas import (
    LogisticsCreateRequest,
    LogisticsSearchParams,
    LogisticsUpdateRequest,
)

logger = logging.getLogger(__name__)


class LogisticsRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # ── 채번 ──────────────────────────────────────────────────────────────────

    async def generate_doc_no(self, busi_place: str, export_date: str) -> str:
        """반출입번호 채번: 사업장코드(1) + 년월일(8) + 시퀀스(4자리)"""
        date_str = export_date.replace("-", "")[:8]  # YYYYMMDD
        prefix = f"{busi_place}{date_str}"

        # 같은 사업장+날짜의 최대 시퀀스 조회
        stmt = select(func.max(Aw01010.doc_no)).where(
            Aw01010.doc_no.like(f"{prefix}%")
        )
        result = await self.db.execute(stmt)
        max_doc_no: Optional[str] = result.scalar()

        if max_doc_no and len(max_doc_no) >= 13:
            last_seq = int(max_doc_no[-4:])
            next_seq = last_seq + 1
        else:
            next_seq = 1

        return f"{prefix}{next_seq:04d}"

    # ── 조회 ──────────────────────────────────────────────────────────────────

    async def get_list(self, params: LogisticsSearchParams) -> list[Aw01010]:
        """반출입 목록 조회 (물품목록 포함)"""
        stmt = (
            select(Aw01010)
            .options(selectinload(Aw01010.items))
            .order_by(Aw01010.in_date.desc())
        )

        if params.out_site:
            stmt = stmt.where(Aw01010.busi_place == params.out_site)
        if params.out_dept:
            stmt = stmt.where(Aw01010.author_dept == params.out_dept)
        if params.company:
            stmt = stmt.where(Aw01010.partner_company.contains(params.company))
        if params.material:
            # 물품명으로 검색 (서브쿼리)
            item_subq = select(Aw01011.doc_no).where(
                Aw01011.item_name.contains(params.material)
            )
            stmt = stmt.where(Aw01010.doc_no.in_(item_subq))
        if params.status:
            stmt = stmt.where(Aw01010.status == params.status)
        if params.start_date:
            stmt = stmt.where(Aw01010.export_date >= params.start_date)
        if params.end_date:
            stmt = stmt.where(Aw01010.export_date <= params.end_date)

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_doc_no(self, doc_no: str) -> Optional[Aw01010]:
        """반출입번호로 단건 조회"""
        stmt = (
            select(Aw01010)
            .options(selectinload(Aw01010.items))
            .where(Aw01010.doc_no == doc_no)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    # ── 생성 ──────────────────────────────────────────────────────────────────

    async def create(self, req: LogisticsCreateRequest, login_id: str) -> Aw01010:
        """반출 등록 (헤더 + 물품목록)"""
        doc_no = await self.generate_doc_no(req.busi_place, req.export_date)
        now = datetime.now()

        # 헤더 생성
        header = Aw01010(
            doc_no=doc_no,
            busi_place=req.busi_place,
            export_date=datetime.strptime(req.export_date, "%Y-%m-%d"),
            author_name=req.author_name,
            author_dept=req.author_dept,
            author_phone=req.author_phone,
            partner_company=req.partner_company,
            receiver_name=req.receiver_name,
            receiver_phone=req.receiver_phone,
            transport_type=req.transport_type,
            driver_name=req.driver_name,
            driver_phone=req.driver_phone,
            driver_vehicle_no=req.driver_vehicle_no,
            courier_name=req.courier_name,
            courier_invoice_no=req.courier_invoice_no,
            status="반출",
            security_check_yn="N",
            receiver_check_yn="N",
            in_date=now,
            in_user=login_id,
        )
        self.db.add(header)

        # 물품목록 생성
        for seq, item_req in enumerate(req.items, start=1):
            item = Aw01011(
                doc_no=doc_no,
                item_seq=seq,
                item_name=item_req.item_name,
                item_spec=item_req.item_spec,
                unit_code=item_req.unit_code,
                maker=item_req.maker,
                quantity=float(item_req.quantity) if item_req.quantity is not None else None,
                reason=item_req.reason,
                note=item_req.note,
                photo_data=json.dumps(item_req.photos) if item_req.photos else None,
            )
            self.db.add(item)

        await self.db.flush()
        logger.info("반출 등록 완료: doc_no=%s, user=%s", doc_no, login_id)
        return header

    # ── 수정 ──────────────────────────────────────────────────────────────────

    async def update(
        self, doc_no: str, req: LogisticsUpdateRequest, login_id: str
    ) -> Optional[Aw01010]:
        """반출입 수정"""
        header = await self.get_by_doc_no(doc_no)
        if header is None:
            return None

        now = datetime.now()

        if req.export_date is not None:
            header.export_date = datetime.strptime(req.export_date, "%Y-%m-%d")
        if req.author_name is not None:
            header.author_name = req.author_name
        if req.author_dept is not None:
            header.author_dept = req.author_dept
        if req.author_phone is not None:
            header.author_phone = req.author_phone
        if req.partner_company is not None:
            header.partner_company = req.partner_company
        if req.receiver_name is not None:
            header.receiver_name = req.receiver_name
        if req.receiver_phone is not None:
            header.receiver_phone = req.receiver_phone
        if req.transport_type is not None:
            header.transport_type = req.transport_type
        if req.driver_name is not None:
            header.driver_name = req.driver_name
        if req.driver_phone is not None:
            header.driver_phone = req.driver_phone
        if req.driver_vehicle_no is not None:
            header.driver_vehicle_no = req.driver_vehicle_no
        if req.courier_name is not None:
            header.courier_name = req.courier_name
        if req.courier_invoice_no is not None:
            header.courier_invoice_no = req.courier_invoice_no
        if req.status is not None:
            header.status = req.status
        if req.security_check_yn is not None:
            header.security_check_yn = req.security_check_yn
        if req.receiver_check_yn is not None:
            header.receiver_check_yn = req.receiver_check_yn

        header.up_date = now
        header.up_user = login_id

        # 물품목록 전체 교체
        if req.items is not None:
            # 기존 물품 삭제
            for existing_item in list(header.items):
                await self.db.delete(existing_item)
            await self.db.flush()

            # 새 물품 등록
            for seq, item_req in enumerate(req.items, start=1):
                item = Aw01011(
                    doc_no=doc_no,
                    item_seq=seq,
                    item_name=item_req.item_name,
                    item_spec=item_req.item_spec,
                    unit_code=item_req.unit_code,
                    maker=item_req.maker,
                    quantity=float(item_req.quantity) if item_req.quantity is not None else None,
                    reason=item_req.reason,
                    note=item_req.note,
                    photo_data=json.dumps(item_req.photos) if item_req.photos else None,
                )
                self.db.add(item)

        await self.db.flush()
        logger.info("반출입 수정 완료: doc_no=%s, user=%s", doc_no, login_id)
        return header

    # ── 삭제 ──────────────────────────────────────────────────────────────────

    async def delete(self, doc_no: str) -> bool:
        """반출입 삭제 (물품목록 cascade 삭제)"""
        header = await self.get_by_doc_no(doc_no)
        if header is None:
            return False

        await self.db.delete(header)
        await self.db.flush()
        logger.info("반출입 삭제 완료: doc_no=%s", doc_no)
        return True
