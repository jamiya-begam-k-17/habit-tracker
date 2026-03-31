import React, { useState } from 'react'
import CalendarView from '../components/Calendar/CalendarView'
import DayModal from '../components/Modal/DayModal'
import { useData, formatDateKey } from '../context/DataContext'
import { Flame, TrendingUp, CheckCircle, Target } from 'lucide-react'

function QuickStat({ icon: Icon, label, value, color }) {
    return (
        <div className="glass-card p-3 flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={16} />
            </div>
            <div>
                <div className="text-base font-display font-semibold text-rose-800">{value}</div>
                <div className="text-xs text-pink-400 leading-none">{label}</div>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const { getStreak, getBestStreak, getProductivityScore, getMonthlyAnalytics, getDayData } = useData()
    const [selectedDate, setSelectedDate] = useState(null)

    const today = new Date()
    const todayKey = formatDateKey(today)
    const streak = getStreak()
    const bestStreak = getBestStreak()
    const todayScore = getProductivityScore(todayKey)
    const monthAnalytics = getMonthlyAnalytics(today.getFullYear(), today.getMonth())

    // Today's tasks
    const todayData = getDayData(todayKey)
    const todayTasks = todayData.tasks
    const doneTasks = todayTasks.filter(t => t.done).length

    return (
        <div className="flex-1 min-h-0 overflow-hidden">
            <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-rose-800">
                            {getGreeting()}, friend 🌸
                        </h1>
                        <p className="text-sm text-pink-400 mt-0.5">
                            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={() => setSelectedDate(todayKey)}
                        className="btn-primary flex items-center gap-2 text-sm"
                    >
                        <Target size={14} />
                        Today's Check-in
                    </button>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <QuickStat icon={Flame} label="Streak" value={`${streak}d`} color="bg-orange-100 text-orange-500" />
                    <QuickStat icon={TrendingUp} label="Today" value={`${todayScore}%`} color="bg-pink-100 text-pink-500" />
                    <QuickStat icon={CheckCircle} label="Tasks" value={`${doneTasks}/${todayTasks.length}`} color="bg-green-100 text-green-500" />
                    <QuickStat icon={Target} label="Month Avg" value={`${monthAnalytics.avgScore}%`} color="bg-purple-100 text-purple-500" />
                </div>

                {/* Calendar */}
                <CalendarView onDayClick={setSelectedDate} selectedDate={selectedDate} />

                {/* Today's summary if data exists */}
                {todayScore > 0 && (
                    <div className="glass-card p-4 animate-slide-up">
                        <h3 className="font-display font-semibold text-rose-800 mb-3">Today at a Glance</h3>
                        <div className="space-y-2">
                            {todayData.checkin.whatDidYouDo && (
                                <p className="text-sm text-rose-700 italic">"{todayData.checkin.whatDidYouDo}"</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {todayData.checkin.dsa === 'yes' && <Chip label="DSA ✓" color="bg-blue-100 text-blue-600" />}
                                {todayData.checkin.exercise === 'yes' && <Chip label="Exercise ✓" color="bg-green-100 text-green-600" />}
                                {todayData.checkin.healthy === 'yes' && <Chip label="Healthy ✓" color="bg-yellow-100 text-yellow-600" />}
                                {todayData.checkin.study && <Chip label={`Study: ${todayData.checkin.study}`} color="bg-purple-100 text-purple-600" />}
                                {todayData.checkin.productive && (
                                    <Chip label={`Productivity: ${'⭐'.repeat(todayData.checkin.productive)}`} color="bg-pink-100 text-pink-600" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Day Modal */}
            {selectedDate && (
                <DayModal dateKey={selectedDate} onClose={() => setSelectedDate(null)} />
            )}
        </div>
    )
}

function Chip({ label, color }) {
    return <span className={`tag ${color} px-3 py-1`}>{label}</span>
}

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
}