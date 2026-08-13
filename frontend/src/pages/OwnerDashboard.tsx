import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Store as StoreIcon, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroSlider } from '../components/HeroSlider';

export const OwnerDashboard = () => {
  const [data, setData] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      const res = await client.get('/owner/dashboard');
      setData(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) return <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Loading...</div>;

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ padding: '0 1rem' }}>
      <HeroSlider />
      <motion.h1 variants={itemVariants} style={{ marginBottom: '2rem', color: 'white', fontSize: '2.5rem' }}>Store Analytics</motion.h1>
      
      {!data.store ? (
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', textAlign: 'center' }}>
          <StoreIcon size={64} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>No Store Assigned</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>You have not been assigned to manage a store yet.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.5rem', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Store Profile</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '1.25rem', borderRadius: '50%' }}>
                <StoreIcon size={40} color="var(--color-primary)" />
              </div>
              <div>
                <h2 style={{ margin: 0, color: 'white', fontSize: '1.8rem' }}>{data.store.name}</h2>
                <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8' }}>{data.store.address}</p>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#94a3b8' }}>Contact Email</span>
                <span style={{ color: 'white', fontWeight: 500 }}>{data.store.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Store ID</span>
                <span style={{ color: 'white', fontWeight: 500, fontFamily: 'monospace', fontSize: '0.85rem' }}>{data.store.id.split('-')[0]}...</span>
              </div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.5rem', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Performance Overview</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
              <div style={{ textAlign: 'center', flex: 1, background: 'rgba(245, 158, 11, 0.1)', padding: '2rem 1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{data.averageRating.toFixed(1)}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', margin: '1rem 0' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={24} fill={i <= Math.round(data.averageRating) ? 'var(--color-star)' : 'rgba(255,255,255,0.1)'} color={i <= Math.round(data.averageRating) ? 'var(--color-star)' : 'transparent'} />)}
                </div>
                <div style={{ color: '#fbbf24', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Average Rating</div>
              </div>
              
              <div style={{ textAlign: 'center', flex: 1, background: 'rgba(59, 130, 246, 0.1)', padding: '2rem 1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{data.totalRatings}</div>
                <div style={{ color: '#60a5fa', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem', marginTop: '1.5rem' }}>Total Reviews</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
