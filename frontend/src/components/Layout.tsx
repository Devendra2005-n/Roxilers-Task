import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <video className="video-background" autoPlay loop muted playsInline>
        <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay" />
      
      <div className="app-layout">
        <nav className="glass-nav">
          <div className="navbar-brand">
            <Link to="/" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px', color: 'white', textTransform: 'uppercase' }}>
              NEON <span style={{ color: 'var(--color-primary)' }}>RATED</span> STORE
            </Link>
          </div>
          {user && (
            <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '2rem', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                <UserIcon size={16} color="var(--color-primary)" /> 
                {user.name} 
                <span style={{ fontSize: '0.7rem', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '2px 8px', marginLeft: '8px' }}>
                  {user.role.replace('_', ' ')}
                </span>
              </span>
              <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>
                LOGOUT
              </button>
            </div>
          )}
        </nav>
        <main className="main-content container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </>
  );
};
