export interface PopupNotice {
  boardTitle: string | null;
  boardTxt: string | null;
  popupStartDt: string | null;
  popupEndDt: string | null;
}

export interface PopupNoticeListResponse {
  notices: PopupNotice[];
}
