'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import styles from './Account.module.css';

interface OrderSummary {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get('/orders/my')
        .then(({ data }) => setOrders(data.orders))
        .catch(console.error)
        .finally(() => setFetchingOrders(false));
    }
  }, [user]);

  if (loading || !user) return <div className="container section-padding">Verifying...</div>;

  return (
    <div className="container section-padding">
      <div className={styles.grid}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.profile}>
            <div className={styles.avatar}>{user.name[0]}</div>
            <h2 className={styles.name}>{user.name}</h2>
            <p className={styles.email}>{user.email}</p>
          </div>
          <nav className={styles.nav}>
            <Link href="/account" className={styles.navLinkActive}>Dashboard</Link>
            <Link href="/account/orders" className={styles.navLink}>Order History</Link>
            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          </nav>
        </aside>

        {/* ── Content ── */}
        <main className={styles.main}>
          <div className={styles.dashboard}>
            <h1 className={styles.title}>Account Overview</h1>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Recent Orders</h3>
              {fetchingOrders ? (
                <p>Loading your orders...</p>
              ) : orders.length === 0 ? (
                <div className={styles.empty}>
                  <p>You haven't placed any orders yet.</p>
                  <Link href="/products" className="btn btn-outline" style={{ marginTop: '16px' }}>Shop Now</Link>
                </div>
              ) : (
                <div className={styles.orderTable}>
                  <div className={styles.tableHead}>
                    <span>Order #</span>
                    <span>Date</span>
                    <span>Total</span>
                    <span>Status</span>
                  </div>
                  {orders.slice(0, 3).map(o => (
                    <Link key={o._id} href={`/account/orders`} className={styles.tableRow}>
                      <span className={styles.orderId}>{o.orderNumber}</span>
                      <span className={styles.date}>{new Date(o.createdAt).toLocaleDateString()}</span>
                      <span className={styles.amount}>Rs {o.totalAmount.toLocaleString()}</span>
                      <span className={`${styles.status} ${styles[o.status]}`}>{o.status}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Default Address</h3>
              {user.addresses.length > 0 ? (
                <div className={styles.address}>
                  <p><strong>{user.addresses[0].fullName}</strong></p>
                  <p>{user.addresses[0].street}, {user.addresses[0].city}</p>
                  <p>{user.addresses[0].country}</p>
                  <p>Phone: {user.addresses[0].phone}</p>
                </div>
              ) : (
                <p>No addresses saved.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
