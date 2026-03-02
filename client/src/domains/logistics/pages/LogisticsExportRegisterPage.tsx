import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  LogOut,
  Plus,
  Save,
  Trash2,
  Truck,
} from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';

const SITES = ['본사', '포항', '창원', '군산'];
const DEPT_MAP: Record<string, string[]> = {
  본사: ['자재팀(본사)', '경영팀(본사)'],
  포항: ['설비팀(포항)', '생산팀(포항)', '품질팀(포항)'],
  창원: ['생산팀(창원)', '설비팀(창원)'],
  군산: ['품질팀(군산)', '생산팀(군산)'],
};
const ALL_DEPTS = Object.values(DEPT_MAP).flat();
const TRANSPORT_TYPES = ['자가운반', '택배', '화물차량', '용달', '기타'];

interface MaterialRow {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

let rowIdSeq = 1;

function newRow(): MaterialRow {
  return { id: rowIdSeq++, name: '', quantity: '', unit: 'EA' };
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

const INPUT_CLS =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-seah-gray-500 placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400';
const SELECT_CLS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400';
const PHONE_CLS =
  'rounded-lg border border-slate-200 px-2 py-2 text-center text-sm text-seah-gray-500 placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400';

export function LogisticsExportRegisterPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // 반출 사업장
  const [outSite, setOutSite] = useState(SITES[1]); // 포항
  const [inSite, setInSite] = useState(SITES[0]); // 본사

  // 반출 일자
  const [exportDate, setExportDate] = useState(todayStr());

  // 작성 담당자 정보
  const [authorName, setAuthorName] = useState(user?.userName ?? '');
  const [authorDept, setAuthorDept] = useState('');
  const [authorPhone1, setAuthorPhone1] = useState('010');
  const [authorPhone2, setAuthorPhone2] = useState('');
  const [authorPhone3, setAuthorPhone3] = useState('');

  // 협력업체 정보
  const [partnerCompany, setPartnerCompany] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone1, setReceiverPhone1] = useState('010');
  const [receiverPhone2, setReceiverPhone2] = useState('');
  const [receiverPhone3, setReceiverPhone3] = useState('');

  // 운송 유형
  const [transportType, setTransportType] = useState('');

  // 자재 목록
  const [rows, setRows] = useState<MaterialRow[]>([newRow()]);
  const [submitting, setSubmitting] = useState(false);

