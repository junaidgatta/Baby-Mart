'use client';
import Link from 'next/link';
import styles from './Categories.module.css';

const CATEGORIES = [
  { id: 'clothing', name: 'Clothing', icon: '👕', desc: 'Cute outfits for your little ones' },
  { id: 'feeding', name: 'Feeding', icon: '🍼', desc: 'Bottles, bibs and high chairs' },
  { id: 'toys', name: 'Toys', icon: '🧸', desc: 'Educational and fun playthings' },
  { id: 'diapers', name: 'Diapers', icon: '🧷', desc: 'Comfortable diapers and wipes' },
  { id: 'skincare', name: 'Skincare', icon: '🧴', desc: 'Gentle soaps, lotions and oils' },
  { id: 'accessories', name: 'Accessories', icon: '🎀', desc: 'Bows, hats and small essentials' },
  { id: 'safety', name: 'Safety', icon: '🛡️', desc: 'Baby monitors and childproofing' },
  { id: 'nursery', name: 'Nursery', icon: '🛏️', desc: 'Cribs, bedding and decor' },
];

export default function CategoriesPage() {
  return (
    <div className="container section-padding">
      <div className={styles.header}>
        <h1 className={styles.title}>Browse by Category</h1>
        <p className={styles.desc}>Find exactly what you need for your baby's age and stage.</p>
      </div>

      <div className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} href={`/products?category=${cat.id}`} className={styles.card}>
            <span className={styles.icon}>{cat.icon}</span>
            <div className={styles.info}>
              <h2 className={styles.name}>{cat.name}</h2>
              <p className={styles.itemDesc}>{cat.desc}</p>
            </div>
            <span className={styles.arrow}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
