import React, { useState } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { formatCurrency, formatShortDate } from '../utils/format'
import styles from './TransactionRow.module.css'

export default function TransactionRow({
  transaction,
  category,
  currency,
  onDelete,
  onUpdate,
  categories,
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    description: transaction.description,
    amount: transaction.amount,
    categoryId: transaction.categoryId,
    date: transaction.date,
  })

  function save() {
    onUpdate(transaction.id, {
      ...form,
      amount: parseFloat(form.amount) || 0,
    })
    setEditing(false)
  }

  function cancel() {
    setForm({
      description: transaction.description,
      amount: transaction.amount,
      categoryId: transaction.categoryId,
      date: transaction.date,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className={`${styles.row} ${styles.editRow}`}>
        <input
          className={styles.editInput}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Description"
        />
        <input
          className={`${styles.editInput} ${styles.editAmt}`}
          type="number"
          value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          min="0"
          step="0.01"
        />
        <select
          className={styles.editSelect}
          value={form.categoryId}
          onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          className={styles.editInput}
          type="date"
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
        />
        <div className={styles.editActions}>
          <button className={styles.iconBtn} onClick={save} title="Save">
            <Check size={14} color="var(--accent)" />
          </button>
          <button className={styles.iconBtn} onClick={cancel} title="Cancel">
            <X size={14} color="var(--text3)" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.row}>
      <div className={styles.dotWrap}>
        <span className={styles.dot} style={{ background: category?.color || '#888' }} />
      </div>
      <div className={styles.info}>
        <span className={styles.desc}>{transaction.description}</span>
        <span className={styles.meta}>
          {category?.name || 'Unknown'} · {formatShortDate(transaction.date)}
        </span>
      </div>
      <span className={styles.amount}>
        {formatCurrency(transaction.amount, currency)}
      </span>
      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => setEditing(true)} title="Edit">
          <Pencil size={13} />
        </button>
        <button className={`${styles.iconBtn} ${styles.del}`} onClick={() => onDelete(transaction.id)} title="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
