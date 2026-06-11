import { create } from 'zustand';
import type { Article, Task, OutlineSection, TitleOption, ReviewIssue, Version, Comment } from '@/types';
import { articles, tasks } from '@/data/articles';
import { outlineSections, titleOptions, reviewIssues, versions, comments } from '@/data/materials';

interface ArticleStore {
  articles: Article[];
  tasks: Task[];
  currentArticleId: string | null;
  outlineSections: OutlineSection[];
  titleOptions: TitleOption[];
  reviewIssues: ReviewIssue[];
  versions: Version[];
  comments: Comment[];

  setCurrentArticle: (id: string | null) => void;
  getArticleById: (id: string) => Article | undefined;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  updateOutlineSections: (sections: OutlineSection[]) => void;
  addOutlineSection: (section: OutlineSection) => void;
  setPrimaryTitle: (id: string) => void;
  addTitleOption: (option: TitleOption) => void;
  voteTitle: (id: string) => void;
  resolveIssue: (id: string) => void;
  addComment: (comment: Comment) => void;
  resolveComment: (id: string) => void;
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles,
  tasks,
  currentArticleId: null,
  outlineSections,
  titleOptions,
  reviewIssues,
  versions,
  comments,

  setCurrentArticle: (id) => set({ currentArticleId: id }),

  getArticleById: (id) => get().articles.find((a) => a.id === id),

  updateArticle: (id, updates) =>
    set((state) => ({
      articles: state.articles.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)),
    })),

  updateOutlineSections: (sections) => set({ outlineSections: sections }),

  addOutlineSection: (section) =>
    set((state) => ({ outlineSections: [...state.outlineSections, section] })),

  setPrimaryTitle: (id) =>
    set((state) => ({
      titleOptions: state.titleOptions.map((t) => ({ ...t, isPrimary: t.id === id })),
    })),

  addTitleOption: (option) =>
    set((state) => ({ titleOptions: [...state.titleOptions, option] })),

  voteTitle: (id) =>
    set((state) => ({
      titleOptions: state.titleOptions.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t)),
    })),

  resolveIssue: (id) =>
    set((state) => ({
      reviewIssues: state.reviewIssues.map((i) => (i.id === id ? { ...i, resolved: true } : i)),
    })),

  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),

  resolveComment: (id) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === id ? { ...c, status: 'resolved' as const } : c
      ),
    })),
}));
