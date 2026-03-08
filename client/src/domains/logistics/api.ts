import { apiClient } from '@/core/api/client';
import type {
  DocNoResponse,
  LogisticsCreateRequest,
  LogisticsDetail,
  LogisticsListResponse,
  LogisticsSearchParams,
  LogisticsUpdateRequest,
} from './types';

export const logisticsApi = {
  getList: async (params?: LogisticsSearchParams): Promise<LogisticsListResponse> => {
    const response = await apiClient.get<LogisticsListResponse>('/v1/logistics', { params });
    return response.data;
  },

  getCompletedList: async (params?: LogisticsSearchParams): Promise<LogisticsListResponse> => {
    const response = await apiClient.get<LogisticsListResponse>('/v1/logistics/completed', {
      params,
    });
    return response.data;
  },

  getDetail: async (docNo: string): Promise<LogisticsDetail> => {
    const response = await apiClient.get<LogisticsDetail>(`/v1/logistics/${docNo}`);
    return response.data;
  },

  create: async (req: LogisticsCreateRequest): Promise<DocNoResponse> => {
    const response = await apiClient.post<DocNoResponse>('/v1/logistics', req);
    return response.data;
  },

  update: async (docNo: string, req: LogisticsUpdateRequest): Promise<LogisticsDetail> => {
    const response = await apiClient.put<LogisticsDetail>(`/v1/logistics/${docNo}`, req);
    return response.data;
  },

  delete: async (docNo: string): Promise<void> => {
    await apiClient.delete(`/v1/logistics/${docNo}`);
  },
};
