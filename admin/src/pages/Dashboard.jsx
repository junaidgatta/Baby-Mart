import { useEffect, useState } from 'react';
import api from '../api/axios';
import styles from './Dashboard.module.css';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

function StatCard({ icon, label, value, color }) {
  return (
    <div className={styles.statCard} style={{ '--card-color': color }}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders?limit=5').then(({ data }) => {
      setStats(data.stats || []);
      setRecentOrders(data.orders || []);
    }).finally(() => setLoading(false));
  }, []);

  const getCount = (status) => stats.find(s => s._id === status)?.count || 0;
  const getRevenue = () => stats.reduce((sum, s) => sum + (s.revenue || 0), 0);

  const statusBadge = (s) => {
    const map = { pending: '#f5a623', confirmed: '#5bc8fa', delivered: '#22d3a5', cancelled: '#ff5370' };
    return (
      <span style={{
        background: `${map[s]}22`, color: map[s],
        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600
      }}>{s}</span>
    );
  };

  const handleExportSummary = () => {
    const data = [
      { Category: 'Total Revenue', Value: `Rs ${getRevenue().toLocaleString()}` },
      { Category: 'Pending Orders', Value: getCount('pending') },
      { Category: 'Confirmed Orders', Value: getCount('confirmed') },
      { Category: 'Delivered Orders', Value: getCount('delivered') },
      { Category: 'Recent Order Customer', Value: recentOrders[0]?.user?.name || 'N/A' },
      { Category: 'Report Date', Value: new Date().toLocaleDateString() }
    ];
    exportToExcel(data, 'BabyMart-Sales-Summary');
  };

  if (loading) return <div className={styles.loader}>Loading dashboard…</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Overview</h2>
        <button onClick={handleExportSummary} className={styles.exportBtn}>📊 Export Summary</button>
      </div>

      <div className={styles.statsGrid}>
        <StatCard icon="📦" label="Pending Orders"   value={getCount('pending')}   color="#f5a623" />
        <StatCard icon="✅" label="Confirmed"         value={getCount('confirmed')} color="#5bc8fa" />
        <StatCard icon="🚚" label="Delivered"         value={getCount('delivered')} color="#22d3a5" />
        <StatCard icon="💰" label="Total Revenue"     value={`Rs ${getRevenue().toLocaleString()}`} color="#7c6ff7" />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent Orders</h3>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Order #</span><span>Customer</span><span>Amount</span><span>Status</span><span>Date</span>
          </div>
          {recentOrders.length === 0 && <p className={styles.empty}>No orders yet</p>}
          {recentOrders.map(o => (
            <div className={styles.tableRow} key={o._id}>
              <span className={styles.orderNo}>{o.orderNumber}</span>
              <span>{o.user?.name || 'Guest'}</span>
              <span>Rs {o.totalAmount?.toLocaleString()}</span>
              <span>{statusBadge(o.status)}</span>
              <span className={styles.date}>{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
