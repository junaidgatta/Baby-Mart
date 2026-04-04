import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

const navItems = [
  { to: '/',         icon: '📊', label: 'Dashboard', end: true },
  { to: '/orders',   icon: '📦', label: 'Orders' },
  { to: '/products', icon: '🧸', label: 'Products' },
  { to: '/categories',icon:'🏷️', label: 'Categories' },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ''}`}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🍼</span>
          {!collapsed && <span className={styles.logoText}>Baby<strong>Mart</strong></span>}
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              {!collapsed && <span className={styles.navLabel}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminBadge}>
            <span className={styles.avatar}>{admin?.name?.[0]?.toUpperCase()}</span>
            {!collapsed && (
              <div className={styles.adminInfo}>
                <span className={styles.adminName}>{admin?.name}</span>
                <span className={styles.adminRole}>Administrator</span>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
            {collapsed ? '🚪' : '🚪 Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
          <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
