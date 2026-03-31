import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext'

const CATEGORIES = ['Food', 'Transport', 'Study', 'Health', 'Entertainment', 'Shopping', 'Other']

const CAT_COLORS = {
  Food: 'bg-orange-100 text-orange-600',
  Transport: 'bg-blue-100 text-blue-600',
  Study: 'bg-purple-100 text-purple-600',
  Health: 'bg-green-100 text-green-600',
  Entertainment: 'bg-yellow-100 text-yellow-600',
  Shopping: 'bg-pink-100 text-pink-600',
  Other: 'bg-gray-100 text-gray-600',
}

export default function FinanceTracker({ dateKey }) {
  const { getDayData, addExpense, deleteExpense } = useData()
  const expenses = getDayData(dateKey).expenses
  const [form, setForm] = useState({ amount: '', category: 'Food', note: '' })
  const [showForm, setShowForm] = useState(false)

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)

  function handleAdd() {
    if (!form.amount || isNaN(form.amount)) return
    addExpense(dateKey, { amount: parseFloat(form.amount), category: form.category, note: form.note })
    setForm({ amount: '', category: 'Food', note: '' })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Daily total */}
      <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100">
        <div className="text-xs text-pink-400 font-medium uppercase tracking-wide">Daily Total</div>
        <div className="text-2xl font-display font-semibold text-rose-700 mt-1">
          ₹{total.toFixed(2)}
        </div>
        <div className="text-xs text-pink-300 mt-0.5">{expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Add button */}
      <button onClick={() => setShowForm(v => !v)} className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white rounded-lg px-4 py-2 hover:bg-pink-600 transition-colors">
        <Plus size={16} />
        Add Expense
      </button>

      {/* Add form */}
      {showForm && (
        <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 space-y-3 animate-slide-up">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-pink-400 mb-1 block">Amount (₹)</label>
              <input
                type="number"
                className="bg-pink-50 border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 w-full"
                placeholder="0.00"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-pink-400 mb-1 block">Category</label>
              <select className="bg-pink-50 border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 w-full" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-pink-400 mb-1 block">Note (optional)</label>
            <input className="bg-pink-50 border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 w-full" placeholder="What was this for?" value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-pink-500 text-white rounded-lg px-4 py-2 hover:bg-pink-600 transition-colors flex-1">Save</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors flex-1">Cancel</button>
          </div>
        </div>
      )}

      {/* Expense list */}
      <div className="space-y-2">
        {expenses.length === 0 && !showForm && (
          <div className="text-center py-6 text-pink-300 text-sm">
            <div className="text-3xl mb-2">💸</div>
            No expenses tracked yet.
          </div>
        )}
        {expenses.map(exp => (
          <div key={exp.id} className="flex items-center gap-3 p-3 bg-white border border-pink-100 rounded-xl group hover:border-pink-200 transition-all">
            <span className={`tag ${CAT_COLORS[exp.category] || 'bg-gray-100 text-gray-600'}`}>
              {exp.category}
            </span>
            <span className="flex-1 text-sm text-rose-700">{exp.note || '-'}</span>
            <span className="font-mono text-sm font-semibold text-rose-800">₹{parseFloat(exp.amount).toFixed(2)}</span>
            <button onClick={() => deleteExpense(dateKey, exp.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-pink-300 hover:text-red-400 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}