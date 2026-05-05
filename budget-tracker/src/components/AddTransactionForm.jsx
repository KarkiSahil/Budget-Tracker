import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import styles from './AddTransactionForm.module.css'

export default function AddTransactionForm({ categories, onAdd, currency }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    description: '',
    amount: '',
    categoryId: categories[0]?.id || '',
    date: today,
    note: '',
  })
  const [error, setError] = useState('')

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setError('')
  }

  function submit(e) {
    e.preventDefault()
    const amt = parseFloat(form.amount)
    if (!form.description.trim()) return setError('Description is required')
    if (!amt || amt <= 0) return setError('Enter a valid amount')
    if (!form.categoryId) return setError('Select a category')
    onAdd({ ...form, amount: amt })
    setForm({ description: '', amount: '', categoryId: form.categoryId, date: today, note: '' })
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <input
          className={styles.input}
          placeholder="Description"
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
        <input
          className={`${styles.input} ${styles.amtInput}`}
          type="number"
          placeholder="0.00"
          value={form.amount}
          onChange={e => set('amount', e.target.value)}
          min="0"
          step="0.01"
        />
      </div>
      <div className={styles.row}>
        <select
          className={styles.select}
          value={form.categoryId}
          onChange={e => set('categoryId', e.target.value)}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          className={`${styles.input} ${styles.dateInput}`}
          type="date"
          value={form.date}
          onChange={e => set('date', e.target.value)}
        />
        <button className={styles.addBtn} type="submit">
          <Plus size={15} strokeWidth={2.5} />
          Add
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  )
}
