'use client';
import { useState } from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <footer className={styles.footer}>
      {/* ── Newsletter Section (Top) ── */}
      <div className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <div className={styles.newsletterInput}>
              <input type="email" placeholder="Enter Your Email Address" />
              <button type="submit">SIGN UP</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {/* ── Need Help? ── */}
          <div className={styles.group}>
            <h4 className={styles.title}>NEED HELP?</h4>
            <div className={styles.supportInfo}>
              <p className={styles.phone}>+922 137 170 445</p>
              <p className={styles.timings}>(Mon - Sat: 9:30am - 10:00pm | Sun: 11am - 8pm)</p>
              <Link href="mailto:eshop@babymart.com" className={styles.email}>eshop@babymart.com</Link>
            </div>
          </div>

          {/* ── Customer Service (Accordion on Mobile) ── */}
          <div className={`${styles.group} ${openSection === 'cs' ? styles.open : ''}`}>
            <h4 className={styles.title} onClick={() => toggleSection('cs')}>
              CUSTOMER SERVICE <span>{openSection === 'cs' ? '-' : '+'}</span>
            </h4>
            <ul className={styles.list}>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/shipping">Delivery & Orders</Link></li>
              <li><Link href="/returns">Returns & Exchanges</Link></li>
              <li><Link href="/faq">FAQ's</Link></li>
            </ul>
          </div>

          {/* ── Company ── */}
          <div className={`${styles.group} ${openSection === 'comp' ? styles.open : ''}`}>
            <h4 className={styles.title} onClick={() => toggleSection('comp')}>
              COMPANY <span>{openSection === 'comp' ? '-' : '+'}</span>
            </h4>
            <ul className={styles.list}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* ── Follow Us ── */}
          <div className={styles.group}>
            <h4 className={styles.title}>FOLLOW US</h4>
            <div className={styles.socialIcons}>
              <Link href="#" className={styles.iconLink}>f</Link>
              <Link href="#" className={styles.iconLink}>t</Link>
              <Link href="#" className={styles.iconLink}>y</Link>
              <Link href="#" className={styles.iconLink}>i</Link>
              <Link href="#" className={styles.iconLink}>p</Link>
              <Link href="#" className={styles.iconLink}>in</Link>
            </div>
          </div>
        </div>

        {/* ── Footer Bottom ── */}
        <div className={styles.bottom}>
          <div className={styles.bottomBrand}>
             <h2 className={styles.bottomLogo}>🍼 BabyMart</h2>
             <p>Certified Organic & Premium Quality Baby Store</p>
          </div>
          <div className={styles.copyright}>
            <p>© 2026 Baby Mart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
