export type ArticleStatus = 'draft' | 'topic' | 'outline' | 'writing' | 'review' | 'ready' | 'published' | 'archived';

export interface Article {
  id: string;
  title: string;
  topic: string;
  status: ArticleStatus;
  deadline: string;
  wordCount: number;
  targetWordCount: number;
  audienceTags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface OutlineSection {
  id: string;
  articleId: string;
  title: string;
  keyPoint: string;
  wordEstimate: number;
  imageSuggestion: string;
  orderIndex: number;
  parentId?: string;
  children?: OutlineSection[];
}

export interface TitleOption {
  id: string;
  articleId: string;
  title: string;
  isPrimary: boolean;
  votes: number;
  aiSuggestion?: string;
}

export type MaterialType = 'image' | 'quote' | 'link' | 'note' | 'golden';

export interface Material {
  id: string;
  type: MaterialType;
  title: string;
  content: string;
  source?: string;
  imageUrl?: string;
  tags: string[];
  caption?: string;
  createdAt: string;
}

export type BrandTermCategory = 'product' | 'slogan' | 'forbidden' | 'preferred';

export interface BrandTerm {
  id: string;
  term: string;
  category: BrandTermCategory;
  replacement?: string;
  isForbidden: boolean;
  description?: string;
}

export type VersionSource = 'manual' | 'review_apply' | 'auto_save';

export interface Version {
  id: string;
  articleId: string;
  versionNumber: number;
  content: string;
  note: string;
  author: string;
  createdAt: string;
  source?: VersionSource;
}

export type DraftVersionSource = 'manual' | 'ai_tone' | 'ai_expand' | 'ai_golden' | 'material_insert' | 'review_apply';

export interface DraftVersion {
  id: string;
  articleId: string;
  versionNumber: number;
  content: string;
  note: string;
  createdAt: string;
  wordCount: number;
  source?: DraftVersionSource;
}

export interface Comment {
  id: string;
  articleId: string;
  paragraphRef?: string;
  content: string;
  author: string;
  avatar?: string;
  status: 'open' | 'resolved';
  createdAt: string;
  replies?: Comment[];
}

export interface ArticleMetrics {
  id: string;
  articleId: string;
  title: string;
  views: number;
  reads: number;
  likes: number;
  favorites: number;
  shares: number;
  comments: number;
  readRate: number;
  shareRate: number;
  favoriteRate: number;
  publishedAt: string;
}

export type IssueType = 'sensitive' | 'typo' | 'duplicate' | 'compliance';
export type IssueSeverity = 'high' | 'medium' | 'low';

export type ResolvedType = 'accepted' | 'ignored';

export interface ReviewIssue {
  id: string;
  articleId: string;
  type: IssueType;
  severity: IssueSeverity;
  originalText: string;
  suggestion?: string;
  position: number;
  resolved: boolean;
  resolvedType?: ResolvedType;
  accepted?: boolean;
}

export interface CalendarItem {
  id: string;
  date: string;
  articleId: string;
  title: string;
  status: ArticleStatus;
}

export type TrendDirection = 'up' | 'down' | 'stable';

export interface HotTopic {
  id: string;
  rank: number;
  title: string;
  heat: number;
  category: string;
  trend: TrendDirection;
}

export interface Task {
  id: string;
  articleId: string;
  title: string;
  topic: string;
  status: ArticleStatus;
  deadline: string;
  progress: number;
}

export type AITone = 'formal' | 'casual' | 'professional' | 'literary';

export type AIOperationType = 'tone' | 'expand' | 'golden' | 'polish';

export interface AIOperation {
  id: string;
  type: AIOperationType;
  label: string;
  position: number;
  length: number;
  oldText: string;
  newText: string;
  timestamp: string;
}

export interface DailyMetric {
  date: string;
  views: number;
  reads: number;
  shares: number;
  favorites: number;
}

export interface TitleComparison {
  id: string;
  title: string;
  views: number;
  clicks: number;
  ctr: number;
  isWinner: boolean;
}
