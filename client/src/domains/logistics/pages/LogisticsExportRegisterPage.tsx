import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Layers,
  LogOut,
  Package,
  Pencil,
  Plus,
  Save,
  Trash2,
  Truck,
} from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';
import { useExportDraftStore } from '../store/useExportDraftStore';
import { useSitesDept } from '@/core/hooks/useSitesDept';
import { useTransportTypes } from '@/core/hooks/useTransportTypes';

const INPUT_CLS =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-seah-gray-500 ' +
  'placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 ' +
  'focus:ring-seah-orange-400';
const SELECT_CLS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 ' +
  'focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400';
const PHONE_CLS =
  'rounded-lg border border-slate-200 px-2 py-2 text-center text-sm text-seah-gray-500 ' +
  'placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 ' +
  'focus:ring-seah-orange-400';

export function LogisticsExportRegisterPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const {
    outSite,
    exportDate,
    authorName,
    authorDept,
    authorPhone1,
    authorPhone2,
    authorPhone3,
    partnerCompany,
    receiverName,
    receiverPhone1,
    receiverPhone2,
    receiverPhone3,
    transportType,
    items,
    setField,
    removeItem,
    setEditingIndex,
    clearDraft,
  } = useExportDraftStore();
  const { sites, getDeptsBySite } = useSitesDept();
  const { transportTypes } = useTransportTypes();

  // 사업장에 해당하는 부서 목록
  const filteredDepts = outSite ? getDeptsBySite(outSite) : [];

  // 최초 진입 시 담당자명 초기화
  useEffect(() => {
    if (!authorName && user?.userName) {
      setField('authorName', user.userName);
    }
  }, [authorName, user?.userName, setField]);

  function handleAddItem() {
    setEditingIndex(null);
    navigate('/logistics/register/export/item-add');
  }

  function handleEditItem(index: number) {
    setEditingIndex(index);
    navigate('/logistics/register/export/item-add');
  }

  function validate(): string | null {
    if (!authorName.trim()) return '작성 담당자명을 입력해주세요.';
    if (!authorDept) return '작성 담당자 부서명을 선택해주세요.';
    if (!partnerCompany.trim()) return '협력업체를 입력해주세요.';
    if (!transportType) return '운송 유형을 선택해주세요.';
    if (items.length === 0) return '물품을 최소 1개 추가해주세요.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    // TODO: 실제 API 연동
    await new Promise((r) => setTimeout(r, 600));
    clearDraft();
    alert('반출 등록이 완료되었습니다.');
    navigate('/logistics');
  }

  function handleCancel() {
    clearDraft();
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
            onClick={handleCancel}
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
              {/* 반출 사업장 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  반출 사업장 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={outSite}
                  onChange={(e) => {
                    setField('outSite', e.target.value);
                    setField('authorDept', '');
                  }}
                  className={SELECT_CLS}
                >
                  <option value="">사업장 선택</option>
                  {sites.map((s) => (
                    <option key={s.busiPlace} value={s.busiPlace}>
                      {s.busiPlaceName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 반출 일자 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  반출 일자 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={exportDate}
                  onChange={(e) => setField('exportDate', e.target.value)}
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
                  onChange={(e) => setField('authorName', e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 작성 담당자 부서명 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  작성 담당자 부서명 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={authorDept}
                    onChange={(e) => setField('authorDept', e.target.value)}
                    disabled={!outSite}
                    className={SELECT_CLS}
                  >
                    <option value="">
                      {outSite ? '부서를 선택해주세요' : '사업장을 먼저 선택해주세요'}
                    </option>
                    {filteredDepts.map((d) => (
                      <option key={d.deptCode} value={d.deptCode}>
                        {d.deptName}
                      </option>
                    ))}
                  </select>
                  {/* 사업장 미선택 시 클릭 감지 오버레이 */}
                  {!outSite && (
                    <div
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => alert('먼저 반출 사업장을 선택해주세요.')}
                    />
                  )}
                </div>
              </div>

              {/* 작성 담당자 연락처 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  작성 담당자 연락처
                </label>
                <div className="grid grid-cols-[2.8rem_auto_1fr_auto_1fr] items-center gap-x-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="010"
                    value={authorPhone1}
                    onChange={(e) => setField('authorPhone1', e.target.value.replace(/\D/g, ''))}
                    className={`min-w-0 ${PHONE_CLS}`}
                  />
                  <span className="text-center text-slate-400">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={authorPhone2}
                    onChange={(e) => setField('authorPhone2', e.target.value.replace(/\D/g, ''))}
                    className={`min-w-0 w-full ${PHONE_CLS}`}
                  />
                  <span className="text-center text-slate-400">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={authorPhone3}
                    onChange={(e) => setField('authorPhone3', e.target.value.replace(/\D/g, ''))}
                    className={`min-w-0 w-full ${PHONE_CLS}`}
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
                  onChange={(e) => setField('partnerCompany', e.target.value)}
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
                  onChange={(e) => setField('receiverName', e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 협력업체 인수자 전화번호 */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  협력업체 인수자 전화번호
                </label>
                <div className="grid grid-cols-[2.8rem_auto_1fr_auto_1fr] items-center gap-x-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="010"
                    value={receiverPhone1}
                    onChange={(e) =>
                      setField('receiverPhone1', e.target.value.replace(/\D/g, ''))
                    }
                    className={`min-w-0 ${PHONE_CLS}`}
                  />
                  <span className="text-center text-slate-400">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={receiverPhone2}
                    onChange={(e) =>
                      setField('receiverPhone2', e.target.value.replace(/\D/g, ''))
                    }
                    className={`min-w-0 w-full ${PHONE_CLS}`}
                  />
                  <span className="text-center text-slate-400">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={receiverPhone3}
                    onChange={(e) =>
                      setField('receiverPhone3', e.target.value.replace(/\D/g, ''))
                    }
                    className={`min-w-0 w-full ${PHONE_CLS}`}
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
                  onChange={(e) => setField('transportType', e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">선택해주세요</option>
                  {transportTypes.map((t) => (
                    <option key={t.tranCode} value={t.tranCode}>
                      {t.tranName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── 물품 목록 ──────────────────────────────────── */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-seah-gray-500">
                물품 목록{' '}
                {items.length > 0 && (
                  <span className="ml-1 rounded-full bg-seah-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {items.length}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 rounded-lg border border-seah-orange-400 px-3 py-1.5 text-xs font-semibold text-seah-orange-500 transition-colors hover:bg-seah-orange-500 hover:text-white"
              >
                <Plus size={12} />
                물품 추가
              </button>
            </div>

            {items.length === 0 ? (
              <button
                type="button"
                onClick={handleAddItem}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-slate-400 transition-colors hover:border-seah-orange-300 hover:text-seah-orange-400"
              >
                <Package size={28} strokeWidth={1.5} />
                <span className="text-sm font-medium">물품을 추가해주세요</span>
                <span className="text-xs text-slate-300">최소 1개 이상 필요합니다</span>
              </button>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    {/* 번호 */}
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-seah-orange-100 text-[11px] font-bold text-seah-orange-500">
                      {idx + 1}
                    </span>

                    {/* 물품 정보 */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-seah-gray-500">
                        {item.name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400">
                        {item.spec && <span>규격: {item.spec}</span>}
                        {item.maker && <span>메이커: {item.maker}</span>}
                        <span>
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* 사진 수 */}
                    {item.photos.length > 0 && (
                      <span className="shrink-0 rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        📷 {item.photos.length}
                      </span>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditItem(idx)}
                        className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-seah-gray-500"
                        aria-label="수정"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                        aria-label="삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 제출 버튼 ──────────────────────────────────── */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-seah-gray-500 transition-colors hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-seah-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-seah-orange-600 disabled:opacity-60"
            >
              <Save size={16} />
              반출 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
