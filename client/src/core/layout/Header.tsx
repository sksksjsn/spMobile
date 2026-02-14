/**
 * Header Component (Skeleton)
 *
 * 상단 네비게이션 헤더
 *
 * @example
 * <Header />
 */

import React, { useState } from 'react';
import { checkMSSQLConnectionFromEnv } from '@/domains/system/api';
import { toast } from '@/core/utils/toast';
import type { ApiError } from '@/core/api/types';

export const Header: React.FC = () => {
  const [isTestingMSSQLDB, setIsTestingMSSQLDB] = useState(false);

  // TODO: 로고 추가
  // TODO: 네비게이션 메뉴
  // TODO: 사용자 프로필 드롭다운
  // TODO: 알림 아이콘
  // TODO: 테마 토글 (다크모드)

  const handleMSSQLDBTest = async () => {
    setIsTestingMSSQLDB(true);
    try {
      const response = await checkMSSQLConnectionFromEnv();
      toast.success(response.message);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'MSSQL 연결 테스트 실패');
    } finally {
      setIsTestingMSSQLDB(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          {/* Logo */}
          <h1>AI Dashboard</h1>
        </div>

        <nav className="header-nav">
          {/* Navigation Items */}
        </nav>

        <div className="header-actions">
          {/* User Actions */}
          <button
            onClick={handleMSSQLDBTest}
            disabled={isTestingMSSQLDB}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTestingMSSQLDB ? '테스트 중...' : 'MSSQL테스트2'}
          </button>
        </div>
      </div>
    </header>
  );
};
