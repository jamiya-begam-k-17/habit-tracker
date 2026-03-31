import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const DataContext = createContext(null)

const STORAGE_KEY = 'blossom_habit_data'

const defaultDayData = () => ({
    checkin: {
        dsa: null,       // 'yes' | 'no'
        study: null,     // 'low' | 'medium' | 'high'
        healthy: null,   // 'yes' | 'no'
        exercise: null,  // 'yes' | 'no'
        productive: null, // 1-5
        notes: '',
        whatDidYouDo: '',
    },
    tasks: [],        // [{ id, text, done, createdAt }]
    expenses: [],     // [{ id, amount, category, note, createdAt }]
})

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function DataProvider({ children }) {
    const [allData, setAllData] = useState(loadData)

    // Persist on every change
    useEffect(() => {
        saveData(allData)
    }, [allData])

    const getDayData = useCallback((dateKey) => {
        return allData[dateKey] || defaultDayData()
    }, [allData])

    const updateDayData = useCallback((dateKey, updater) => {
        setAllData(prev => {
            const existing = prev[dateKey] || defaultDayData()
            const updated = typeof updater === 'function' ? updater(existing) : { ...existing, ...updater }
            return { ...prev, [dateKey]: updated }
        })
    }, [])

    // Checkin
    const saveCheckin = useCallback((dateKey, checkinData) => {
        updateDayData(dateKey, d => ({ ...d, checkin: { ...d.checkin, ...checkinData } }))
    }, [updateDayData])

    // Tasks
    const addTask = useCallback((dateKey, text) => {
        const task = { id: Date.now().toString(), text, done: false, createdAt: Date.now() }
        updateDayData(dateKey, d => ({ ...d, tasks: [...d.tasks, task] }))
    }, [updateDayData])

    const toggleTask = useCallback((dateKey, taskId) => {
        updateDayData(dateKey, d => ({
            ...d,
            tasks: d.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        }))
    }, [updateDayData])

    const deleteTask = useCallback((dateKey, taskId) => {
        updateDayData(dateKey, d => ({ ...d, tasks: d.tasks.filter(t => t.id !== taskId) }))
    }, [updateDayData])

    const editTask = useCallback((dateKey, taskId, text) => {
        updateDayData(dateKey, d => ({
            ...d,
            tasks: d.tasks.map(t => t.id === taskId ? { ...t, text } : t)
        }))
    }, [updateDayData])

    // Expenses
    const addExpense = useCallback((dateKey, expense) => {
        const item = { id: Date.now().toString(), ...expense, createdAt: Date.now() }
        updateDayData(dateKey, d => ({ ...d, expenses: [...d.expenses, item] }))
    }, [updateDayData])

    const deleteExpense = useCallback((dateKey, expId) => {
        updateDayData(dateKey, d => ({ ...d, expenses: d.expenses.filter(e => e.id !== expId) }))
    }, [updateDayData])

    // Productivity score 0-100
    const getProductivityScore = useCallback((dateKey) => {
        const d = allData[dateKey]
        if (!d) return 0
        const c = d.checkin
        let score = 0
        if (c.dsa === 'yes') score += 20
        if (c.study === 'high') score += 25
        else if (c.study === 'medium') score += 15
        else if (c.study === 'low') score += 5
        if (c.healthy === 'yes') score += 20
        if (c.exercise === 'yes') score += 15
        if (c.productive) score += (c.productive / 5) * 20
        return Math.round(score)
    }, [allData])

    // Streak calculation
    const getStreak = useCallback(() => {
        const today = new Date()
        let streak = 0
        let date = new Date(today)
        while (true) {
            const key = formatDateKey(date)
            const score = getProductivityScore(key)
            if (score > 0) {
                streak++
                date.setDate(date.getDate() - 1)
            } else {
                break
            }
        }
        return streak
    }, [getProductivityScore])

    // Best streak
    const getBestStreak = useCallback(() => {
        const keys = Object.keys(allData).sort()
        let best = 0, current = 0, prevDate = null
        for (const key of keys) {
            const score = getProductivityScore(key)
            if (score > 0) {
                const d = new Date(key)
                if (prevDate) {
                    const diff = (d - prevDate) / 86400000
                    if (diff === 1) { current++; best = Math.max(best, current) }
                    else { current = 1 }
                } else { current = 1; best = 1 }
                prevDate = d
            } else {
                current = 0; prevDate = null
            }
        }
        return best
    }, [allData, getProductivityScore])

    // Monthly expenses summary
    const getMonthlyExpenses = useCallback((year, month) => {
        let total = 0
        const byCategory = {}
        const days = []
        for (let d = 1; d <= 31; d++) {
            const dateObj = new Date(year, month, d)
            if (dateObj.getMonth() !== month) break
            const key = formatDateKey(dateObj)
            const dayData = allData[key]
            if (dayData?.expenses?.length) {
                const dayTotal = dayData.expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)
                total += dayTotal
                days.push({ date: key, total: dayTotal, expenses: dayData.expenses })
                dayData.expenses.forEach(e => {
                    byCategory[e.category] = (byCategory[e.category] || 0) + parseFloat(e.amount || 0)
                })
            }
        }
        return { total, byCategory, days }
    }, [allData])

    // Monthly analytics
    const getMonthlyAnalytics = useCallback((year, month) => {
        const scores = []
        for (let d = 1; d <= 31; d++) {
            const dateObj = new Date(year, month, d)
            if (dateObj.getMonth() !== month) break
            const key = formatDateKey(dateObj)
            scores.push({ date: key, day: d, score: getProductivityScore(key) })
        }
        const active = scores.filter(s => s.score > 0)
        const avgScore = active.length ? Math.round(active.reduce((s, d) => s + d.score, 0) / active.length) : 0
        const bestDay = scores.reduce((a, b) => b.score > a.score ? b : a, scores[0])
        return { scores, avgScore, activeDays: active.length, bestDay }
    }, [getProductivityScore])

    return (
        <DataContext.Provider value={{
            allData, getDayData, updateDayData,
            saveCheckin,
            addTask, toggleTask, deleteTask, editTask,
            addExpense, deleteExpense,
            getProductivityScore, getStreak, getBestStreak,
            getMonthlyExpenses, getMonthlyAnalytics,
        }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const ctx = useContext(DataContext)
    if (!ctx) throw new Error('useData must be inside DataProvider')
    return ctx
}

export function formatDateKey(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}