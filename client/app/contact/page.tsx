'use client';
import styles from '../page.module.css';

export default function ContactPage() {
  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '24px', color: 'var(--primary)' }}>
          Contact Us 🍼
        </h1>
        <p style={{ marginBottom: '48px', color: 'var(--text-light)' }}>
          Have a question or need assistance? We're here to help!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', textAlign: 'left' }}>
          {/* Info Side */}
          <div style={{ background: 'var(--primary-bg)', padding: '32px', borderRadius: '20px' }}>
             <h3 style={{ marginBottom: '16px' }}>Get in Touch</h3>
             <p style={{ fontSize: '14px', marginBottom: '8px' }}>📞 <strong>Phone:</strong></p>
             <p style={{ marginBottom: '24px' }}>+92 21 37170 445</p>
             
             <p style={{ fontSize: '14px', marginBottom: '8px' }}>✉️ <strong>Email:</strong></p>
             <p style={{ marginBottom: '24px' }}>support@babymart.com</p>
             
             <p style={{ fontSize: '14px', marginBottom: '8px' }}>🕒 <strong>Support Hours:</strong></p>
             <p>Mon - Sat: 9:30am - 10:00pm</p>
             <p>Sun: 11:00am - 8:00pm</p>
          </div>

          {/* Simple Form Side */}
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '32px', borderRadius: '20px' }}>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will contact you soon.'); }}>
               <div style={{ marginBottom: '20px' }}>
                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Name</label>
                 <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }} required />
               </div>
               <div style={{ marginBottom: '20px' }}>
                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Email</label>
                 <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }} required />
               </div>
               <div style={{ marginBottom: '24px' }}>
                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Message</label>
                 <textarea rows={4} style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }} required></textarea>
               </div>
               <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
