import { create } from 'zustand';

export interface ExportItem {
  id: number;
  name: string;
  spec: string;
  unit: string;
  maker: string;
  quantity: string;
  reason: string;
  note: string;
  photos: string[];
}

interface ExportDraftState {
  // 기본 정보
  outSite: string;
  exportDate: string;
  authorName: string;
  authorDept: string;
  authorPhone1: string;
  authorPhone2: string;
  authorPhone3: string;
  partnerCompany: string;
  receiverName: string;
  receiverPhone1: string;
  receiverPhone2: string;
  receiverPhone3: string;
  transportType: string;

  // 물품 목록
  items: ExportItem[];
  editingIndex: number | null;

  setField: <K extends keyof Omit<ExportDraftState, 'items' | 'editingIndex' | 'setField' | 'addItem' | 'updateItem' | 'removeItem' | 'setEditingIndex' | 'clearDraft'>>(
    key: K,
    value: ExportDraftState[K]
  ) => void;
  addItem: (item: Omit<ExportItem, 'id'>) => void;
  updateItem: (index: number, item: Omit<ExportItem, 'id'>) => void;
  removeItem: (index: number) => void;
  setEditingIndex: (index: number | null) => void;
  clearDraft: () => void;
}

let itemIdSeq = 1;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useExportDraftStore = create<ExportDraftState>((set) => ({
  outSite: '',
  exportDate: todayStr(),
  authorName: '',
  authorDept: '',
  authorPhone1: '010',
  authorPhone2: '',
  authorPhone3: '',
  partnerCompany: '',
  receiverName: '',
  receiverPhone1: '010',
  receiverPhone2: '',
  receiverPhone3: '',
  transportType: '',
  items: [],
  editingIndex: null,

  setField: (key, value) => set((s) => ({ ...s, [key]: value })),

  addItem: (item) =>
    set((s) => ({
      items: [...s.items, { ...item, id: itemIdSeq++ }],
    })),

  updateItem: (index, item) =>
    set((s) => ({
      items: s.items.map((it, i) => (i === index ? { ...item, id: it.id } : it)),
    })),

  removeItem: (index) =>
    set((s) => ({
      items: s.items.filter((_, i) => i !== index),
    })),

  setEditingIndex: (index) => set({ editingIndex: index }),

  clearDraft: () =>
    set({
      outSite: '',
      exportDate: todayStr(),
      authorName: '',
      authorDept: '',
      authorPhone1: '010',
      authorPhone2: '',
      authorPhone3: '',
      partnerCompany: '',
      receiverName: '',
      receiverPhone1: '010',
      receiverPhone2: '',
      receiverPhone3: '',
      transportType: '',
      items: [],
      editingIndex: null,
    }),
}));
