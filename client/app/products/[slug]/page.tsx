'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import styles from './ProductDetail.module.css';
import { useCartStore } from '@/store/cartStore';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  ageRange: string;
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (slug) {
      api.get(`/products/${slug}`)
        .then(({ data }) => setProduct(data.product))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="container section-padding">Loading product details...</div>;
  if (!product) return <div className="container section-padding">Product not found.</div>;

  const handleAddToCart = () => {
    addItem({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty: qty,
      slug: product.slug
    });
  };

  return (
    <div className="container section-padding">
      <div className={styles.grid}>
        {/* ── Images ── */}
        <div className={styles.imagesCol}>
          <div className={styles.mainImg}>
            <img src={product.images[activeImg]} alt={product.name} />
          </div>
          <div className={styles.thumbs}>
            {product.images.map((img, i) => (
              <button 
                key={i} 
                className={`${styles.thumb} ${activeImg === i ? styles.activeThumb : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt={`${product.name} ${i}`} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Info ── */}
        <div className={styles.infoCol}>
          <p className={styles.cat}>{product.category}</p>
          <h1 className={styles.title}>{product.name}</h1>
          
          <div className={styles.ratingRow}>
            <span>⭐ {product.rating}</span>
            <span className={styles.reviewCount}>({product.reviewCount} Reviews)</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>Rs {product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className={styles.oldPrice}>Rs {product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <p className={styles.desc}>{product.description}</p>

          <div className={styles.meta}>
            <p><strong>Age Range:</strong> {product.ageRange}</p>
            <p><strong>Availability:</strong> {product.stock > 0 ? <span className={styles.instock}>In Stock ({product.stock})</span> : <span className={styles.outstock}>Out of Stock</span>}</p>
          </div>

          <div className={styles.buyActions}>
            <div className={styles.qtyControl}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
