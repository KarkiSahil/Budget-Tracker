import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useBudgetCtx } from '../App'
import { clearState } from '../utils/storage'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import styles from './Settings.module.css'

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'JPY', label: 'Japanese Yen (¥)' },
  { code: 'CAD', label: 'Canadian Dollar (CA$)' },
  { code: 'AUD', label: 'Australian Dollar (A$)' },
  { code: 'CHF', label: 'Swiss Franc (CHF)' },
  { code: 'MXN', label: 'Mexican Peso (MX$)' },
]

export default function Settings() {
  const { settings, updateSettings, transactions, categories } = useBudgetCtx()
  const [confirmReset, setConfirmReset] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    clearState()
    window.location.reload()
  }

  // Export data as JSON
  function exportData() {
    const data = { transactions, categories, settings, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ledger-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import data from JSON
  function importData(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.transactions && data.categories) {
          localStorage.setItem('budget_tracker_v1', JSON.stringify({
            transactions: data.transactions,
            categories: data.categories,
            settings: data.settings || settings,
          }))
          window.location.reload()
        } else {
          alert('Invalid file format.')
        }
      } catch {
        alert('Could not parse the file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="animate-in">
      <PageHeader title="Settings" sub="Manage your preferences and data" />

      <div className={styles.grid}>
        <Card title="Preferences">
          <div className={styles.field}>
            <label className={styles.label}>Your name</label>
            <input
              className={styles.input}
              placeholder="e.g. Alex"
              value={settings.name || ''}
              onChange={e => updateSettings({ name: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Currency</label>
            <select
              className={styles.select}
              value={settings.currency || 'USD'}
              onChange={e => updateSettings({ currency: e.target.value })}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <button className={styles.saveBtn} onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save preferences'}
          </button>
        </Card>

        <Card title="Data management">
          <p className={styles.dataDesc}>
            Your data is stored locally in your browser. Export a backup or import from a previous export.
          </p>
          <div className={styles.dataStats}>
            <div className={styles.dataStat}>
              <span className={styles.dataNum}>{transactions.length}</span>
              <span className={styles.dataLabel}>Transactions</span>
            </div>
            <div className={styles.dataStat}>
              <span className={styles.dataNum}>{categories.length}</span>
              <span className={styles.dataLabel}>Categories</span>
            </div>
          </div>
          <div className={styles.dataActions}>
            <button className={styles.outlineBtn} onClick={exportData}>Export JSON</button>
            <label className={styles.outlineBtn} style={{ cursor: 'pointer' }}>
              Import JSON
              <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
            </label>
          </div>
        </Card>

        <Card title="Danger zone" className={styles.dangerCard}>
          <div className={styles.dangerRow}>
            <div>
              <p className={styles.dangerTitle}>Reset all data</p>
              <p className={styles.dangerDesc}>Permanently delete all transactions, categories, and settings. This cannot be undone.</p>
            </div>
            {!confirmReset ? (
              <button className={styles.dangerBtn} onClick={() => setConfirmReset(true)}>
                Reset
              </button>
            ) : (
              <div className={styles.confirmRow}>
                <span className={styles.confirmText}>
                  <AlertTriangle size={14} /> Are you sure?
                </span>
                <button className={styles.dangerBtnConfirm} onClick={handleReset}>Yes, reset</button>
                <button className={styles.cancelBtn} onClick={() => setConfirmReset(false)}>Cancel</button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
