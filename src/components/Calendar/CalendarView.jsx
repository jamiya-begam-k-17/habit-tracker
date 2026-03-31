import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useData, formatDateKey } from '../../context/DataContext'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function getHeatColor(score) {
  if (score === 0) return { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-rose-900' }
  if (score < 25) return { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-rose-900' }
  if (score < 50) return { bg: 'bg-pink-200', border: 'border-pink-300', text: 'text-rose-900' }
  if (score < 75) return { bg: 'bg-pink-300', border: 'border-pink-400', text: 'text-rose-900' }
  return { bg: 'bg-rose-400', border: 'border-rose-500', text: 'text-white' }
}

export default function CalendarView({ onDayClick, selectedDate }) {
  const { getProductivityScore, getDayData } = useData()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [showYearPicker, setShowYearPicker] = useState(false)

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const todayKey = formatDateKey(today)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i)

  const cells = []
  // Empty cells
  for (let i = 0; i < firstDay; i++) cells.push(null)
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(viewYear, viewMonth, d)
    const key = formatDateKey(dateObj)
    const score = getProductivityScore(key)
    const dayData = getDayData(key)
    const taskCount = dayData.tasks.length
    const taskDone = dayData.tasks.filter(t => t.done).length
    const expenseTotal = dayData.expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)
    const isToday = key === todayKey
    const isSelected = selectedDate === key
    const isFuture = dateObj > today
    cells.push({ day: d, key, score, taskCount, taskDone, expenseTotal, isToday, isSelected, isFuture })
  }

  return (
    <div className="glass-card p-5 animate-fade-in bg-white/60 backdrop-blur-sm border border-pink-200/50 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-pink-100 text-pink-400 hover:text-pink-600 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <button
            onClick={() => setShowYearPicker(v => !v)}
            className="font-display text-xl font-semibold text-rose-800 hover:text-rose-600 transition-colors"
          >
            {MONTHS[viewMonth]} {viewYear}
          </button>
          {showYearPicker && (
            <div className="absolute z-50 mt-2 bg-white border border-pink-200 rounded-2xl shadow-petal-lg p-3 grid grid-cols-4 gap-1 animate-scale-in"
              style={{ left: '50%', transform: 'translateX(-50%)' }}>
              {years.map(y => (
                <button key={y} onClick={() => { setViewYear(y); setShowYearPicker(false) }}
                  className={`text-xs px-2 py-1.5 rounded-lg font-mono transition-colors
                    ${y === viewYear ? 'bg-pink-400 text-white' : 'hover:bg-pink-50 text-rose-700'}`}>
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-pink-100 text-pink-400 hover:text-pink-600 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-xs font-medium text-pink-300 py-1">{w}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} />
          const colors = getHeatColor(cell.score)
          return (
            <button
              key={cell.key}
              onClick={() => !cell.isFuture && onDayClick(cell.key)}
              disabled={cell.isFuture}
              className={`
                relative h-6 w-6 rounded-xl border flex flex-col items-center justify-center
                transition-all duration-150 group
                ${colors.bg} ${colors.border}
                ${cell.isSelected ? 'ring-2 ring-rose-400 ring-offset-1 scale-105' : ''}
                ${cell.isToday ? 'ring-2 ring-pink-400 font-bold' : ''}
                ${cell.isFuture ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:shadow-petal cursor-pointer'}
              `}
            >
              <span className={`text-xs font-medium leading-none ${colors.text} ${cell.score > 75 ? 'text-white' : ''}`}>
                {cell.day}
              </span>
              {cell.isToday && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-pink-500 rounded-full" />
              )}
              {cell.taskCount > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: Math.min(cell.taskCount, 3) }).map((_, j) => (
                    <span key={j} className={`w-1 h-1 rounded-full ${j < cell.taskDone ? 'bg-green-400' : 'bg-pink-300'}`} />
                  ))}
                </div>
              )}
              {cell.expenseTotal > 0 && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] text-pink-500 font-mono leading-none">
                  ₹{cell.expenseTotal > 999 ? (cell.expenseTotal/1000).toFixed(1)+'k' : Math.round(cell.expenseTotal)}
                </span>
              )}
              {/* Tooltip */}
              {cell.score > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                  <div className="bg-rose-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
                    Score: {cell.score}%
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="text-xs text-pink-300">Less</span>
        {[0, 20, 45, 70, 90].map(s => {
          const c = getHeatColor(s)
          return <div key={s} className={`w-4 h-4 rounded-md border ${c.bg} ${c.border}`} />
        })}
        <span className="text-xs text-pink-300">More</span>
      </div>
    </div>
  )
}