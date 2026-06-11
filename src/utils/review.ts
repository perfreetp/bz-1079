import type { ReviewIssue, IssueType, IssueSeverity } from '@/types';

const SENSITIVE_WORDS = [
  { word: '最', replacement: '非常' },
  { word: '第一', replacement: '领先' },
  { word: '国家级', replacement: '行业级' },
  { word: '最高级', replacement: '高级' },
  { word: '顶级', replacement: '优质' },
  { word: '唯一', replacement: '独特' },
  { word: '绝对', replacement: '相当' },
  { word: '100%', replacement: '高比例' },
];

const TYPO_MAP: Record<string, string> = {
  做号: '做好',
  年年龄: '年龄',
  内容容: '内容',
  用户户: '用户',
  运运营: '运营',
};

export function detectSensitiveWords(text: string, articleId = 'mock'): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  SENSITIVE_WORDS.forEach(({ word, replacement }) => {
    let pos = text.indexOf(word);
    while (pos !== -1) {
      issues.push({
        id: `sensitive-${pos}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        articleId,
        type: 'compliance' as IssueType,
        severity: word === '国家级' || word === '最' ? 'high' : 'medium',
        originalText: word,
        suggestion: replacement,
        position: pos,
        resolved: false,
      });
      pos = text.indexOf(word, pos + 1);
    }
  });
  return issues;
}

export function detectTypos(text: string, articleId = 'mock'): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  Object.entries(TYPO_MAP).forEach(([wrong, right]) => {
    let pos = text.indexOf(wrong);
    while (pos !== -1) {
      issues.push({
        id: `typo-${pos}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        articleId,
        type: 'typo' as IssueType,
        severity: 'medium' as IssueSeverity,
        originalText: wrong,
        suggestion: right,
        position: pos,
        resolved: false,
      });
      pos = text.indexOf(wrong, pos + 1);
    }
  });
  return issues;
}

export function detectDuplicateExpressions(text: string, articleId = 'mock'): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  const sentences = text.split(/[，。！？；\n]/).filter((s) => s.trim().length > 10);

  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const s1 = sentences[i].trim();
      const s2 = sentences[j].trim();
      if (s1.length > 15 && s2.length > 15 && similarText(s1, s2) > 0.7) {
        const pos = text.indexOf(s1);
        if (pos !== -1 && !issues.some((iss) => iss.position === pos)) {
          issues.push({
            id: `dup-${pos}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            articleId,
            type: 'duplicate' as IssueType,
            severity: 'low' as IssueSeverity,
            originalText: s1,
            suggestion: '建议合并或改写，避免语义重复',
            position: pos,
            resolved: false,
          });
        }
      }
    }
  }
  return issues;
}

function similarText(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1.0;
  const costs: number[] = [];
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (shorter.charAt(i - 1) !== longer.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[longer.length] = lastValue;
  }
  return (longer.length - costs[longer.length]) / longer.length;
}

export function checkCompliance(text: string, industry?: string, articleId = 'mock'): ReviewIssue[] {
  return detectSensitiveWords(text, articleId);
}

export async function runFullReview(
  text: string,
  articleId = 'mock'
): Promise<{
  issues: ReviewIssue[];
  summary: { total: number; high: number; medium: number; low: number };
}> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const allIssues = [
    ...detectSensitiveWords(text, articleId),
    ...detectTypos(text, articleId),
    ...detectDuplicateExpressions(text, articleId),
    ...checkCompliance(text, undefined, articleId),
  ];

  const summary = {
    total: allIssues.length,
    high: allIssues.filter((i) => i.severity === 'high').length,
    medium: allIssues.filter((i) => i.severity === 'medium').length,
    low: allIssues.filter((i) => i.severity === 'low').length,
  };

  return { issues: allIssues, summary };
}

export function countWords(text: string): number {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (text.match(/[a-zA-Z]+/g) || []).length;
  return chinese + english;
}

export function estimateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 300);
}
