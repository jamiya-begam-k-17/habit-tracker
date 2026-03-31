import React, { useState, useEffect } from 'react'
import { X, Star } from 'lucide-react'
import { useData } from '../../context/DataContext'
import TaskManager from '../Tasks/TaskManager'
import FinanceTracker from '../Finance/FinanceTracker'

const TABS = ['Check-in', 'Tasks', 'Finance']

function parseDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function ScoreBar({ score }) {
  const color = score < 30 ? '#fbb6ce' : score < 60 ? '#f472b6' : score < 80 ? '#ec4899' : '#be185d'
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-pink-400 mb-1">
        <span>Productivity Score</span>
        <span className="font-mono font-semibold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, #fbb6ce, ${color})` }}
        />
      </div>
    </div>
  )
}

function CheckinTab({ dateKey }) {
  const { getDayData, saveCheckin, getProductivityScore } = useData()
  const data = getDayData(dateKey)
  const c = data.checkin
  const score = getProductivityScore(dateKey)

  function update(field, val) {
    saveCheckin(dateKey, { [field]: val })
  }

  const YesNo = ({ field }) => (
    <div className="flex gap-2">
      {['yes', 'no'].map(v => (
        <button key={v} onClick={() => update(field, v)}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize
            ${c[field] === v
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm'
              : 'bg-pink-50 text-pink-400 hover:bg-pink-100'}`}>
          {v}
        </button>
      ))}
    </div>
  )

  const LevelPicker = ({ field, options }) => (
    <div className="flex gap-2">
      {options.map(v => (
        <button key={v} onClick={() => update(field, v)}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize
            ${c[field] === v
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm'
              : 'bg-pink-50 text-pink-400 hover:bg-pink-100'}`}>
          {v}
        </button>
      ))}
    </div>
  )

  const StarRating = () => (
    <div className="flex gap-2 justify-center">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => update('productive', n)}
          className={`transition-transform hover:scale-110 ${c.productive >= n ? 'text-pink-500' : 'text-pink-200'}`}>
          <Star size={24} fill={c.productive >= n ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <ScoreBar score={score} />

      <div>
        <label className="text-xs font-medium text-pink-600 uppercase tracking-wide block mb-2">What did you do today?</label>
        <textarea
          className="bg-pink-50 border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 resize-none h-16 w-full"
          placeholder="A short summary of your day..."
          value={c.whatDidYouDo}
          onChange={e => update('whatDidYouDo', e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        <div>
          <label className="text-xs font-medium text-pink-600 uppercase tracking-wide block mb-2">DSA Problems?</label>
          <YesNo field="dsa" />
        </div>
        <div>
          <label className="text-xs font-medium text-pink-600 uppercase tracking-wide block mb-2">Study Intensity</label>
          <LevelPicker field="study" options={['low', 'medium', 'high']} />
        </div>
        <div>
          <label className="text-xs font-medium text-pink-600 uppercase tracking-wide block mb-2">Ate Healthy?</label>
          <YesNo field="healthy" />
        </div>
        <div>
          <label className="text-xs font-medium text-pink-600 uppercase tracking-wide block mb-2">Exercised?</label>
          <YesNo field="exercise" />
        </div>
        <div>
          <label className="text-xs font-medium text-pink-600 uppercase tracking-wide block mb-2">Productivity Rating</label>
          <StarRating />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-pink-600 uppercase tracking-wide block mb-2">Diary Notes</label>
        <textarea
          className="bg-pink-50 border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 resize-none h-24 w-full"
          placeholder="How are you feeling? What's on your mind..."
          value={c.notes}
          onChange={e => update('notes', e.target.value)}
        />
      </div>
    </div>
  )
}

export default function DayModal({ dateKey, onClose }) {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-overlay"
      style={{ background: 'rgba(90,20,40,0.25)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content w-full sm:max-w-lg bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-pink-100 flex flex-col"
        style={{ maxHeight: '92vh' }}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-pink-100">
          <div>
            <h2 className="font-display text-xl font-semibold text-rose-800">{parseDate(dateKey)}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-pink-50 text-pink-300 hover:text-pink-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all
                ${tab === i ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm' : 'text-pink-400 hover:bg-pink-50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 pt-4">
          {tab === 0 && <CheckinTab dateKey={dateKey} />}
          {tab === 1 && <TaskManager dateKey={dateKey} />}
          {tab === 2 && <FinanceTracker dateKey={dateKey} />}
        </div>
      </div>
    </div>
  )
}