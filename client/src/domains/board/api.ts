import { apiClient } from '@/core/api/client';
import type { PopupNoticeListResponse } from './types';

export const boardApi = {
  getPopupNotices: async (): Promise<PopupNoticeListResponse> => {
    const response = await apiClient.get<PopupNoticeListResponse>('/v1/board/popup-notices');
    return response.data;
  },
};
