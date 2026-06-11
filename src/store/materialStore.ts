import { create } from 'zustand';
import type { Material, BrandTerm, HotTopic, CalendarItem } from '@/types';
import { materials, brandTerms } from '@/data/materials';
import { hotTopics, calendarItems } from '@/data/articles';

interface MaterialStore {
  materials: Material[];
  brandTerms: BrandTerm[];
  hotTopics: HotTopic[];
  calendarItems: CalendarItem[];
  selectedTags: string[];
  searchQuery: string;

  addMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;
  toggleTag: (tag: string) => void;
  setSearchQuery: (q: string) => void;
  addHotTopicToMaterials: (topic: HotTopic) => void;
}

export const useMaterialStore = create<MaterialStore>((set, get) => ({
  materials,
  brandTerms,
  hotTopics,
  calendarItems,
  selectedTags: [],
  searchQuery: '',

  addMaterial: (material) => set((state) => ({ materials: [material, ...state.materials] })),

  deleteMaterial: (id) => set((state) => ({ materials: state.materials.filter((m) => m.id !== id) })),

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
