import { apiClient } from '@/core/api/client';
import type { LogisticsListResponse, LogisticsSearchParams } from './types';

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
};
