'use client';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import styles from './Cart.module.css';

export default function CartPage() {
  const { items, removeItem, updateQty, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="container section-padding">
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <h1 className={styles.emptyTitle}>Your cart is empty</h1>
          <p className={styles.emptyDesc}>Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.layout}>
        {/* ── Items List ── */}
        <div className={styles.itemsCol}>
          {items.map((item) => (
            <div key={item.product} className={styles.itemCard}>
              <Link href={`/products/${item.slug}`} className={styles.itemImg}>
                <img src={item.image} alt={item.name} />
              </Link>
              <div className={styles.itemInfo}>
                <Link href={`/products/${item.slug}`}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                </Link>
                <p className={styles.itemPrice}>Rs {item.price.toLocaleString()}</p>
                <div className={styles.itemActions}>
                  <div className={styles.qtyControl}>
                    <button onClick={() => updateQty(item.product, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.product, item.qty + 1)}>+</button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.product)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className={styles.itemTotal}>
                Rs {(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* ── Summary ── */}
        <aside className={styles.summaryCol}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>Rs {total.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.free}>FREE</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>Rs {total.toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>
              Proceed to Checkout
            </Link>
            <p className={styles.secureHint}>🔒 Secure Checkout</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
