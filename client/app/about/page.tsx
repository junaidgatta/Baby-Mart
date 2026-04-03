'use client';
import styles from '../page.module.css'; // Using some common styles

export default function AboutPage() {
  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '24px', color: 'var(--primary)' }}>
          About 🍼 BabyMart
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '40px' }}>
          Welcome to BabyMart, your number one source for all things baby. We're dedicated to giving you the very best of baby products, with a focus on quality, safety, and comfort.
        </p>
        
        <div style={{ textAlign: 'left', background: 'var(--primary-bg)', padding: '40px', borderRadius: '20px' }}>
          <h2 style={{ marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ marginBottom: '24px' }}>
            Founded in 2026, BabyMart has come a long way from its beginnings. When we first started out, our passion for "Safe & Happy Babies" drove us to do tons of research so that BabyMart can offer you the world's most trusted certified organic baby products.
          </p>
          
          <h2 style={{ marginBottom: '16px' }}>Why Choose Us?</h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
            <li>Premium Quality Products</li>
            <li>100% Safe & Certified Materials</li>
            <li>Fast & Reliable Delivery across Pakistan</li>
            <li>24/7 Customer Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
