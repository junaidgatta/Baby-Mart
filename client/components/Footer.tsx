'use client';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>🍼 Baby<span>Mart</span></h3>
            <p className={styles.desc}>Premium essentials for your little ones. We provide the safest and highest quality products for babies and mothers.</p>
          </div>

          <div className={styles.group}>
            <h4 className={styles.title}>Shop</h4>
            <ul className={styles.list}>
              <li><Link href="/products?category=clothing">Clothing</Link></li>
              <li><Link href="/products?category=diapers">Diapers</Link></li>
              <li><Link href="/products?category=toys">Toys</Link></li>
              <li><Link href="/products?category=feeding">Feeding</Link></li>
            </ul>
          </div>

          <div className={styles.group}>
            <h4 className={styles.title}>Account</h4>
            <ul className={styles.list}>
              <li><Link href="/account">Profile</Link></li>
              <li><Link href="/account/orders">My Orders</Link></li>
              <li><Link href="/cart">Cart</Link></li>
            </ul>
          </div>

          <div className={styles.group}>
            <h4 className={styles.title}>Support</h4>
            <ul className={styles.list}>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/shipping">Shipping Info</Link></li>
              <li><Link href="/returns">Returns</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Baby Mart. All rights reserved.</p>
          <div className={styles.socials}>
            <span>FB</span>
            <span>IG</span>
            <span>TW</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
