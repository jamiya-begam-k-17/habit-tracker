import React, { useState } from 'react'
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react'
import { useData } from '../../context/DataContext'

export default function TaskManager({ dateKey }) {
  const { getDayData, addTask, toggleTask, deleteTask, editTask } = useData()
  const tasks = getDayData(dateKey).tasks
  const [input, setInput] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [showInput, setShowInput] = useState(false)

  function handleAdd() {
    if (!input.trim()) return
    addTask(dateKey, input.trim())
    setInput('')
    setShowInput(false)
  }

  function startEdit(task) {
    setEditId(task.id)
    setEditText(task.text)
  }

  function saveEdit() {
    if (editText.trim()) editTask(dateKey, editId, editText.trim())
    setEditId(null)
  }

  const done = tasks.filter(t => t.done).length
  const total = tasks.length

  return (
    <div className="space-y-4">
      {/* Summary */}
      {total > 0 && (
        <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
          <div className="flex-1">
            <div className="text-xs text-pink-400 mb-1">Task Progress</div>
            <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-500"
                style={{ width: total ? `${(done/total)*100}%` : '0%' }} />
            </div>
          </div>
          <div className="text-sm font-mono font-semibold text-rose-700">{done}/{total}</div>
        </div>
      )}

      {/* Add task */}
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Task
        </button>
      ) : (
        <div className="glass-card p-4 bg-white/60 backdrop-blur-sm border border-pink-200/50 rounded-2xl shadow-lg space-y-3">
          <div>
            <label className="text-xs font-medium text-pink-400 uppercase tracking-wide mb-2 block">New Task</label>
            <input
              className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-pink-50 text-rose-800 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
              placeholder="Enter your task..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Check size={16} />
              Add Task
            </button>
            <button
              onClick={() => { setShowInput(false); setInput('') }}
              className="px-4 py-2 bg-pink-100 text-pink-600 rounded-xl font-medium hover:bg-pink-200 transition-all duration-200 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {tasks.length === 0 && (
          <div className="text-center py-8 text-pink-300 text-sm">
            <div className="text-3xl mb-2">📝</div>
            No tasks yet. Add one above!
          </div>
        )}
        {tasks.map(task => (
          <div key={task.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all group
              ${task.done ? 'bg-pink-50 border-pink-100' : 'bg-white border-pink-100 hover:border-pink-200'}`}>
            <button onClick={() => toggleTask(dateKey, task.id)}
              className={`flex-shrink-0 transition-colors ${task.done ? 'text-pink-400' : 'text-pink-200 hover:text-pink-400'}`}>
              <Check size={18} strokeWidth={task.done ? 3 : 2} />
            </button>
            {editId === task.id ? (
              <input
                className="flex-1 bg-transparent text-sm text-rose-800 outline-none border-b border-pink-300"
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null) }}
                autoFocus
              />
            ) : (
              <span className={`flex-1 text-sm ${task.done ? 'line-through text-pink-300' : 'text-rose-800'}`}>
                {task.text}
              </span>
            )}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {editId === task.id ? (
                <>
                  <button onClick={saveEdit} className="p-1 rounded-lg hover:bg-pink-100 text-pink-400"><Check size={14} /></button>
                  <button onClick={() => setEditId(null)} className="p-1 rounded-lg hover:bg-pink-100 text-pink-400"><X size={14} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(task)} className="p-1 rounded-lg hover:bg-pink-100 text-pink-300 hover:text-pink-500"><Edit3 size={14} /></button>
                  <button onClick={() => deleteTask(dateKey, task.id)} className="p-1 rounded-lg hover:bg-red-50 text-pink-300 hover:text-red-400"><Trash2 size={14} /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}