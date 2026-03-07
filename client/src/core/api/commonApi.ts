/**
 * Common API - 사업장, 부서 공통 마스터 데이터
 */

import { apiClient } from '@/core/api/client';

export interface SiteItem {
  busiPlace: string;
  busiPlaceName: string;
}

export interface DeptItem {
  deptCode: string;
  deptName: string;
  busiPlace: string;
}

export interface SitesDeptResponse {
  sites: SiteItem[];
  depts: DeptItem[];
}

export async function fetchSitesDepts(): Promise<SitesDeptResponse> {
  const response = await apiClient.get<SitesDeptResponse>('/v1/common/sites-depts');
  return response.data;
}