  function addRow() {
    setRows((prev) => [...prev, newRow()]);
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id: number, field: keyof MaterialRow, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function validate() {
    if (!authorName.trim()) return '작성 담당자명을 입력해주세요.';
    if (!authorDept) return '작성 담당자 부서명을 선택해주세요.';
    if (!partnerCompany.trim()) return '협력업체를 입력해주세요.';
    if (!transportType) return '운송 유형을 선택해주세요.';
    if (outSite === inSite) return '반출 사업장과 반입 사업장이 같을 수 없습니다.';
    for (const r of rows) {
      if (!r.name.trim()) return '자재명을 입력해주세요.';
      if (!r.quantity || isNaN(Number(r.quantity)) || Number(r.quantity) <= 0)
        return '올바른 수량을 입력해주세요.';
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    setSubmitting(true);
    // TODO: 실제 API 연동
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    alert('반출 등록이 완료되었습니다.');
    navigate('/logistics');
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="relative min-h-dvh bg-[#F8F9FA]">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-seah-gray-500 shadow-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center text-white">
              <Layers size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold uppercase leading-none tracking-tight">
                <span className="text-seah-orange-500">세아특수강</span>
              </span>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="text-xs font-bold text-white">{user?.userName ?? ''}</span>
                <span className="text-[10px] font-normal text-white/50">({user?.loginId})</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="로그아웃"
          >
            <LogOut size={18} />
            <span className="hidden text-sm font-medium md:inline">로그아웃</span>
          </button>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-md px-4 pb-28 pt-6 md:px-6">
        {/* Page Title */}
        <div className="mb-5 flex items-center gap-2">
          <button
            onClick={() => navigate('/logistics')}
            className="flex size-8 items-center justify-center rounded-lg text-seah-gray-500 transition-colors hover:bg-slate-200"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
          </button>
          <Truck size={20} className="text-seah-orange-500" />
          <h1 className="text-lg font-bold text-seah-gray-500">반출 등록</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── 기본 정보 ──────────────────────────────────── */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-seah-gray-500">기본 정보</h2>

            <div className="space-y-4">
              {/* 반출 사업장 (from → to) */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  반출 사업장 <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={outSite}
                    onChange={(e) => setOutSite(e.target.value)}
                    className={SELECT_CLS}
                  >
                    {SITES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ArrowRight size={16} className="shrink-0 text-slate-400" />
                  <select
                    value={inSite}
                    onChange={(e) => setInSite(e.target.value)}
                    className={SELECT_CLS}
                  >
                    {SITES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 반출 일자 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  반출 일자 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={exportDate}
                  onChange={(e) => setExportDate(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 작성 담당자명 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  작성 담당자명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="담당자명"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 작성 담당자 부서명 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  작성 담당자 부서명 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={authorDept}
                  onChange={(e) => setAuthorDept(e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">부서를 선택해주세요</option>
                  {ALL_DEPTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* 작성 담당자 연락처 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  작성 담당자 연락처
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="010"
                    value={authorPhone1}
                    onChange={(e) => setAuthorPhone1(e.target.value.replace(/\D/g, ''))}
                    className={`w-16 ${PHONE_CLS}`}
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={authorPhone2}
                    onChange={(e) => setAuthorPhone2(e.target.value.replace(/\D/g, ''))}
                    className={`flex-1 ${PHONE_CLS}`}
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={authorPhone3}
                    onChange={(e) => setAuthorPhone3(e.target.value.replace(/\D/g, ''))}
                    className={`flex-1 ${PHONE_CLS}`}
                  />
                </div>
              </div>

              {/* 협력업체 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  협력업체 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="협력업체명 입력"
                  value={partnerCompany}
                  onChange={(e) => setPartnerCompany(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 협력업체 인수자명 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  협력업체 인수자명
                </label>
                <input
                  type="text"
                  placeholder="인수자명 입력"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 협력업체 인수자 전화번호 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  협력업체 인수자 전화번호
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="010"
                    value={receiverPhone1}
                    onChange={(e) => setReceiverPhone1(e.target.value.replace(/\D/g, ''))}
                    className={`w-16 ${PHONE_CLS}`}
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={receiverPhone2}
                    onChange={(e) => setReceiverPhone2(e.target.value.replace(/\D/g, ''))}
                    className={`flex-1 ${PHONE_CLS}`}
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={receiverPhone3}
                    onChange={(e) => setReceiverPhone3(e.target.value.replace(/\D/g, ''))}
                    className={`flex-1 ${PHONE_CLS}`}
                  />
                </div>
              </div>

              {/* 운송 유형 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  운송 유형 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">선택해주세요</option>
                  {TRANSPORT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── 자재 목록 ──────────────────────────────────── */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-seah-gray-500">자재 목록</h2>
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-1 rounded-lg border border-seah-orange-400 px-3 py-1.5 text-xs font-semibold text-seah-orange-500 transition-colors hover:bg-seah-orange-500 hover:text-white"
              >
                <Plus size={12} />
                자재 추가
              </button>
            </div>

            <div className="space-y-3">
              {rows.map((row, idx) => (
                <div key={row.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">자재 {idx + 1}</span>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="text-rose-400 transition-colors hover:text-rose-600"
                        aria-label="자재 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                        자재명 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="자재명"
                        value={row.name}
                        onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                        수량 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="수량"
                        min="1"
                        value={row.quantity}
                        onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                        단위
                      </label>
                      <select
                        value={row.unit}
                        onChange={(e) => updateRow(row.id, 'unit', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                      >
                        {['EA', '개', '세트', 'KG', 'TON', 'M', 'BOX', '장'].map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 제출 버튼 ──────────────────────────────────── */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/logistics')}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-seah-gray-500 transition-colors hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-seah-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-seah-orange-600 disabled:opacity-60"
            >
              <Save size={16} />
              {submitting ? '등록 중...' : '반출 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
