import React from 'react'
import { formatCurrency } from '../utils/format'
import styles from './BudgetBar.module.css'

export default function BudgetBar({ category, spent, currency = 'USD' }) {
  const pct = Math.min((spent / category.budget) * 100, 100)
  const status = spent > category.budget ? 'over' : spent / category.budget > 0.8 ? 'warn' : 'ok'

  return (
    <div className={styles.row}>
      <div className={styles.header}>
        <div className={styles.nameWrap}>
          <span className={styles.dot} style={{ background: category.color }} />
          <span className={styles.name}>{category.name}</span>
        </div>
        <div className={styles.amounts}>
          <span
            className={styles.spent}
            style={{
              color: status === 'over' ? 'var(--danger)' : status === 'warn' ? 'var(--warn)' : 'var(--text2)'
            }}
          >
            {formatCurrency(spent, currency)}
          </span>
          <span className={styles.sep}>/</span>
          <span className={styles.budget}>{formatCurrency(category.budget, currency)}</span>
        </div>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            width: `${pct}%`,
            background: status === 'over' ? 'var(--danger)' : status === 'warn' ? 'var(--warn)' : category.color,
          }}
        />
      </div>
    </div>
  )
}
