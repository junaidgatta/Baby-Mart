'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import styles from './page.module.css';
import { useCartStore } from '@/store/cartStore';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  isFeatured: boolean;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    api.get('/products?featured=true&limit=4')
      .then(({ data }) => setFeaturedProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (p: Product) => {
    addItem({
      product: p._id,
      name: p.name,
      price: p.price,
      image: p.images[0],
      qty: 1,
      slug: p.slug
    });
  };

  return (
    <div className={styles.home}>
      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Welcome to Baby Mart</span>
            <h1 className={styles.heroTitle}>Everything Your <br /><span>Little One</span> Needs</h1>
            <p className={styles.heroDesc}>Discover our collection of premium baby clothing, diapers, and accessories designed for comfort and safety.</p>
            <div className={styles.heroBtns}>
              <Link href="/products" className="btn btn-primary">Shop Now</Link>
              <Link href="/categories" className="btn btn-outline">Browse Categories</Link>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80" alt="Baby nursery" />
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section-padding">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <Link href="/products" className={styles.viewAll}>View All →</Link>
          </div>

          {loading ? (
            <div className={styles.loader}>Loading curated collection...</div>
          ) : (
            <div className={styles.grid}>
              {featuredProducts.map((p) => (
                <div key={p._id} className="card">
                  <Link href={`/products/${p.slug}`} className={styles.productImg}>
                    <img src={p.images[0]} alt={p.name} />
                    {p.originalPrice > p.price && (
                      <span className={styles.discountBadge}>
                        -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                      </span>
                    )}
                  </Link>
                  <div className={styles.productInfo}>
                    <p className={styles.productCat}>{p.category}</p>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className={styles.productName}>{p.name}</h3>
                    </Link>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>Rs {p.price.toLocaleString()}</span>
                      {p.originalPrice > p.price && (
                        <span className={styles.oldPrice}>Rs {p.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(p)}
                      className={`${styles.addBtn} btn btn-outline`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.categoryGrid}>
            {[
              { id: 'clothing', name: 'Clothing', icon: '👕', bg: '#fef3f2' },
              { id: 'diapers', name: 'Diapers', icon: '🧷', bg: '#f0f9ff' },
              { id: 'toys', name: 'Toys', icon: '🧸', bg: '#fdf2f8' },
              { id: 'feeding', name: 'Feeding', icon: '🍼', bg: '#ecfdf5' },
            ].map((cat) => (
              <Link 
                key={cat.id} 
                href={`/products?category=${cat.id}`}
                className={styles.catCard}
                style={{ backgroundColor: cat.bg }}
              >
                <span className={styles.catIcon}>{cat.icon}</span>
                <h4 className={styles.catName}>{cat.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
