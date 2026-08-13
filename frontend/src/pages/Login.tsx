import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await client.post('/auth/login', { email, password });
      login(res.data.accessToken, res.data.user);
      
      if (res.data.user.role === 'ADMIN') navigate('/admin');
      else if (res.data.user.role === 'STORE_OWNER') navigate('/owner');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
      <motion.div 
        className="glass-panel" 
        style={{ padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '420px' }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'white', fontSize: '1.8rem' }}>Welcome Back</h2>
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="input-glass"
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px' }}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="input-glass"
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px' }}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', background: 'var(--color-primary)', color: 'white', fontSize: '1rem' }}>
            Login to Dashboard
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};
