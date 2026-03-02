export type LogisticsStatus = '반입' | '반출';
export type CheckStatus = 'Y' | 'N';

export interface LogisticsItem {
  docNo: string;
  outSite: string;
  inSite: string;
  department: string;
  manager: string;
  company: string;
  material: string;
  quantity: number;
  unit: string;
  securityCheck: CheckStatus;
  receiverCheck: CheckStatus;
  status: LogisticsStatus;
  regDt: string;
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
