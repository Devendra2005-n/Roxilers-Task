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
    <>
      <video className="video-background" autoPlay loop muted playsInline>
        <source src="/h2.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay" />
      
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        {/* Left Side: Brand & Marketing Text */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10%', color: 'white', zIndex: 1, '@media(max-width: 768px)': { display: 'none' } } as any}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: '4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-2px', marginBottom: '1.5rem', lineHeight: 1 }}>
              NEON <span style={{ color: 'var(--color-primary)' }}>RATED</span><br/>STORE
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '450px', lineHeight: 1.6, marginBottom: '3rem' }}>
              The ultimate cinematic store management platform. Discover premium products, manage your inventory with ease, and elevate your retail experience.
            </p>
            
            <div style={{ display: 'flex', gap: '3rem' }}>
              <div>
                <h3 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '0.25rem', lineHeight: 1 }}>10k+</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Users</p>
              </div>
              <div>
                <h3 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '0.25rem', lineHeight: 1 }}>500+</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Stores</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Login Box */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', zIndex: 1 }}>
          <motion.div 
            className="glass-panel" 
            style={{ padding: '3rem', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'white', fontSize: '2rem', fontWeight: 700 }}>Welcome Back</h2>
            <p style={{ textAlign: 'center', marginBottom: '2.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>Sign in to continue to your dashboard</p>
            
            {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="input-glass"
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', fontSize: '1rem' }}
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="input-glass"
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', fontSize: '1rem' }}
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn" style={{ width: '100%', padding: '1.1rem', marginTop: '1rem', background: 'var(--color-primary)', color: 'white', fontSize: '1rem', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
                LOGIN TO DASHBOARD
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
              Don't have an account? <Link to="/signup" style={{ color: 'white', fontWeight: 600, borderBottom: '1px solid var(--color-primary)', paddingBottom: '2px' }}>Sign up</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
