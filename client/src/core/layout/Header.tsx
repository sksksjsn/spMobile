/**
 * Header Component
 *
 * 상단 네비게이션 헤더
 *
 * @example
 * <Header />
 */

import React from 'react';
import { Zap, FileCode, BookOpen, Database } from 'lucide-react';

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
          <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95">
            시작하기
          </button>
        </div>
      </div>
    </nav>
  );
};
