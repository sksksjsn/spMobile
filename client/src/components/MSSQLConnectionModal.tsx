import { useState } from 'react';
import { X, Database } from 'lucide-react';
import type { MSSQLConnectionConfig } from '../domains/system/types';

interface MSSQLConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: MSSQLConnectionConfig) => void;
}

export function MSSQLConnectionModal({ isOpen, onClose, onSubmit }: MSSQLConnectionModalProps) {
  const [config, setConfig] = useState<MSSQLConnectionConfig>({
    driver: 'ODBC Driver 17 for SQL Server',
    server: 'localhost',
    database: 'master',
    username: 'sa',
    password: '',
    timeout: 5,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Database className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">MSSQL 연결 설정</h2>
              <p className="text-purple-100 text-sm">서버 정보를 입력하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Server */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              서버 주소 *
            </label>
            <input
              type="text"
              required
              value={config.server}
              onChange={(e) => setConfig({ ...config, server: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="localhost 또는 IP 주소"
            />
          </div>

          {/* Database */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              데이터베이스
            </label>
            <input
              type="text"
              value={config.database}
              onChange={(e) => setConfig({ ...config, database: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="master"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              사용자명 *
            </label>
            <input
              type="text"
              required
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="sa"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              비밀번호 *
            </label>
            <input
              type="password"
              required
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* Driver (Advanced) */}
          <details className="pt-2">
            <summary className="text-sm font-semibold text-slate-600 cursor-pointer hover:text-slate-800">
              고급 설정
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  ODBC 드라이버
                </label>
                <input
                  type="text"
                  value={config.driver}
                  onChange={(e) => setConfig({ ...config, driver: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="ODBC Driver 17 for SQL Server"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  타임아웃 (초)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.timeout}
                  onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </details>

          {/* Info Message */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mt-4">
            <p className="text-xs text-purple-700">
              ℹ️ 입력한 정보는 저장되지 않으며 연결 테스트에만 사용됩니다.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-200"
            >
              연결 테스트
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
