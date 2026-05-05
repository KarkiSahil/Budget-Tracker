import React, { useState } from 'react'
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react'
import { useBudgetCtx } from '../App'
import { formatCurrency, getCurrentMonthKey } from '../utils/format'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import styles from './Categories.module.css'

const PRESET_COLORS = [
  '#7b6cf5','#4ec994','#d4a96a','#e05c5c','#5bc4d9',
  '#d46ab3','#888580','#f5a623','#50b8e7','#a8d86e',
]

function CategoryRow({ cat, spent, currency, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(cat.name)
  const [budget, setBudget] = useState(cat.budget)
  const [color, setColor] = useState(cat.color)

  function save() {
    onUpdate(cat.id, { name: name.trim() || cat.name, budget: parseFloat(budget) || cat.budget, color })
    setEditing(false)
  }

  const pct = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0
  const over = spent > cat.budget

  if (editing) {
    return (
      <div className={`${styles.row} ${styles.editRow}`}>
        <div className={styles.colorPicker}>
          <div className={styles.colorSwatch} style={{ background: color }} />
          <div className={styles.colorOptions}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                className={`${styles.colorOpt} ${c === color ? styles.colorOptActive : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className={styles.colorInput}
              title="Custom color"
            />
          </div>
        </div>
        <input
          className={styles.editInput}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category name"
        />
        <input
          className={`${styles.editInput} ${styles.editBudget}`}
          type="number"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          min="0"
          step="10"
          placeholder="Budget"
        />
        <div className={styles.editActions}>
          <button className={styles.iconBtn} onClick={save}><Check size={14} color="var(--accent)" /></button>
          <button className={styles.iconBtn} onClick={() => setEditing(false)}><X size={14} color="var(--text3)" /></button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.row}>
      <div className={styles.dot} style={{ background: cat.color }} />
      <div className={styles.info}>
        <span className={styles.name}>{cat.name}</span>
        <div className={styles.barWrap}>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{
                width: `${pct}%`,
                background: over ? 'var(--danger)' : cat.color,
              }}
            />
          </div>
          <span className={styles.pct} style={{ color: over ? 'var(--danger)' : 'var(--text3)' }}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div className={styles.amounts}>
        <span className={styles.spent} style={{ color: over ? 'var(--danger)' : 'var(--text2)' }}>
          {formatCurrency(spent, currency)}
        </span>
        <span className={styles.sep}>/</span>
        <span className={styles.budget}>{formatCurrency(cat.budget, currency)}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => setEditing(true)}><Pencil size={13} /></button>
        <button className={`${styles.iconBtn} ${styles.del}`} onClick={() => onDelete(cat.id)}><Trash2 size={13} /></button>
      </div>
    </div>
  )
}

export default function Categories() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getSpentByCategory,
    settings,
  } = useBudgetCtx()

  const currency = settings.currency || 'USD'
  const spent = getSpentByCategory(getCurrentMonthKey())

  const [newName, setNewName] = useState('')
  const [newBudget, setNewBudget] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [addErr, setAddErr] = useState('')

  function addCat() {
    if (!newName.trim()) return setAddErr('Name is required')
    const b = parseFloat(newBudget)
    if (!b || b <= 0) return setAddErr('Enter a valid budget')
    addCategory({ name: newName.trim(), budget: b, color: newColor })
    setNewName('')
    setNewBudget('')
    setNewColor(PRESET_COLORS[0])
    setAddErr('')
  }

  const totalBudget = categories.reduce((a, c) => a + c.budget, 0)

  return (
    <div className="animate-in">
      <PageHeader
        title="Categories"
        sub={`${categories.length} categories · ${formatCurrency(totalBudget, currency)} total monthly budget`}
      />

      <Card title="Add category" className={styles.addCard}>
        <div className={styles.addRow}>
          <div className={styles.addColorWrap}>
            <div className={styles.colorSwatch} style={{ background: newColor }} />
            <div className={styles.colorOptions}>
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  className={`${styles.colorOpt} ${c === newColor ? styles.colorOptActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setNewColor(c)}
                />
              ))}
              <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className={styles.colorInput} />
            </div>
          </div>
          <input
            className={styles.addInput}
            placeholder="Category name"
            value={newName}
            onChange={e => { setNewName(e.target.value); setAddErr('') }}
          />
          <input
            className={`${styles.addInput} ${styles.addBudget}`}
            type="number"
            placeholder="Monthly budget"
            value={newBudget}
            onChange={e => { setNewBudget(e.target.value); setAddErr('') }}
            min="0"
            step="10"
          />
          <button className={styles.addBtn} onClick={addCat}>
            <Plus size={15} strokeWidth={2.5} /> Add
          </button>
        </div>
        {addErr && <p className={styles.error}>{addErr}</p>}
      </Card>

      <div className={styles.list}>
        {categories.map(cat => (
          <CategoryRow
            key={cat.id}
            cat={cat}
            spent={spent[cat.id] || 0}
            currency={currency}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        ))}
      </div>
    </div>
  )
}
