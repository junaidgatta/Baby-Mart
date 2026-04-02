import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import styles from './Orders.module.css';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

const STATUS_COLORS = {
  pending:   { bg: 'rgba(245,166,35,0.12)',  color: '#f5a623' },
  confirmed: { bg: 'rgba(91,200,250,0.12)',  color: '#5bc8fa' },
  delivered: { bg: 'rgba(34,211,165,0.12)',  color: '#22d3a5' },
  cancelled: { bg: 'rgba(255,83,112,0.12)',  color: '#ff5370' },
};

const TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || {};
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '4px 12px', borderRadius: '20px',
      fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

export default function Orders() {
  const [orders, setOrders]         = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [filterStatus, setFilter]   = useState('');
  const [loading, setLoading]       = useState(true);
  const [updating, setUpdating]     = useState(null);
  const [expanded, setExpanded]     = useState(null);
  const [toast, setToast]           = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterStatus) params.set('status', filterStatus);
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`✅ Order updated to "${newStatus}"`);
      fetchOrders();
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || 'Failed to update'}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleExportExcel = () => {
    const data = orders.map(o => ({
      'Order #': o.orderNumber,
      'Customer': o.user?.name || 'Guest',
      'Email': o.user?.email,
      'Items': o.items?.length,
      'Total (Rs)': o.totalAmount,
      'Status': o.status,
      'Date': new Date(o.createdAt).toLocaleDateString()
    }));
    exportToExcel(data, `BabyMart-Orders-${filterStatus || 'All'}`);
    showToast('📊 Excel exported successfully');
  };

  const handleExportPDF = () => {
    const columns = ['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.user?.name || 'Guest',
      o.items?.length,
      `Rs ${o.totalAmount.toLocaleString()}`,
      o.status.toUpperCase(),
      new Date(o.createdAt).toLocaleDateString()
    ]);
    exportToPDF(columns, rows, `Orders Report (${filterStatus || 'All'})`, `BabyMart-Orders-${filterStatus || 'All'}`);
    showToast('📄 PDF exported successfully');
  };

  const pages = Math.ceil(total / 15);

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.toolbar}>
        <h2 className={styles.heading}>Orders <span className={styles.count}>{total}</span></h2>
        <div className={styles.filters}>
          {['', 'pending', 'confirmed', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${filterStatus === s ? styles.active : ''}`}
              onClick={() => { setFilter(s); setPage(1); }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className={styles.exportGroup}>
          <button onClick={handleExportExcel} className={styles.exportBtn} title="Excel Export">📊 Excel</button>
          <button onClick={handleExportPDF} className={styles.exportBtn} title="PDF Export">📄 PDF</button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading orders…</div>
      ) : (
        <div className={styles.tableWrap}>
          <div className={styles.tableHead}>
            <span>Order #</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          {orders.length === 0 && <p className={styles.empty}>No orders found</p>}

          {orders.map((o) => (
            <div key={o._id}>
              <div
                className={styles.tableRow}
                onClick={() => setExpanded(expanded === o._id ? null : o._id)}
              >
                <span className={styles.orderNo}>{o.orderNumber}</span>
                <span>
                  <span className={styles.custName}>{o.user?.name || '—'}</span>
                  <br />
                  <span className={styles.custEmail}>{o.user?.email}</span>
                </span>
                <span className={styles.itemCount}>{o.items?.length} item(s)</span>
                <span className={styles.amount}>Rs {o.totalAmount?.toLocaleString()}</span>
                <span><StatusBadge status={o.status} /></span>
                <span className={styles.date}>{new Date(o.createdAt).toLocaleDateString()}</span>
                <span onClick={(e) => e.stopPropagation()}>
                  {TRANSITIONS[o.status]?.length > 0 ? (
                    <select
                      className={styles.actionSelect}
                      defaultValue=""
                      disabled={updating === o._id}
                      onChange={(e) => { if (e.target.value) updateStatus(o._id, e.target.value); }}
                    >
                      <option value="" disabled>Move to…</option>
                      {TRANSITIONS[o.status].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={styles.noAction}>—</span>
                  )}
                </span>
              </div>

              {/* Expanded details */}
              {expanded === o._id && (
                <div className={styles.expandedRow}>
                  <div className={styles.expandGrid}>
                    <div>
                      <p className={styles.expLabel}>Shipping Address</p>
                      <p>{o.shippingAddress?.fullName}</p>
                      <p>{o.shippingAddress?.phone}</p>
                      <p>{o.shippingAddress?.street}, {o.shippingAddress?.city}</p>
                      <p>{o.shippingAddress?.state} {o.shippingAddress?.zip}</p>
                    </div>
                    <div>
                      <p className={styles.expLabel}>Items Ordered</p>
                      {o.items?.map((item, i) => (
                        <div key={i} className={styles.expItem}>
                          <span>{item.name}</span>
                          <span>× {item.qty} @ Rs {item.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>← Prev</button>
          <span className={styles.pageInfo}>Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next →</button>
        </div>
      )}
    </div>
  );
}
