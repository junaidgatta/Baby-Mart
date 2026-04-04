import { useEffect, useState } from 'react';
import api from '../api/axios';
import styles from './Products.module.css';

const EMPTY_FORM = {
  name:'', slug:'', description:'', price:'', originalPrice:'',
  category:'', stock:'', isFeatured:false, ageRange:'0-12 months',
  images:[''], tags:'',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');
  const [search, setSearch]     = useState('');
  const [uploading, setUploading] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${search}&limit=50` : '?limit=50';
      const { data } = await api.get(`/products${params}`);
      setProducts(data.products);
    } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, [search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit   = (p) => {
    setEditing(p);
    setForm({ ...p, tags: p.tags?.join(', ') || '', images: p.images?.length ? p.images : [''] });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
        showToast('✅ Product updated');
      } else {
        await api.post('/products', payload);
        showToast('✅ Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || 'Save failed'}`);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('🗑️ Product deleted');
      fetchProducts();
    } catch { showToast('❌ Delete failed'); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // The server returns a relative path like /uploads/products/xyz.jpg
      // We prepend the API base URL (removing the /api suffix)
      const baseUrl = api.defaults.baseURL.replace('/api', '');
      const fullUrl = `${baseUrl}${data.url}`;
      set('images', [fullUrl]);
      showToast('📸 Image uploaded successfully');
    } catch (err) {
      showToast(`❌ Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.toolbar}>
        <h2 className={styles.heading}>Products <span className={styles.count}>{products.length}</span></h2>
        <input
          className={styles.search} placeholder="🔍 Search products…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button className={styles.addBtn} onClick={openCreate}>+ Add Product</button>
      </div>

      {loading ? <div className={styles.loader}>Loading…</div> : (
        <div className={styles.grid}>
          {products.map(p => (
            <div key={p._id} className={styles.card}>
              <div className={styles.cardImg}>
                <img src={p.images?.[0]} alt={p.name} onError={e => e.target.src='https://placehold.co/200x160?text=No+Image'} />
                {p.isFeatured && <span className={styles.featured}>⭐ Featured</span>}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.category}>{p.category}</span>
                <h3 className={styles.productName}>{p.name}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.price}>Rs {p.price?.toLocaleString()}</span>
                  {p.originalPrice > p.price && (
                    <span className={styles.oldPrice}>Rs {p.originalPrice?.toLocaleString()}</span>
                  )}
                </div>
                <div className={styles.meta}>
                  <span>Stock: <strong>{p.stock}</strong></span>
                  <span>⭐ {p.rating}</span>
                </div>
                <div className={styles.actions}>
                  <button className={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editing ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSave} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Product Name *</label>
                  <input value={form.name} onChange={e => {
                    set('name', e.target.value);
                    if (!editing) set('slug', e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''));
                  }} required />
                </div>
                <div className={styles.field}>
                  <label>Slug *</label>
                  <input value={form.slug} onChange={e => set('slug', e.target.value)} required />
                </div>
              </div>
              <div className={styles.field}>
                <label>Description *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} required />
              </div>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Price (Rs) *</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label>Original Price (Rs)</label>
                  <input type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Stock *</label>
                  <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="" disabled>Select a Category</option>
                    {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Age Range</label>
                  <input value={form.ageRange} onChange={e => set('ageRange', e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label>Product Image *</label>
                <div className={styles.imageUpload}>
                  <input 
                    type="text" 
                    value={form.images[0]} 
                    onChange={e => set('images', [e.target.value])} 
                    placeholder="URL or Upload below..." 
                  />
                  <div className={styles.uploadBtnWrapper}>
                    <button type="button" className={styles.uploadBtn}>
                      {uploading ? '⌛ Uploading...' : '📁 Upload Image'}
                    </button>
                    <input 
                      type="file" 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      disabled={uploading}
                    />
                  </div>
                </div>
                {form.images[0] && (
                  <div className={styles.preview}>
                    <img src={form.images[0]} alt="Preview" />
                  </div>
                )}
              </div>
              <div className={styles.field}>
                <label>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="newborn, cotton, organic" />
              </div>
              <label className={styles.checkRow}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
                Mark as Featured
              </label>
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
