import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Lightbulb,
  ListTree,
  PenTool,
  Library,
  ShieldCheck,
  Send,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '工作台' },
  { to: '/topics', icon: Lightbulb, label: '选题中心' },
  { to: '/outline', icon: ListTree, label: '大纲构建' },
  { to: '/writing', icon: PenTool, label: '智能写作' },
  { to: '/library', icon: Library, label: '素材库' },
  { to: '/review', icon: ShieldCheck, label: '内容审核' },
  { to: '/publish', icon: Send, label: '发布协作' },
  { to: '/analytics', icon: BarChart3, label: '数据复盘' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen flex flex-col bg-ink-900 text-paper-100">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vermilion flex items-center justify-center">
            <PenTool className="w-5 h-5 text-paper-50" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-paper-50">墨笔</h1>
            <p className="text-xs text-paper-100/50">智能内容创作平台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item')
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vermilion to-gold flex items-center justify-center text-paper-50 font-semibold">
            墨
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-paper-50 truncate">墨客</p>
            <p className="text-xs text-paper-100/50 truncate">editor@mobili.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
