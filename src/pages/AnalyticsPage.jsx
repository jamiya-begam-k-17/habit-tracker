import React from 'react'
import Analytics from '../components/Analytics/Analytics'

export default function AnalyticsPage() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-5">
        <div className="mb-5">
          <h1 className="font-display text-2xl font-bold text-rose-800">Analytics 📊</h1>
          <p className="text-sm text-pink-400 mt-0.5">Track your growth and patterns over time</p>
        </div>
        <Analytics />
      </div>
    </div>
  )
}