import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, BarChart2,
  Tag, Settings, Menu, X, TrendingUp
} from 'lucide-react'
import styles from './Layout.module.css'

const NAV = [
  { to: '/dashboard',    label: 'Dashboard',     Icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions',   Icon: ArrowLeftRight },
  { to: '/analytics',   label: 'Analytics',      Icon: BarChart2 },
  { to: '/categories',  label: 'Categories',     Icon: Tag },
  { to: '/settings',    label: 'Settings',       Icon: Settings },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className={styles.shell}>
      {/* Mobile overlay */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <TrendingUp size={18} color="#4ec994" strokeWidth={2.5} />
          <span>Ledger</span>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navActive : ''}`
              }
              onClick={() => setOpen(false)}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.version}>v1.0.0</div>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className={styles.topbarLogo}>
            <TrendingUp size={16} color="#4ec994" strokeWidth={2.5} />
            <span>Ledger</span>
          </div>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
