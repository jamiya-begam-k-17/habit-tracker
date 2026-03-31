import { useApp } from '../context/AppContext'
import {
  getDaysInMonth, getFirstDayOfMonth, toDateKey, todayKey,
  MONTH_NAMES, DAY_LABELS, calcProductivityScore, getHeatClass
} from '../utils/dateUtils'

export default function Calendar({ onDayClick }) {
  const {
    data, currentYear, setCurrentYear, currentMonth, setCurrentMonth
  } = useApp()

  const today = todayKey()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const yearOptions = []
  for (let y = 2020; y <= new Date().getFullYear() + 2; y++) yearOptions.push(y)

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="card fade-in">
      {/* Header */}
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
        <div className="calendar-title">
          <span>{MONTH_NAMES[currentMonth]}</span>
          <select
            className="year-select"
            value={currentYear}
            onChange={e => setCurrentYear(Number(e.target.value))}
          >
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
      </div>

      {/* Day labels */}
      <div className="calendar-grid">
        {DAY_LABELS.map(d => (
          <div key={d} className="calendar-day-label">{d}</div>
        ))}

        {/* Empty cells */}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="calendar-day empty" />
          const key = toDateKey(currentYear, currentMonth, day)
          const entry = data[key]
          const score = entry?.checkin ? calcProductivityScore(entry.checkin) : 0
          const hasTasks = entry?.tasks?.length > 0
          const hasExpense = entry?.expenses?.length > 0
          const isToday = key === today
          const isFuture = key > today
          const heatClass = score > 0 ? getHeatClass(score) : 'heat-0'

          return (
            <div
              key={key}
              className={`calendar-day ${heatClass} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}
              onClick={() => onDayClick(key)}
              title={`${MONTH_NAMES[currentMonth]} ${day}, ${currentYear}${score > 0 ? ` — Score: ${score}/5` : ''}`}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: isToday ? 700 : 500 }}>{day}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {hasTasks && <div className="day-dot" style={{ background: '#3a8a3a' }} />}
                {hasExpense && <div className="day-dot" style={{ background: '#c07000' }} />}
                {score > 0 && <div className="day-dot" />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>Productivity:</span>
        {[0,1,2,3,4,5].map(n => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div className={`heat-${n}`} style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid var(--pink-100)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>{n === 0 ? 'None' : n}</span>
          </div>
        ))}
        <span style={{ fontSize: '0.72rem', color: 'var(--text-soft)', marginLeft: 8 }}>
          🟢 Tasks &nbsp; 🟡 Expense
        </span>
      </div>
    </div>
  )
}
