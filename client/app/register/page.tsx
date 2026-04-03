'use client';
import { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/Auth.module.css';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding">
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.desc}>Join Baby Mart and shop the best for your kids.</p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              placeholder="example@mail.com" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            {loading ? 'Creating Account...' : 'Continue'}
          </button>
        </form>

        <p className={styles.foot}>
          Already have an account? <Link href={`/login?redirect=${redirect}`}>Login</Link>
        </p>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container section-padding">Loading registration form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
