'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, Address } from '@/context/AuthContext';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';
import styles from './Checkout.module.css';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { items, getTotal, clearCart } = useCartStore();
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState('');

  // Form for new address
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', zip: '', label: 'Home'
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/checkout');
      } else if (items.length === 0) {
        router.push('/cart');
      } else {
        const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
        if (def) setSelectedAddress(def);
      }
    }
  }, [user, authLoading, items, router]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users/addresses', { ...newAddr, isDefault: true });
      await refreshUser();
      setShowAddrForm(false);
      // user.addresses will update, useEffect will select it
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select or add a shipping address');
      return;
    }

    setIsPlacing(true);
    setError('');

    try {
      const { data } = await api.post('/orders', {
        items,
        shippingAddress: selectedAddress,
        paymentMethod: 'cod'
      });

      if (data.success) {
        clearCart();
        router.push(`/order-success/${data.order._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (authLoading || !user) return <div className="container section-padding">Authenticating...</div>;

  return (
    <div className="container section-padding">
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        <div className={styles.main}>
          {/* ── Shipping Address ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>1. Shipping Address</h2>
              {!showAddrForm && (
                <button onClick={() => setShowAddrForm(true)} className={styles.addBtn}>
                  + Add New
                </button>
              )}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {showAddrForm ? (
              <form onSubmit={handleAddAddress} className={styles.addrForm}>
                <div className={styles.formGrid}>
                  <input placeholder="Full Name" value={newAddr.fullName} onChange={e => setNewAddr({...newAddr, fullName: e.target.value})} required />
                  <input placeholder="Phone Number" value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} required />
                  <input placeholder="Street Address" className={styles.fullWidth} value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} required />
                  <input placeholder="City" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} required />
                  <input placeholder="State / Province" value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} required />
                  <input placeholder="ZIP / Postal Code" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} required />
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowAddrForm(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Address</button>
                </div>
              </form>
            ) : (
              <div className={styles.addressList}>
                {user.addresses.map((addr) => (
                  <div 
                    key={addr._id} 
                    className={`${styles.addrCard} ${selectedAddress?._id === addr._id ? styles.selected : ''}`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <div className={styles.addrHeader}>
                      <span className={styles.label}>{addr.label}</span>
                      {selectedAddress?._id === addr._id && <span className={styles.check}>✓ Selected</span>}
                    </div>
                    <p><strong>{addr.fullName}</strong></p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                    <p>{addr.phone}</p>
                  </div>
                ))}
                {user.addresses.length === 0 && <p className={styles.emptyHint}>No addresses saved. Please add one to continue.</p>}
              </div>
            )}
          </section>

          {/* ── Payment Method ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Payment Method</h2>
            <div className={styles.paymentCard}>
              <div className={styles.paymentInfo}>
                <span className={styles.cashIcon}>💵</span>
                <div>
                  <p><strong>Cash on Delivery (COD)</strong></p>
                  <p className={styles.paymentDesc}>Pay with cash when your order is delivered to your doorstep.</p>
                </div>
              </div>
              <span className={styles.selectedDot}></span>
            </div>
          </section>
        </div>

        {/* ── Order Summary ── */}
        <aside className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Your Order</h3>
            <div className={styles.itemList}>
              {items.map((item) => (
                <div key={item.product} className={styles.summaryItem}>
                  <div className={styles.itemThumb}>
                    <img src={item.image} alt={item.name} />
                    <span className={styles.itemQty}>{item.qty}</span>
                  </div>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemPrice}>Rs {(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>Rs {getTotal().toLocaleString()}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span className={styles.free}>FREE</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total Amount</span>
                <span>Rs {getTotal().toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || isPlacing}
              className={`${styles.placeBtn} btn btn-primary`}
            >
              {isPlacing ? 'Placing Order...' : 'Place Order (COD) →'}
            </button>
            <p className={styles.policy}>By placing your order, you agree to Baby Mart's terms of use and privacy policy.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
