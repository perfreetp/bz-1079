import { create } from 'zustand';
import type { Article, Task, OutlineSection, TitleOption, ReviewIssue, Version, Comment, ResolvedType, VersionSource, DraftVersion, DraftVersionSource, InsertedMaterial } from '@/types';
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

const loadDraftVersionsFromStorage = (articleId: string): DraftVersion[] => {
  try {
    const raw = localStorage.getItem(`mobi_draft_versions_${articleId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
};

const saveDraftVersionsToStorage = (articleId: string, versions: DraftVersion[]) => {
  try {
    localStorage.setItem(`mobi_draft_versions_${articleId}`, JSON.stringify(versions));
  } catch {
    // ignore
  }
};

interface ArticleStore {
  articles: Article[];
  tasks: Task[];
  currentArticleId: string | null;
  lastEditedArticleId: string | null;
  outlineSections: OutlineSection[];
  titleOptions: TitleOption[];
  reviewIssues: ReviewIssue[];
  versions: Version[];
  comments: Comment[];

  setCurrentArticle: (id: string | null) => void;
  setLastEditedArticleId: (id: string) => void;
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
  saveVersion: (articleId: string, note: string, author: string, content: string, source?: VersionSource) => void;
  getVersionsByArticleId: (articleId: string) => Version[];
  addComment: (comment: Comment) => void;
  resolveComment: (id: string) => void;
  getCommentsByArticleId: (articleId: string) => Comment[];
  addReply: (parentId: string, reply: Comment) => void;
  toggleTodo: (id: string) => void;
  loadIssuesForArticle: (articleId: string) => ReviewIssue[];
  appendDraftContent: (articleId: string, text: string) => void;
  getDraftContent: (articleId: string) => string;
  saveDraftVersion: (articleId: string, content: string, note: string, source?: DraftVersionSource) => DraftVersion;
  getDraftVersions: (articleId: string) => DraftVersion[];
  getDraftVersionById: (articleId: string, versionId: string) => DraftVersion | null;
  restoreDraftVersion: (articleId: string, versionId: string) => DraftVersion | null;
  setDraftContent: (articleId: string, content: string) => void;
  logMaterialInsert: (articleId: string, materialId: string, materialType: 'image' | 'quote' | 'brand', content: string, position: number, title: string) => void;
  getInsertedMaterials: (articleId: string) => InsertedMaterial[];
}

const getArticleIdByIssueId = (issues: ReviewIssue[], issueId: string): string | null => {
  const issue = issues.find((i) => i.id === issueId);
  return issue ? issue.articleId : null;
};

const loadLastEditedArticleId = (): string | null => {
  try {
    return localStorage.getItem('mobi_last_article');
  } catch {
    return null;
  }
};

const saveLastEditedArticleId = (id: string) => {
  try {
    localStorage.setItem('mobi_last_article', id);
  } catch {
    // ignore
  }
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles,
  tasks,
  currentArticleId: null,
  lastEditedArticleId: loadLastEditedArticleId(),
  outlineSections,
  titleOptions,
  reviewIssues: initReviewIssues(),
  versions: initVersions(),
  comments: initialComments,

  setCurrentArticle: (id) => set({ currentArticleId: id }),

  setLastEditedArticleId: (id) => {
    saveLastEditedArticleId(id);
    set({ lastEditedArticleId: id });
  },

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

  saveVersion: (articleId, note, author, content, source) => {
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
      source,
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

  toggleTodo: (id) =>
    set((state) => ({
      comments: state.comments.map((c) => {
        if (c.id === id) {
          return { ...c, completed: !c.completed };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === id ? { ...r, completed: !r.completed } : r
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

  appendDraftContent: (articleId, text) => {
    const key = `mobi_draft_content_${articleId}`;
    try {
      const existing = localStorage.getItem(key) || '';
      localStorage.setItem(key, existing + text);
    } catch {
      // ignore
    }
  },

  getDraftContent: (articleId) => {
    const key = `mobi_draft_${articleId}`;
    try {
      return localStorage.getItem(key) || '';
    } catch {
      return '';
    }
  },

  setDraftContent: (articleId, content) => {
    const key = `mobi_draft_${articleId}`;
    try {
      localStorage.setItem(key, content);
    } catch {
      // ignore
    }
  },

  saveDraftVersion: (articleId, content, note, source) => {
    const draftVersions = loadDraftVersionsFromStorage(articleId);
    const maxVersion = draftVersions.length > 0
      ? Math.max(...draftVersions.map((v) => v.versionNumber))
      : 0;

    const newVersion: DraftVersion = {
      id: `dv-${Date.now()}`,
      articleId,
      versionNumber: maxVersion + 1,
      content,
      note,
      createdAt: new Date().toISOString(),
      wordCount: content.replace(/\s/g, '').length,
      source,
    };

    const nextVersions = [...draftVersions, newVersion];
    saveDraftVersionsToStorage(articleId, nextVersions);

    const draftKey = `mobi_draft_${articleId}`;
    try {
      localStorage.setItem(draftKey, content);
    } catch {
      // ignore
    }

    return newVersion;
  },

  getDraftVersions: (articleId) => {
    const versions = loadDraftVersionsFromStorage(articleId);
    return versions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getDraftVersionById: (articleId, versionId) => {
    const versions = loadDraftVersionsFromStorage(articleId);
    return versions.find((v) => v.id === versionId) || null;
  },

  restoreDraftVersion: (articleId, versionId) => {
    const version = get().getDraftVersionById(articleId, versionId);
    if (!version) return null;
    return version;
  },

  logMaterialInsert: (articleId, materialId, materialType, content, position, title) => {
    const key = `mobi_insert_log_${articleId}`;
    try {
      const raw = localStorage.getItem(key);
      const logs: InsertedMaterial[] = raw ? JSON.parse(raw) : [];
      const entry: InsertedMaterial = {
        id: `im-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        articleId,
        materialId,
        materialType,
        content,
        position,
        insertedAt: new Date().toISOString(),
        title,
      };
      logs.push(entry);
      localStorage.setItem(key, JSON.stringify(logs));
    } catch {
      // ignore
    }
  },

  getInsertedMaterials: (articleId) => {
    const key = `mobi_insert_log_${articleId}`;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as InsertedMaterial[] : [];
    } catch {
      return [];
    }
  },
}));
