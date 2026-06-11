import { useLocation } from 'react-router-dom'
import { Bell, Search, Plus } from 'lucide-react'

const titleMap: Record<string, string> = {
  '/': '工作台',
  '/topics': '选题中心',
  '/outline': '大纲构建',
  '/writing': '智能写作',
  '/library': '素材库',
  '/review': '内容审核',
  '/publish': '发布协作',
  '/analytics': '数据复盘',
}

export default function Header() {
  const location = useLocation()
  const title = titleMap[location.pathname] || '工作台'

  return (
    <header className="h-16 px-8 flex items-center gap-6 bg-white border-b border-paper-200">
      <h1 className="font-serif text-xl font-semibold text-ink-800">{title}</h1>

      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
        <input
          type="text"
          placeholder="搜索文章、素材..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-paper-100 border border-transparent text-sm text-ink-800 placeholder:text-ink-300 focus:outline-none focus:border-vermilion focus:bg-white focus:ring-2 focus:ring-vermilion-100 transition-all duration-150"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-paper-100 transition-colors">
          <Bell className="w-5 h-5 text-ink-500" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-vermilion text-paper-50 text-xs font-medium flex items-center justify-center">
            3
          </span>
        </button>

        <button className="btn-vermilion">
          <Plus className="w-4 h-4" />
          新建文章
        </button>
      </div>
    </header>
  )
}
