import { create } from 'zustand';
import type { Material, BrandTerm, HotTopic, CalendarItem } from '@/types';
import { materials as defaultMaterials, brandTerms as defaultBrandTerms } from '@/data/materials';
import { hotTopics, calendarItems } from '@/data/articles';

const MATERIALS_KEY = 'mobi_materials';
const BRANDTERMS_KEY = 'mobi_brandterms';

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (e) {
    console.error(`读取 localStorage ${key} 失败:`, e);
  }
  return defaultValue;
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`写入 localStorage ${key} 失败:`, e);
  }
};

const initialMaterials = loadFromStorage<Material[]>(MATERIALS_KEY, defaultMaterials);
const initialBrandTerms = loadFromStorage<BrandTerm[]>(BRANDTERMS_KEY, defaultBrandTerms);

interface MaterialStore {
  materials: Material[];
  brandTerms: BrandTerm[];
  hotTopics: HotTopic[];
  calendarItems: CalendarItem[];
  selectedTags: string[];
  searchQuery: string;

  addMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  addBrandTerm: (term: BrandTerm) => void;
  deleteBrandTerm: (id: string) => void;
  addReference: (ref: { title: string; source: string }) => void;
  toggleTag: (tag: string) => void;
  setSearchQuery: (q: string) => void;
  addHotTopicToMaterials: (topic: HotTopic) => void;
}

export const useMaterialStore = create<MaterialStore>((set, get) => ({
  materials: initialMaterials,
  brandTerms: initialBrandTerms,
  hotTopics,
  calendarItems,
  selectedTags: [],
  searchQuery: '',

  addMaterial: (material) => {
    set((state) => {
      const newMaterials = [material, ...state.materials];
      saveToStorage(MATERIALS_KEY, newMaterials);
      return { materials: newMaterials };
    });
  },

  deleteMaterial: (id) => {
    set((state) => {
      const newMaterials = state.materials.filter((m) => m.id !== id);
      saveToStorage(MATERIALS_KEY, newMaterials);
      return { materials: newMaterials };
    });
  },

  updateMaterial: (id, updates) => {
    set((state) => {
      const newMaterials = state.materials.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      );
      saveToStorage(MATERIALS_KEY, newMaterials);
      return { materials: newMaterials };
    });
  },

  addBrandTerm: (term) => {
    set((state) => {
      const newTerms = [term, ...state.brandTerms];
      saveToStorage(BRANDTERMS_KEY, newTerms);
      return { brandTerms: newTerms };
    });
  },

  deleteBrandTerm: (id) => {
    set((state) => {
      const newTerms = state.brandTerms.filter((t) => t.id !== id);
      saveToStorage(BRANDTERMS_KEY, newTerms);
      return { brandTerms: newTerms };
    });
  },

  addReference: (ref) => {
    const newMaterial: Material = {
      id: `ref-${Date.now()}`,
      type: 'link',
      title: ref.title,
      content: ref.source,
      source: ref.source,
      tags: ['引用'],
      createdAt: new Date().toISOString(),
    };
    get().addMaterial(newMaterial);
  },

  toggleTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),

  setSearchQuery: (q) => set({ searchQuery: q }),

  addHotTopicToMaterials: (topic) => {
    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      type: 'note',
      title: topic.title,
      content: `热点话题：${topic.title}，热度：${topic.heat}，分类：${topic.category}`,
      tags: ['热点', topic.category],
      createdAt: new Date().toISOString(),
    };
    get().addMaterial(newMaterial);
  },
}));
