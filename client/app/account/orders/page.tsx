'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import styles from '../account/Account.module.css';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get('/orders/my')
        .then(({ data }) => setOrders(data.orders))
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) return <div className="container section-padding">Loading...</div>;

  return (
    <div className="container section-padding">
      <div className={styles.grid}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <Link href="/account" className={styles.navLink}>Dashboard</Link>
            <Link href="/account/orders" className={styles.navLinkActive}>Order History</Link>
          </nav>
        </aside>

        <main className={styles.main}>
          <h1 className={styles.title}>Your Orders</h1>
          
          {fetching ? (
            <p>Fetching your order history...</p>
          ) : orders.length === 0 ? (
            <div className={styles.card}>
              <p>You haven't placed any orders yet.</p>
              <Link href="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Start Shopping</Link>
            </div>
          ) : (
            <div className={styles.orderList}>
              {orders.map(order => (
                <div key={order._id} className={styles.card} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666' }}>ORDER #</p>
                      <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{order.orderNumber}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#666' }}>PLACED ON</p>
                      <p style={{ fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span>{item.name} <strong>x {item.qty}</strong></span>
                        <span>Rs {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed #eee' }}>
                    <div>
                      <span className={`${styles.status} ${styles[order.status]}`}>{order.status}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '14px', color: '#666', marginRight: '8px' }}>Total Paid:</span>
                      <strong style={{ fontSize: '18px' }}>Rs {order.totalAmount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
