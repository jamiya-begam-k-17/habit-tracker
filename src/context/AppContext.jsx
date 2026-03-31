import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'blossom_habit_data'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })

  const [activePage, setActivePage] = useState('dashboard')
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
    catch (e) { console.error('Storage error', e) }
  }, [data])

  const getDay = useCallback((key) => data[key] || {}, [data])

  const updateDay = useCallback((key, updater) => {
    setData(prev => {
      const existing = prev[key] || {}
      const updated = typeof updater === 'function' ? updater(existing) : { ...existing, ...updater }
      return { ...prev, [key]: updated }
    })
  }, [])

  // Checkin
  const saveCheckin = (key, checkin) => updateDay(key, d => ({ ...d, checkin }))
  const getCheckin = (key) => getDay(key).checkin || null

  // Tasks
  const getTasks = (key) => getDay(key).tasks || []
  const addTask = (key, text) => updateDay(key, d => ({
    ...d, tasks: [...(d.tasks || []), { id: Date.now(), text, done: false }]
  }))
  const toggleTask = (key, id) => updateDay(key, d => ({
    ...d, tasks: (d.tasks || []).map(t => t.id === id ? { ...t, done: !t.done } : t)
  }))
  const deleteTask = (key, id) => updateDay(key, d => ({
    ...d, tasks: (d.tasks || []).filter(t => t.id !== id)
  }))
  const editTask = (key, id, text) => updateDay(key, d => ({
    ...d, tasks: (d.tasks || []).map(t => t.id === id ? { ...t, text } : t)
  }))

  // Finance
  const getExpenses = (key) => getDay(key).expenses || []
  const addExpense = (key, expense) => updateDay(key, d => ({
    ...d, expenses: [...(d.expenses || []), { id: Date.now(), ...expense }]
  }))
  const deleteExpense = (key, id) => updateDay(key, d => ({
    ...d, expenses: (d.expenses || []).filter(e => e.id !== id)
  }))

  return (
    <AppContext.Provider value={{
      data, activePage, setActivePage,
      selectedDate, setSelectedDate,
      currentYear, setCurrentYear,
      currentMonth, setCurrentMonth,
      getDay, updateDay,
      saveCheckin, getCheckin,
      getTasks, addTask, toggleTask, deleteTask, editTask,
      getExpenses, addExpense, deleteExpense,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
