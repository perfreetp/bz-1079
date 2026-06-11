export function formatDate(dateStr: string, format: 'full' | 'short' | 'cn' = 'short'): string {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  if (format === 'full') {
    return `${y}-${m}-${d} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  if (format === 'cn') {
    return `${y}年${m}月${d}日`;
  }
  return `${y}-${m}-${d}`;
}

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatDate(dateStr, 'short');
}

export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return String(num);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function getStatusText(status: string): string {
  const map: Record<string, string> = {
    draft: '草稿',
    topic: '选题中',
    outline: '大纲中',
    writing: '写作中',
    review: '审核中',
    ready: '待发布',
    published: '已发布',
    archived: '已归档',
  };
  return map[status] || status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    draft: 'ink',
    topic: 'ink',
    outline: 'gold',
    writing: 'gold',
    review: 'vermilion',
    ready: 'moss',
    published: 'moss',
    archived: 'ink',
  };
  return map[status] || 'ink';
}

export function getIssueTypeText(type: string): string {
  const map: Record<string, string> = {
    sensitive: '敏感词',
    typo: '错别字',
    duplicate: '重复表达',
    compliance: '广告合规',
  };
  return map[type] || type;
}

export function getSeverityText(severity: string): string {
  const map: Record<string, string> = {
    high: '严重',
    medium: '中等',
    low: '轻微',
  };
  return map[severity] || severity;
}

export function getMaterialTypeText(type: string): string {
  const map: Record<string, string> = {
    image: '图片',
    quote: '引用',
    link: '链接',
    note: '笔记',
    golden: '金句',
  };
  return map[type] || type;
}
