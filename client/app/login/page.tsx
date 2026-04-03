'use client';
import { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './Auth.module.css';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding">
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.desc}>Login to your account to manage orders and addresses.</p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className={styles.foot}>
          Don't have an account? <Link href={`/register?redirect=${redirect}`}>Sign Up</Link>
        </p>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button 
          onClick={() => alert('Google login will be connected once you provide the Google Client ID!')}
          className={styles.googleBtn}
        >
          <img src="/images/google-icon.png" alt="G" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container section-padding">Loading login form...</div>}>
      <LoginForm />
    </Suspense>
  );
}
