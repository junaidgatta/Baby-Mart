'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './Success.module.css';

export default function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <div className="container section-padding">
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <span className={styles.successIcon}>🎉</span>
        </div>
        <h1 className={styles.title}>Thank You For Your Order!</h1>
        <p className={styles.desc}>Your order has been placed successfully. We'll contact you shortly for confirmation.</p>
        
        <div className={styles.orderInfo}>
          <div className={styles.idRow}>
            <span>Order ID:</span>
            <strong>{orderId}</strong>
          </div>
          <p className={styles.status}>Payment Method: Cash on Delivery (COD)</p>
        </div>

        <div className={styles.actions}>
          <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
          <Link href="/account/orders" className="btn btn-outline">Track Your Order</Link>
        </div>
      </div>
    </div>
  );
}
