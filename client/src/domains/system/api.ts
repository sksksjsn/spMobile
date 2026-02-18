/**
 * System 도메인 API 클라이언트
 */

import { apiClient } from '@/core/api/client';
import type { DBCheckResponse, MSSQLConnectionConfig } from './types';

/**
 * 데이터베이스 연결 테스트
 *
 * @returns DB 연결 테스트 결과
 */
export const checkDatabaseConnection = async (): Promise<DBCheckResponse> => {
  const response = await apiClient.get<DBCheckResponse>('/v1/system/db-check');
  return response.data;
};

/**
 * MSSQL 데이터베이스 연결 테스트
 *
 * @param config - MSSQL 연결 설정
 * @returns MSSQL DB 연결 테스트 결과
 */
export const checkMSSQLConnection = async (config: MSSQLConnectionConfig): Promise<DBCheckResponse> => {
  const response = await apiClient.post<DBCheckResponse>('/v1/system/mssql-check', config);
  return response.data;
};

/**
 * MSSQL 데이터베이스 연결 테스트 (.env 기반)
 *
 * .env 파일에 설정된 MSSQL 설정으로 연결 테스트를 수행합니다.
 *
 * @returns MSSQL DB 연결 테스트 결과
 */
export const checkMSSQLConnectionFromEnv = async (): Promise<DBCheckResponse> => {
  const response = await apiClient.get<DBCheckResponse>('/v1/system/mssql-check-env');
  return response.data;
};

/**
 * DB 연결 테스트 (MCP) - @@VERSION 조회
 *
 * .env 설정을 사용하여 MSSQL에 연결하고 @@VERSION 정보를 반환합니다.
 *
 * @returns @@VERSION 정보가 포함된 연결 테스트 결과
 */
export const checkMSSQLMCPConnection = async (): Promise<DBCheckResponse> => {
  const response = await apiClient.get<DBCheckResponse>('/v1/system/mssql-mcp-check');
  return response.data;
};
