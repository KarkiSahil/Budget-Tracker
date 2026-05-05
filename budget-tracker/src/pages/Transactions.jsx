import React, { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { useBudgetCtx } from '../App'
import { formatCurrency, formatDate } from '../utils/format'
import TransactionRow from '../components/TransactionRow'
import AddTransactionForm from '../components/AddTransactionForm'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import styles from './Transactions.module.css'

export default function Transactions() {
  const {
    categories,
    transactions,
    settings,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getCategoryById,
  } = useBudgetCtx()

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')

  const currency = settings.currency || 'USD'

  const filtered = useMemo(() => {
    let list = [...transactions]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.description.toLowerCase().includes(q) ||
        (getCategoryById(t.categoryId)?.name || '').toLowerCase().includes(q)
      )
    }
    if (filterCat !== 'all') {
      list = list.filter(t => t.categoryId === filterCat)
    }
    list.sort((a, b) => {
      if (sortBy === 'date-desc') return b.date.localeCompare(a.date)
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date)
      if (sortBy === 'amount-desc') return b.amount - a.amount
      if (sortBy === 'amount-asc') return a.amount - b.amount
      return 0
    })
    return list
  }, [transactions, search, filterCat, sortBy, getCategoryById])

  const totalFiltered = filtered.reduce((s, t) => s + t.amount, 0)

  // Group by month
  const grouped = useMemo(() => {
    const groups = {}
    for (const tx of filtered) {
      const key = tx.date.slice(0, 7)
      if (!groups[key]) groups[key] = []
      groups[key].push(tx)
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  return (
    <div className="animate-in">
      <PageHeader
        title="Transactions"
        sub={`${filtered.length} transactions · ${formatCurrency(totalFiltered, currency)} total`}
      />

      <Card title="Add transaction" className={styles.addCard}>
        <AddTransactionForm categories={categories} onAdd={addTransaction} currency={currency} />
      </Card>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search transactions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>No transactions found.</div>
      ) : (
        grouped.map(([monthKey, txs]) => {
          const monthTotal = txs.reduce((s, t) => s + t.amount, 0)
          const [yr, mo] = monthKey.split('-')
          const label = new Date(Number(yr), Number(mo) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
          return (
            <div key={monthKey} className={styles.group}>
              <div className={styles.groupHeader}>
                <span>{label}</span>
                <span className={styles.groupTotal}>{formatCurrency(monthTotal, currency)}</span>
              </div>
              <div className={styles.txList}>
                {txs.map(tx => (
                  <TransactionRow
                    key={tx.id}
                    transaction={tx}
                    category={getCategoryById(tx.categoryId)}
                    currency={currency}
                    onDelete={deleteTransaction}
                    onUpdate={updateTransaction}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
