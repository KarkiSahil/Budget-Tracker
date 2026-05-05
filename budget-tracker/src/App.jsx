import React, { createContext, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useBudget } from './hooks/useBudget'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import Categories from './pages/Categories'
import Settings from './pages/Settings'

export const BudgetContext = createContext(null)
export const useBudgetCtx = () => useContext(BudgetContext)

export default function App() {
  const budget = useBudget()

  return (
    <BudgetContext.Provider value={budget}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BudgetContext.Provider>
  )
}
