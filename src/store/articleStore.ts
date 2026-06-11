import { create } from 'zustand';
import type { Article, Task, OutlineSection, TitleOption, ReviewIssue, Version, Comment, ResolvedType } from '@/types';
import { articles, tasks } from '@/data/articles';
import { outlineSections, titleOptions, reviewIssues as defaultReviewIssues, versions as initialVersions, comments as initialComments } from '@/data/materials';

const STORAGE_PREFIX = 'mobi_review_';

const loadReviewIssuesFromStorage = (articleId: string): ReviewIssue[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + articleId);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    return null;
  }
  return null;
};

const saveReviewIssuesToStorage = (articleId: string, issues: ReviewIssue[]) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + articleId, JSON.stringify(issues));
  } catch {
    // ignore
  }
};

const initReviewIssues = (): ReviewIssue[] => {
  const allIssues: ReviewIssue[] = [];
  const articleIds = [...new Set(defaultReviewIssues.map((i) => i.articleId))];

  articleIds.forEach((articleId) => {
    const stored = loadReviewIssuesFromStorage(articleId);
    if (stored && stored.length > 0) {
      allIssues.push(...stored);
    } else {
      const articleIssues = defaultReviewIssues.filter((i) => i.articleId === articleId);
      allIssues.push(...articleIssues);
      saveReviewIssuesToStorage(articleId, articleIssues);
    }
  });

  defaultReviewIssues.forEach((i) => {
    if (!allIssues.find((ai) => ai.id === i.id)) {
      const stored = loadReviewIssuesFromStorage(i.articleId);
      if (!stored || stored.length === 0) {
        allIssues.push(i);
      }
    }
  });

  return allIssues;
};

const loadVersionsFromStorage = (articleId: string): Version[] | null => {
  try {
    const raw = localStorage.getItem(`mobi_versions_${articleId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    return null;
  }
  return null;
};

const saveVersionsToStorage = (articleId: string, versions: Version[]) => {
  try {
    localStorage.setItem(`mobi_versions_${articleId}`, JSON.stringify(versions));
  } catch {
    // ignore
  }
};

const initVersions = (): Version[] => {
  const allVersions: Version[] = [];
  const articleIds = [...new Set(initialVersions.map((v) => v.articleId))];
  
  articleIds.forEach((articleId) => {
    const stored = loadVersionsFromStorage(articleId);
    if (stored && stored.length > 0) {
      allVersions.push(...stored);
    } else {
      const articleVersions = initialVersions.filter((v) => v.articleId === articleId);
      allVersions.push(...articleVersions);
    }
  });

  initialVersions.forEach((v) => {
    if (!allVersions.find((av) => av.id === v.id)) {
      const stored = loadVersionsFromStorage(v.articleId);
      if (!stored || stored.length === 0) {
        allVersions.push(v);
      }
    }
  });

  return allVersions;
};

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
  ignoreIssue: (id: string) => void;
  acceptAllIssues: (articleId: string) => void;
  saveVersion: (articleId: string, note: string, author: string, content: string) => void;
  getVersionsByArticleId: (articleId: string) => Version[];
  addComment: (comment: Comment) => void;
  resolveComment: (id: string) => void;
  getCommentsByArticleId: (articleId: string) => Comment[];
  addReply: (parentId: string, reply: Comment) => void;
  loadIssuesForArticle: (articleId: string) => ReviewIssue[];
}

const getArticleIdByIssueId = (issues: ReviewIssue[], issueId: string): string | null => {
  const issue = issues.find((i) => i.id === issueId);
  return issue ? issue.articleId : null;
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles,
  tasks,
  currentArticleId: null,
  outlineSections,
  titleOptions,
  reviewIssues: initReviewIssues(),
  versions: initVersions(),
  comments: initialComments,

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
    set((state) => {
      const articleId = getArticleIdByIssueId(state.reviewIssues, id);
      const newIssues = state.reviewIssues.map((i) =>
        i.id === id ? { ...i, resolved: true, resolvedType: 'accepted' as ResolvedType } : i
      );
      if (articleId) {
        saveReviewIssuesToStorage(
          articleId,
          newIssues.filter((i) => i.articleId === articleId)
        );
      }
      return { reviewIssues: newIssues };
    }),

  ignoreIssue: (id) =>
    set((state) => {
      const articleId = getArticleIdByIssueId(state.reviewIssues, id);
      const newIssues = state.reviewIssues.map((i) =>
        i.id === id ? { ...i, resolved: true, resolvedType: 'ignored' as ResolvedType } : i
      );
      if (articleId) {
        saveReviewIssuesToStorage(
          articleId,
          newIssues.filter((i) => i.articleId === articleId)
        );
      }
      return { reviewIssues: newIssues };
    }),

  acceptAllIssues: (articleId) =>
    set((state) => {
      const newIssues = state.reviewIssues.map((i) =>
        i.articleId === articleId && !i.resolved
          ? { ...i, resolved: true, resolvedType: 'accepted' as ResolvedType }
          : i
      );
      saveReviewIssuesToStorage(
        articleId,
        newIssues.filter((i) => i.articleId === articleId)
      );
      return { reviewIssues: newIssues };
    }),

  saveVersion: (articleId, note, author, content) => {
    const state = get();
    const articleVersions = state.versions.filter((v) => v.articleId === articleId);
    const maxVersion = articleVersions.length > 0 
      ? Math.max(...articleVersions.map((v) => v.versionNumber))
      : 0;

    const newVersion: Version = {
      id: `v-${Date.now()}`,
      articleId,
      versionNumber: maxVersion + 1,
      content,
      note,
      author,
      createdAt: new Date().toISOString(),
    };

    const nextVersions = [...state.versions, newVersion];
    const nextArticleVersions = nextVersions.filter((v) => v.articleId === articleId);
    saveVersionsToStorage(articleId, nextArticleVersions);

    set({ versions: nextVersions });
  },

  getVersionsByArticleId: (articleId) => {
    return get()
      .versions.filter((v) => v.articleId === articleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),

  resolveComment: (id) =>
    set((state) => ({
      comments: state.comments.map((c) => {
        if (c.id === id) return { ...c, status: 'resolved' as const };
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === id ? { ...r, status: 'resolved' as const } : r
            ),
          };
        }
        return c;
      }),
    })),

  getCommentsByArticleId: (articleId) =>
    get().comments.filter((c) => c.articleId === articleId),

  addReply: (parentId, reply) =>
    set((state) => ({
      comments: state.comments.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), reply],
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === parentId ? { ...r, replies: [...(r.replies || []), reply] } : r
            ),
          };
        }
        return c;
      }),
    })),

  loadIssuesForArticle: (articleId) => {
    const state = get();
    let articleIssues = state.reviewIssues.filter((i) => i.articleId === articleId);

    if (articleIssues.length === 0) {
      const stored = loadReviewIssuesFromStorage(articleId);
      if (stored && stored.length > 0) {
        articleIssues = stored;
        set({ reviewIssues: [...state.reviewIssues, ...stored] });
      } else {
        const defaults = defaultReviewIssues.filter((i) => i.articleId === articleId);
        if (defaults.length > 0) {
          articleIssues = defaults;
          set({ reviewIssues: [...state.reviewIssues, ...defaults] });
          saveReviewIssuesToStorage(articleId, defaults);
        }
      }
    }

    return articleIssues;
  },
}));
