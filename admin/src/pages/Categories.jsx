import { useState, useEffect } from 'react';
import api from '../api/axios';
import styles from './Categories.module.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', slug: '', icon: '🏷️', desc: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setFormData({ name: '', slug: '', icon: '🏷️', desc: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, slug: cat.slug, icon: cat.icon, desc: cat.desc });
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Error deleting category');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Categories</h1>

      <div className={styles.grid}>
        <div className={styles.formCard}>
          <h2 className={styles.cardTitle}>{editingId ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Diapers" />
            </div>
            <div className={styles.formGroup}>
              <label>Slug (Unique ID)</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required placeholder="e.g. diapers" disabled={!!editingId} />
            </div>
            <div className={styles.formGroup}>
              <label>Icon (Emoji or URL)</label>
              <input name="icon" value={formData.icon} onChange={handleChange} placeholder="e.g. 🧷" />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea name="desc" value={formData.desc} onChange={handleChange} rows="3" placeholder="Brief description..." />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary}>{editingId ? 'Update' : 'Add Category'}</button>
              {editingId && <button type="button" className={styles.btnOutline} onClick={() => { setEditingId(null); setFormData({ name: '', slug: '', icon: '🏷️', desc: '' }); }}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className={styles.listCard}>
          <h2 className={styles.cardTitle}>Current Categories</h2>
          {loading ? <p>Loading...</p> : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td className={styles.iconCell}>{cat.icon}</td>
                      <td className={styles.boldCell}>{cat.name}</td>
                      <td className={styles.slugCell}>{cat.slug}</td>
                      <td>
                        <button onClick={() => handleEdit(cat)} className={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(cat._id)} className={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr><td colSpan="4" className={styles.empty}>No categories found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
