import { apiClient } from '@/core/api/client';
import type { LoginRequest, LoginResponse } from './types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/v1/auth/logout');
  },
};
