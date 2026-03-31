// Date helpers
export const toDateKey = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export const todayKey = () => {
  const now = new Date()
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate())
}

export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate()

export const getFirstDayOfMonth = (year, month) =>
  new Date(year, month, 1).getDay()

export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// Productivity score from checklist answers
export const calcProductivityScore = (checkin) => {
  if (!checkin) return 0
  let score = 0
  if (checkin.dsa === 'yes') score += 2
  const studyMap = { low: 1, medium: 2, high: 3 }
  score += studyMap[checkin.study] || 0
  if (checkin.healthy === 'yes') score += 1
  if (checkin.exercise === 'yes') score += 1
  score += Number(checkin.productive || 0)
  // max = 2+3+1+1+5 = 12  → normalize to 0-5
  return Math.round((score / 12) * 5)
}

// Heat class (0-5)
export const getHeatClass = (score) => `heat-${Math.min(5, Math.max(0, score))}`

// Streak calculation
export const calcCurrentStreak = (data) => {
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = toDateKey(d.getFullYear(), d.getMonth(), d.getDate())
    const entry = data[key]
    if (entry && entry.checkin && entry.checkin.productive > 0) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export const calcLongestStreak = (data) => {
  const keys = Object.keys(data).sort()
  let longest = 0, current = 0, prev = null
  for (const key of keys) {
    const entry = data[key]
    if (entry && entry.checkin && entry.checkin.productive > 0) {
      if (prev) {
        const prevDate = new Date(prev)
        const curDate = new Date(key)
        const diff = (curDate - prevDate) / 86400000
        if (diff === 1) { current++ }
        else { current = 1 }
      } else { current = 1 }
      longest = Math.max(longest, current)
      prev = key
    } else { prev = null; current = 0 }
  }
  return longest
}

export const calcMonthlyScore = (data, year, month) => {
  const days = getDaysInMonth(year, month)
  let total = 0, count = 0
  for (let d = 1; d <= days; d++) {
    const key = toDateKey(year, month, d)
    if (data[key]?.checkin) {
      total += calcProductivityScore(data[key].checkin)
      count++
    }
  }
  return count ? Math.round(total / count) : 0
}
