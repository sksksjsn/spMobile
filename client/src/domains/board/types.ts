export interface PopupNotice {
  boardTitle: string | null;
  boardTxt: string | null;
  popupStartDt: string | null;
  popupEndDt: string | null;
}

export interface PopupNoticeListResponse {
  notices: PopupNotice[];
}

export interface Notice {
  boardSeq: string | null;
  boardTitle: string | null;
  boardTxt: string | null;
  importYn: string | null;
  regDt: string | null;
}

export interface NoticeListResponse {
  notices: Notice[];
}
