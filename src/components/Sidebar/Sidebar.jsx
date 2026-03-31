import React from 'react'
import { CalendarDays, BarChart2 } from 'lucide-react'
import { useData } from '../../context/DataContext'

const NAV = [
  { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
]

export default function Sidebar({ page, setPage }) {
  const { getStreak } = useData()
  const streak = getStreak()

  return (
    <aside className="w-16 md:w-52 flex-shrink-0 flex flex-col gap-2 py-4 px-2 md:px-3 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-petal text-white text-sm">
          🌸
        </div>
        <span className="hidden md:block font-display text-lg font-semibold text-rose-800">Blossom</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
              ${page === id
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-petal'
                : 'text-pink-400 hover:bg-pink-100 hover:text-pink-600'}`}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="hidden md:block text-sm font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* Streak badge */}
      {streak > 0 && (
        <div className="glass-card p-3 flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-rose-800">{streak} day streak!</div>
            <div className="text-xs text-pink-400">Keep it up ✨</div>
          </div>
        </div>
      )}
    </aside>
  )
}