import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Wallet, TrendingDown, TrendingUp } from 'lucide-react'
import { useBudgetCtx } from '../App'
import { getCurrentMonthKey, getMonthLabel, formatCurrency } from '../utils/format'
import StatCard from '../components/StatCard'
import BudgetBar from '../components/BudgetBar'
import AddTransactionForm from '../components/AddTransactionForm'
import TransactionRow from '../components/TransactionRow'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const {
    categories,
    transactions,
    settings,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getSpentByCategory,
    getTotals,
    getCategoryById,
  } = useBudgetCtx()

  const monthKey = getCurrentMonthKey()
  const spent = useMemo(() => getSpentByCategory(monthKey), [getSpentByCategory, monthKey])
  const { totalBudget, totalSpent, remaining } = useMemo(() => getTotals(monthKey), [getTotals, monthKey])

  const recentTx = useMemo(() =>
    [...transactions]
      .filter(t => t.date.startsWith(monthKey))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6),
    [transactions, monthKey]
  )

  const currency = settings.currency || 'USD'
  const pctUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  return (
    <div className="animate-in">
      <PageHeader
        title={getMonthLabel(monthKey)}
        sub="Your spending overview for this month"
      />

      <div className={styles.statGrid}>
        <StatCard
          label="Total Budget"
          value={formatCurrency(totalBudget, currency)}
          icon={Wallet}
          color="var(--text)"
        />
        <StatCard
          label="Spent"
          value={formatCurrency(totalSpent, currency)}
          sub={`${pctUsed}% of budget used`}
          icon={TrendingDown}
          color={pctUsed > 100 ? 'var(--danger)' : pctUsed > 80 ? 'var(--warn)' : 'var(--text)'}
        />
        <StatCard
          label="Remaining"
          value={formatCurrency(remaining, currency)}
          icon={TrendingUp}
          color={remaining < 0 ? 'var(--danger)' : 'var(--accent)'}
        />
      </div>

      <div className={styles.grid}>
        <div className={styles.left}>
          <Card title="Add transaction">
            <AddTransactionForm
              categories={categories}
              onAdd={addTransaction}
              currency={currency}
            />
          </Card>

          <Card title="Recent transactions" className={styles.txCard}>
            {recentTx.length === 0 ? (
              <p className={styles.empty}>No transactions this month yet.</p>
            ) : (
              <div className={styles.txList}>
                {recentTx.map(tx => (
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
            )}
            <Link to="/transactions" className={styles.viewAll}>
              View all transactions <ArrowRight size={13} />
            </Link>
          </Card>
        </div>

        <div className={styles.right}>
          <Card title="Budget by category">
            <div className={styles.bars}>
              {categories.map(cat => (
                <BudgetBar
                  key={cat.id}
                  category={cat}
                  spent={spent[cat.id] || 0}
                  currency={currency}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
