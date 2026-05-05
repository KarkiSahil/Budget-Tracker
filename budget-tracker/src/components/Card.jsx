import React from 'react'
import styles from './Card.module.css'

export default function Card({ children, title, className = '' }) {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && <div className={styles.title}>{title}</div>}
      {children}
    </div>
  )
}
