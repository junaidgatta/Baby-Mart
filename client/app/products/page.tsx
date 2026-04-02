'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import styles from './Products.module.css';
import { useCartStore } from '@/store/cartStore';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
}

const CATEGORIES = [
  { id: '', name: 'All Products' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'feeding', name: 'Feeding' },
  { id: 'toys', name: 'Toys' },
  { id: 'diapers', name: 'Diapers' },
  { id: 'skincare', name: 'Skincare' },
  { id: 'accessories', name: 'Accessories' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  
  const currentCategory = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const query = currentCategory ? `?category=${currentCategory}` : '';
    api.get(`/products${query}`)
      .then(({ data }) => setProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentCategory]);

  const handleCategoryChange = (id: string) => {
    if (id) router.push(`/products?category=${id}`);
    else router.push('/products');
  };

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
    <div className="container section-padding">
      <div className={styles.layout}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Categories</h3>
          <ul className={styles.catList}>
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button 
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`${styles.catBtn} ${currentCategory === cat.id ? styles.active : ''}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Products Grid ── */}
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {currentCategory ? CATEGORIES.find(c => c.id === currentCategory)?.name : 'All Products'}
            </h1>
            <p className={styles.count}>{products.length} Products Found</p>
          </div>

          {loading ? (
            <div className={styles.loader}>Loading products...</div>
          ) : (
            <div className={styles.grid}>
              {products.map((p) => (
                <div key={p._id} className="card">
                  <Link href={`/products/${p.slug}`} className={styles.productImg}>
                    <img src={p.images[0]} alt={p.name} />
                  </Link>
                  <div className={styles.productInfo}>
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
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container section-padding">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
