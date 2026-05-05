import React from 'react'
import styles from './StatCard.module.css'

export default function StatCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {Icon && (
          <div className={styles.iconWrap}>
            <Icon size={14} strokeWidth={1.8} />
          </div>
        )}
      </div>
      <div className={styles.value} style={color ? { color } : {}}>
        {value}
      </div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  )
}
