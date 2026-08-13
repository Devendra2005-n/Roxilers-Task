import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { motion } from 'framer-motion';

export const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/auth/signup', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      if (Array.isArray(err.response?.data?.errors)) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError(err.response?.data?.message || 'Signup failed');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
      <motion.div 
        className="glass-panel" 
        style={{ padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '480px' }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'white', fontSize: '1.8rem' }}>Create an Account</h2>
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>Account created! Redirecting to login...</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Name (20-60 chars)</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required minLength={20} maxLength={60}
              className="input-glass"
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              required 
              className="input-glass"
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={formData.password} 
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              required 
              className="input-glass"
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px' }}
            />
            <small style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.75rem', color: '#94a3b8' }}>8-16 chars, 1 uppercase, 1 special char</small>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Address</label>
            <textarea 
              value={formData.address} 
              onChange={e => setFormData({ ...formData, address: e.target.value })} 
              required maxLength={400}
              className="input-glass"
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', minHeight: '80px', resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', background: 'var(--color-primary)', color: 'white', fontSize: '1rem' }}>
            Sign Up
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
};
