import React, { useState } from 'react'
import { DataProvider } from './context/DataContext'
import FloatingBackground from './components/Background/FloatingBackground'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import AnalyticsPage from './pages/AnalyticsPage'

export default function App() {
  const [page, setPage] = useState('calendar')

  return (
    <DataProvider>
      <div className="min-h-screen flex relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <FloatingBackground />
        <div className="flex w-full min-h-screen relative z-10">
          <Sidebar page={page} setPage={setPage} />
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {page === 'calendar' && <Dashboard />}
            {page === 'analytics' && <AnalyticsPage />}
          </main>
        </div>
      </div>
    </DataProvider>
  )
}