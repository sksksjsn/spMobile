"""
Board 도메인 Pydantic 스키마
"""

from typing import Optional

from pydantic import BaseModel, Field


class PopupNoticeSchema(BaseModel):
    """팝업 공지사항 응답 스키마"""

    board_title: Optional[str] = Field(None, alias="boardTitle", serialization_alias="boardTitle")
    board_txt: Optional[str] = Field(None, alias="boardTxt", serialization_alias="boardTxt")
    popup_start_dt: Optional[str] = Field(
        None, alias="popupStartDt", serialization_alias="popupStartDt"
    )
    popup_end_dt: Optional[str] = Field(
        None, alias="popupEndDt", serialization_alias="popupEndDt"
    )

    model_config = {"populate_by_name": True, "from_attributes": True}


class PopupNoticeListResponse(BaseModel):
    """팝업 공지사항 목록 응답"""

    notices: list[PopupNoticeSchema]
