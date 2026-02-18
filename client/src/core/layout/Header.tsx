/**
 * Header Component
 *
 * 상단 네비게이션 헤더
 *
 * @example
 * <Header />
 */

import React, { useState } from 'react';
import { Zap, FileCode, BookOpen, Database, X } from 'lucide-react';
import { checkMSSQLMCPConnection, testOrmInsertAndSelect } from '@/domains/system/api';
import { toast } from '@/core/utils/toast';
import type { ApiError } from '@/core/api/types';
import type { OrmTestResponse } from '@/domains/system/types';

interface HeaderProps {
  connectionStatus: 'loading' | 'ok' | 'error';
  onOpenDocument: (key: 'overview' | 'quickStart' | 'devGuide') => void;
  onDBCheck: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  onOpenDocument,
  onDBCheck,
}) => {
  const [isTestingMSSQLDB, setIsTestingMSSQLDB] = useState(false);
  const [isTestingORM, setIsTestingORM] = useState(false);
  const [ormResult, setOrmResult] = useState<OrmTestResponse | null>(null);

  const handleOrmTest = async () => {
    setIsTestingORM(true);
    try {
      const response = await testOrmInsertAndSelect();
      setOrmResult(response);
      toast.success(response.message);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'ORM 테스트 실패');
    } finally {
      setIsTestingORM(false);
    }
  };

  const handleMSSQLDBTest = async () => {
    setIsTestingMSSQLDB(true);
    try {
      const response = await checkMSSQLMCPConnection();
      toast.success(response.message);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'DB 연결 테스트 실패 (MCP)');
    } finally {
      setIsTestingMSSQLDB(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            <span className="uppercase">메롱메롱</span>
            <span> v1.0</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onOpenDocument('overview')}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <FileCode size={16} />
            프로젝트 개요
          </button>
          <button
            onClick={() => onOpenDocument('quickStart')}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <Zap size={16} />
            빠른 시작
          </button>
          <button
            onClick={() => onOpenDocument('devGuide')}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <BookOpen size={16} />
            개발 가이드
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${connectionStatus === 'ok'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-rose-50 text-rose-600'
              }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${connectionStatus === 'ok' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
            />
            Node: {connectionStatus === 'ok' ? 'Stable' : 'Offline'}
          </div>
          <button
            onClick={onDBCheck}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all active:scale-95 border border-blue-200"
            title="Supabase DB 연결 테스트"
          >
            <Database size={14} />
            DB 연결 테스트
          </button>
          <button
            onClick={handleMSSQLDBTest}
            disabled={isTestingMSSQLDB}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition-all active:scale-95 border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="MCP 서버를 통한 DB 연결 테스트 (@@VERSION 조회)"
          >
            <Database size={14} />
            {isTestingMSSQLDB ? '테스트 중...' : 'DB연결테스트(MCP)'}
          </button>
          <button
            onClick={handleOrmTest}
            disabled={isTestingORM}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 transition-all active:scale-95 border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="SQLAlchemy ORM으로 TestTable INSERT 후 SELECT"
          >
            <Database size={14} />
            {isTestingORM ? '테스트 중...' : 'API(ORM)'}
          </button>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95">
            시작하기
          </button>
        </div>
      </div>

      {ormResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                ORM 테스트 결과
              </h3>
              <button
                onClick={() => setOrmResult(null)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-emerald-600 font-semibold mb-3">
                {ormResult.message}
              </p>
              <div className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                저장된 레코드
              </div>
              <div className="mb-4 px-3 py-2 bg-orange-50 rounded-lg text-sm text-slate-700">
                id: {ormResult.inserted.id}, name: {ormResult.inserted.name}
              </div>
              <div className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                전체 데이터 (SELECT *)
              </div>
              <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-600">ID</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-600">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ormResult.all_records.map((record) => (
                      <tr key={record.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-2 text-slate-700">{record.id}</td>
                        <td className="px-4 py-2 text-slate-700">{record.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                총 {ormResult.all_records.length}건
              </p>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setOrmResult(null)}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
