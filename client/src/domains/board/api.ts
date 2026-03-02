import { apiClient } from '@/core/api/client';
import type { NoticeListResponse, PopupNoticeListResponse } from './types';

export const boardApi = {
  getPopupNotices: async (): Promise<PopupNoticeListResponse> => {
    const response = await apiClient.get<PopupNoticeListResponse>('/v1/board/popup-notices');
    return response.data;
  },

  getNotices: async (): Promise<NoticeListResponse> => {
    const response = await apiClient.get<NoticeListResponse>('/v1/board/notices');
    return response.data;
  },
};
