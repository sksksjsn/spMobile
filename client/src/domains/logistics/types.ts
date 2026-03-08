export type LogisticsStatus = '반입' | '반출';
export type CheckStatus = 'Y' | 'N';

// ── 목록 아이템 (GET /v1/logistics) ───────────────────────────────────────────
export interface LogisticsItem {
  docNo: string;
  outSite: string;
  outSiteName: string;
  department: string | null;
  manager: string | null;
  company: string | null;
  material: string | null;
  quantity: number | null;
  unit: string | null;
  securityCheck: CheckStatus;
  receiverCheck: CheckStatus;
  status: LogisticsStatus;
  regDt: string | null;
}

export interface LogisticsListResponse {
  items: LogisticsItem[];
  total: number;
}

export interface LogisticsSearchParams {
  outSite?: string;
  outDept?: string;
  inSite?: string;
  company?: string;
  material?: string;
  startDate?: string;
  endDate?: string;
}

// ── 물품 아이템 ───────────────────────────────────────────────────────────────
export interface LogisticsItemDetail {
  itemSeq: number;
  itemName: string;
  itemSpec: string | null;
  unitCode: string | null;
  maker: string | null;
  quantity: number | null;
  reason: string | null;
  note: string | null;
  photos: string[];
}

// ── 상세 응답 (GET /v1/logistics/{docNo}) ─────────────────────────────────────
export interface LogisticsDetail {
  docNo: string;
  busiPlace: string;
  exportDate: string | null;
  authorName: string | null;
  authorDept: string | null;
  authorPhone: string | null;
  partnerCompany: string | null;
  receiverName: string | null;
  receiverPhone: string | null;
  transportType: string | null;
  driverName: string | null;
  driverPhone: string | null;
  driverVehicleNo: string | null;
  courierName: string | null;
  courierInvoiceNo: string | null;
  status: LogisticsStatus;
  securityCheckYn: CheckStatus;
  receiverCheckYn: CheckStatus;
  items: LogisticsItemDetail[];
}

// ── 생성 요청 ─────────────────────────────────────────────────────────────────
export interface LogisticsItemCreate {
  itemName: string;
  itemSpec?: string;
  unitCode?: string;
  maker?: string;
  quantity?: number;
  reason?: string;
  note?: string;
  photos: string[];
}

export interface LogisticsCreateRequest {
  busiPlace: string;
  exportDate: string;
  authorName: string;
  authorDept: string;
  authorPhone?: string;
  partnerCompany: string;
  receiverName?: string;
  receiverPhone?: string;
  transportType: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicleNo?: string;
  courierName?: string;
  courierInvoiceNo?: string;
  items: LogisticsItemCreate[];
}

// ── 수정 요청 ─────────────────────────────────────────────────────────────────
export interface LogisticsUpdateRequest {
  exportDate?: string;
  authorName?: string;
  authorDept?: string;
  authorPhone?: string;
  partnerCompany?: string;
  receiverName?: string;
  receiverPhone?: string;
  transportType?: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicleNo?: string;
  courierName?: string;
  courierInvoiceNo?: string;
  status?: LogisticsStatus;
  securityCheckYn?: CheckStatus;
  receiverCheckYn?: CheckStatus;
  items?: LogisticsItemCreate[];
}

// ── 생성 응답 ─────────────────────────────────────────────────────────────────
export interface DocNoResponse {
  docNo: string;
}
