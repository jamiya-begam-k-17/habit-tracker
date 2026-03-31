import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useData, formatDateKey } from '../../context/DataContext'
import { TrendingUp, Award, Flame, Calendar } from 'lucide-react'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xl font-display font-semibold text-rose-800">{value}</div>
        <div className="text-xs text-pink-400">{label}</div>
        {sub && <div className="text-xs text-pink-300">{sub}</div>}
      </div>
    </div>
  )
}

export default function Analytics() {
  const { getMonthlyAnalytics, getMonthlyExpenses, getStreak, getBestStreak, allData } = useData()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const analytics = getMonthlyAnalytics(year, month)
  const expenses = getMonthlyExpenses(year, month)
  const currentStreak = getStreak()
  const bestStreak = getBestStreak()

  // Yearly score data
  const yearlyData = MONTHS.map((m, i) => {
    const a = getMonthlyAnalytics(year, i)
    return { month: m, avgScore: a.avgScore, activeDays: a.activeDays }
  })

  // Expense category chart
  const catData = Object.entries(expenses.byCategory).map(([name, value]) => ({ name, value: Math.round(value) }))
  const PIE_COLORS = ['#f472b6','#fb7185','#fbbf24','#34d399','#60a5fa','#a78bfa','#fb923c']

  // Daily scores for month
  const dailyData = analytics.scores.map(s => ({ day: s.day, score: s.score }))

  return (
    <div className="space-y-5">
      {/* Month/Year selector */}
      <div className="glass-card p-4 flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-pink-200/50 rounded-2xl shadow-lg">
        <div className="flex-1">
          <label className="text-xs font-medium text-pink-400 uppercase tracking-wide mb-1 block">Month</label>
          <select className="w-full p-2 rounded-xl border border-pink-200 bg-pink-50 text-rose-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all" value={month} onChange={e => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </div>
        <div className="w-24">
          <label className="text-xs font-medium text-pink-400 uppercase tracking-wide mb-1 block">Year</label>
          <select className="w-full p-2 rounded-xl border border-pink-200 bg-pink-50 text-rose-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all" value={year} onChange={e => setYear(Number(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 4 + i).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Flame} label="Current Streak" value={`${currentStreak}d`} color="bg-orange-100 text-orange-500" />
        <StatCard icon={Award} label="Best Streak" value={`${bestStreak}d`} color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={TrendingUp} label="Avg Score" value={`${analytics.avgScore}%`} sub={`${analytics.activeDays} active days`} color="bg-pink-100 text-pink-500" />
        <StatCard icon={Calendar} label="Monthly Spend" value={`₹${Math.round(expenses.total)}`} sub={`${Object.keys(expenses.byCategory).length} categories`} color="bg-purple-100 text-purple-500" />
      </div>

      {/* Daily score chart */}
      <div className="glass-card p-4">
        <h3 className="font-display font-semibold text-rose-800 mb-3">Daily Productivity — {MONTHS[month]}</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={dailyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#fbb6ce' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: '#fbb6ce' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: '#fff5f8', border: '1px solid #fbb6ce', borderRadius: '12px', fontSize: 12 }}
              formatter={v => [`${v}%`, 'Score']}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {dailyData.map((d, i) => (
                <Cell key={i} fill={d.score > 75 ? '#f43f5e' : d.score > 50 ? '#f472b6' : d.score > 25 ? '#fbb6ce' : '#fce7f3'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly overview */}
      <div className="glass-card p-4">
        <h3 className="font-display font-semibold text-rose-800 mb-3">Yearly Overview — {year}</h3>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={yearlyData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#fbb6ce' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#fbb6ce' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#fff5f8', border: '1px solid #fbb6ce', borderRadius: '12px', fontSize: 12 }} />
            <Line type="monotone" dataKey="avgScore" stroke="#f472b6" strokeWidth={2} dot={{ fill: '#f472b6', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expense pie */}
      {catData.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-display font-semibold text-rose-800 mb-3">Spending by Category</h3>
          <div className="flex items-center gap-4">
            <PieChart width={120} height={120}>
              <Pie data={catData} cx={55} cy={55} innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={2}>
                {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
            </PieChart>
            <div className="flex-1 space-y-1.5">
              {catData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-rose-700">{d.name}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-rose-800">₹{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}