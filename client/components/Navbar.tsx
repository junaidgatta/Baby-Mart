'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/cartStore';
import styles from './Navbar.module.css';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            🍼 Baby<span>Mart</span>
          </Link>

          <div className={styles.links}>
            <Link href="/products" className={styles.link}>Shop</Link>
            <Link href="/categories" className={styles.link}>Categories</Link>
          </div>

          <div className={styles.actions}>
            <Link href="/cart" className={styles.cartBtn}>
              <span className={styles.icon}>🛒</span>
              {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
            </Link>

            {user ? (
              <div className={styles.userMenu}>
                <Link href="/account" className={styles.userBtn}>
                  <span className={styles.avatar}>{user.name[0]}</span>
                </Link>
                <button onClick={logout} className={styles.logoutBtn}>Logout</button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary">Login</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
