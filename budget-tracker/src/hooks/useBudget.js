import { useState, useEffect, useCallback } from 'react'
import { loadState, saveState } from '../utils/storage'
import { uid, cuid, getCurrentMonthKey, isSameMonth } from '../utils/format'

export function useBudget() {
  const [state, setState] = useState(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const { categories, transactions, settings } = state

  // ── Transactions ─────────────────────────────────────────────────────────

  const addTransaction = useCallback((tx) => {
    setState(s => ({
      ...s,
      transactions: [...s.transactions, { ...tx, id: uid() }],
    }))
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setState(s => ({
      ...s,
      transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t),
    }))
  }, [])

  const deleteTransaction = useCallback((id) => {
    setState(s => ({
      ...s,
      transactions: s.transactions.filter(t => t.id !== id),
    }))
  }, [])

  // ── Categories ────────────────────────────────────────────────────────────

  const addCategory = useCallback((cat) => {
    setState(s => ({
      ...s,
      categories: [...s.categories, { ...cat, id: cuid() }],
    }))
  }, [])

  const updateCategory = useCallback((id, updates) => {
    setState(s => ({
      ...s,
      categories: s.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    }))
  }, [])

  const deleteCategory = useCallback((id) => {
    setState(s => ({
      ...s,
      categories: s.categories.filter(c => c.id !== id),
      transactions: s.transactions.filter(t => t.categoryId !== id),
    }))
  }, [])

  // ── Settings ──────────────────────────────────────────────────────────────

  const updateSettings = useCallback((updates) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...updates } }))
  }, [])

  // ── Computed ──────────────────────────────────────────────────────────────

  const getMonthTransactions = useCallback((monthKey) => {
    return transactions.filter(t => isSameMonth(t.date, monthKey))
  }, [transactions])

  const getSpentByCategory = useCallback((monthKey) => {
    const txs = getMonthTransactions(monthKey)
    const map = {}
    for (const cat of categories) map[cat.id] = 0
    for (const tx of txs) {
      if (map[tx.categoryId] !== undefined) map[tx.categoryId] += tx.amount
      else map[tx.categoryId] = tx.amount
    }
    return map
  }, [categories, getMonthTransactions])

  const getTotals = useCallback((monthKey) => {
    const spent = getSpentByCategory(monthKey)
    const totalBudget = categories.reduce((a, c) => a + c.budget, 0)
    const totalSpent = Object.values(spent).reduce((a, b) => a + b, 0)
    return { totalBudget, totalSpent, remaining: totalBudget - totalSpent }
  }, [categories, getSpentByCategory])

  const getCategoryById = useCallback((id) => {
    return categories.find(c => c.id === id)
  }, [categories])

  return {
    categories,
    transactions,
    settings,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    getMonthTransactions,
    getSpentByCategory,
    getTotals,
    getCategoryById,
  }
}
