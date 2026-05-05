import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts'
import { useBudgetCtx } from '../App'
import { getPastMonths, getMonthLabel, formatCurrency, isSameMonth } from '../utils/format'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import styles from './Analytics.module.css'

const TOOLTIP_STYLE = {
  background: '#18181c',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#f0ede6',
  fontFamily: 'DM Mono, monospace',
  fontSize: 12,
}

export default function Analytics() {
  const { categories, transactions, settings, getSpentByCategory } = useBudgetCtx()
  const currency = settings.currency || 'USD'

  const months = useMemo(() => getPastMonths(6), [])

  // Monthly totals line chart
  const monthlyData = useMemo(() =>
    months.map(mk => {
      const spent = getSpentByCategory(mk)
      const total = Object.values(spent).reduce((a, b) => a + b, 0)
      const budget = categories.reduce((a, c) => a + c.budget, 0)
      return {
        name: new Date(mk + '-01').toLocaleString('default', { month: 'short' }),
        Spent: Math.round(total),
        Budget: Math.round(budget),
      }
    }),
    [months, getSpentByCategory, categories]
  )

  // Current month pie
  const currentMonth = months[months.length - 1]
  const currentSpent = useMemo(() => getSpentByCategory(currentMonth), [getSpentByCategory, currentMonth])
  const pieData = useMemo(() =>
    categories
      .map(c => ({ name: c.name, value: Math.round(currentSpent[c.id] || 0), color: c.color }))
      .filter(d => d.value > 0),
    [categories, currentSpent]
  )

  // Category bar chart (budget vs spent current month)
  const catBarData = useMemo(() =>
    categories.map(c => ({
      name: c.name.slice(0, 8),
      Budget: c.budget,
      Spent: Math.round(currentSpent[c.id] || 0),
      color: c.color,
    })),
    [categories, currentSpent]
  )

  // Top spending categories
  const topCats = useMemo(() =>
    [...categories]
      .map(c => ({ ...c, spent: currentSpent[c.id] || 0 }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5),
    [categories, currentSpent]
  )

  const fmt = (v) => formatCurrency(v, currency)

  return (
    <div className="animate-in">
      <PageHeader title="Analytics" sub="Spending trends and insights" />

      <div className={styles.grid}>
        {/* Monthly trend */}
        <Card title="Spending vs budget — last 6 months" className={styles.wide}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#5a5654', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a5654', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '$' + v} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => fmt(v)} />
              <Line type="monotone" dataKey="Budget" stroke="#2a2a2e" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              <Line type="monotone" dataKey="Spent" stroke="#4ec994" strokeWidth={2} dot={{ fill: '#4ec994', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            <span className={styles.legendItem}><span style={{ background: '#4ec994' }} />Spent</span>
            <span className={styles.legendItem}><span style={{ background: '#2a2a2e', border: '1px dashed #4a4847' }} />Budget</span>
          </div>
        </Card>

        {/* Pie */}
        <Card title="This month by category">
          {pieData.length === 0 ? (
            <div className={styles.empty}>No spending data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className={styles.pieLegend}>
            {pieData.map(d => (
              <div key={d.name} className={styles.pieLegendItem}>
                <span className={styles.pieDot} style={{ background: d.color }} />
                <span>{d.name}</span>
                <span className={styles.pieAmt}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Category bar */}
        <Card title="Budget vs spent by category" className={styles.wide}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catBarData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barGap={3}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#5a5654', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a5654', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '$' + v} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => fmt(v)} />
              <Bar dataKey="Budget" fill="#1f1f24" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Spent" radius={[4, 4, 0, 0]}>
                {catBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top categories */}
        <Card title="Top spending this month">
          <div className={styles.topList}>
            {topCats.map((cat, i) => {
              const pct = cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0
              return (
                <div key={cat.id} className={styles.topItem}>
                  <div className={styles.topRank}>{i + 1}</div>
                  <div className={styles.topInfo}>
                    <div className={styles.topName} style={{ color: cat.color }}>{cat.name}</div>
                    <div className={styles.topBar}>
                      <div className={styles.topBarFill} style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </div>
                  <div className={styles.topAmt}>{fmt(cat.spent)}</div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
