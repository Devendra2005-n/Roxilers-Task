import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Star, Search } from 'lucide-react';
import { InstagramIcon, TwitterIcon, FacebookIcon, YoutubeIcon, TiktokIcon } from '../components/SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSlider } from '../components/HeroSlider';

interface Store {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  totalRatings: number;
}

export const UserDashboard = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; storeId: string; value: number }>({ isOpen: false, storeId: '', value: 5 });

  const fetchStores = async () => {
    try {
      const res = await client.get('/stores', { params: { search, sortBy, order } });
      setStores(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, order]);

  const submitRating = async () => {
    try {
      await client.post(`/stores/${ratingModal.storeId}/ratings`, { value: ratingModal.value });
      setRatingModal({ ...ratingModal, isOpen: false });
      fetchStores();
    } catch (e: any) {
      if (e.response?.status === 409) {
        // Try update if conflict
        await client.put(`/stores/${ratingModal.storeId}/ratings`, { value: ratingModal.value });
        setRatingModal({ ...ratingModal, isOpen: false });
        fetchStores();
      } else {
        alert(e.response?.data?.message || 'Failed to submit rating');
      }
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ padding: '0 1rem' }}>
      <HeroSlider />
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem' }}>Discover Stores</h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search stores..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="input-glass with-icon"
              style={{ borderRadius: '8px', width: '250px' }} 
            />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-glass" style={{ padding: '0.75rem', borderRadius: '8px', appearance: 'none', cursor: 'pointer' }}>
            <option value="name" style={{color: 'black'}}>Sort by Name</option>
            <option value="average_rating" style={{color: 'black'}}>Sort by Rating</option>
          </select>
          <select value={order} onChange={e => setOrder(e.target.value as any)} className="input-glass" style={{ padding: '0.75rem', borderRadius: '8px', appearance: 'none', cursor: 'pointer' }}>
            <option value="ASC" style={{color: 'black'}}>Ascending</option>
            <option value="DESC" style={{color: 'black'}}>Descending</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {stores.map(store => (
            <motion.div key={store.id} variants={itemVariants} layout className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{store.name}</h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{store.address}</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Star fill="var(--color-star)" color="var(--color-star)" size={24} />
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{store.averageRating.toFixed(1)}</span>
                  <span style={{ color: '#94a3b8', fontSize: '1rem' }}>/ 5</span>
                </div>
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Based on {store.totalRatings} reviews</div>
              </div>
              <button className="btn" onClick={() => setRatingModal({ isOpen: true, storeId: store.id, value: 5 })} style={{ width: '100%', background: 'var(--color-primary)', color: 'white', padding: '1rem' }}>Rate Store</button>
            </motion.div>
          ))}
        </AnimatePresence>
        {stores.length === 0 && <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>No stores found.</p>}
      </motion.div>

      {/* Merch Arrivals */}
      <motion.div variants={itemVariants} style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>NEW MERCH ARRIVALS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: '#111', borderRadius: '4px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="/im1.png" alt="Hat" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem', letterSpacing: '1px' }}>MEN FORMAL'S</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>$30</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'white', color: 'black', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800, zIndex: 10 }}>SOLD OUT</div>
            <div style={{ background: '#111', borderRadius: '4px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="/strriped_tshirt.avif" alt="Axe" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem', letterSpacing: '1px' }}>STRRIPED T SHIRT</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>$250</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'white', color: 'black', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800, zIndex: 10 }}>PRE-ORDER NOW</div>
            <div style={{ background: '#111', borderRadius: '4px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="/topwear_3.avif" alt="Book" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem', letterSpacing: '1px' }}>TOP WEAR</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>$35</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: '#111', borderRadius: '4px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="/R.jpeg" alt="Bath Bomb" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem', letterSpacing: '1px' }}>WINTER COLLECTION</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>$30</div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Newsletter Section */}
      <motion.div variants={itemVariants} style={{ 
        position: 'relative', 
        height: '350px', 
        overflow: 'hidden', 
        marginBottom: '4rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        padding: '2.5rem',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        borderRadius: 0
      }}>
        <video 
          src="news.mp4" 
          autoPlay loop muted playsInline 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, filter: 'brightness(0.6)' }}
        />
        <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px', margin: 0 }}>
          <span style={{ color: 'transparent', WebkitTextStroke: '1px white' }}>NEON</span> NEWSLETTER
        </h2>
        
        <div style={{ position: 'relative', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: '0.5rem' }}>
          <input 
            type="email" 
            placeholder="ENTER YOUR EMAIL ADDRESS" 
            className="newsletter-input"
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', outline: 'none', paddingRight: '40px' }} 
          />
          <style>{`.newsletter-input::placeholder { color: rgba(255, 255, 255, 0.7); font-weight: 700; text-transform: uppercase; }`}</style>
          <button style={{ position: 'absolute', right: 0, bottom: '0.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8, padding: '0.2rem', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </motion.div>

      {/* Footer Section */}
      <motion.div variants={itemVariants} style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '0', 
        marginBottom: '0',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        background: '#111'
      }}>
        
        {/* SHOP Column */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', borderRadius: 0, border: 'none', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2.5rem', textTransform: 'uppercase' }}>SHOP</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['All', 'Apparel', 'Collectibles', 'Posters', 'Bags', 'Toys', 'Blu-Ray'].map(link => (
              <li key={link}><a href="#" style={{ color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 500 }}>{link}</a></li>
            ))}
          </ul>
        </div>

        {/* NEON Column */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', borderRadius: 0, border: 'none', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2.5rem', textTransform: 'uppercase' }}>NEON</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Home', 'FAQs', 'Shipping & Returns', 'Terms of Use', 'Privacy Policy', 'Cookie Policy', 'Contact', 'Host a Screening', 'About'].map(link => (
              <li key={link}><a href="#" style={{ color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 500 }}>{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Socials Grid */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '50%' }}>
            <a href="#" className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', transition: 'background 0.3s', borderRadius: 0, border: 'none', borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <InstagramIcon size={36} color="white" />
            </a>
            <a href="#" className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', transition: 'background 0.3s', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <TiktokIcon size={36} color="white" />
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '50%' }}>
            <a href="#" className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', transition: 'background 0.3s', borderRadius: 0, border: 'none', borderRight: '1px solid rgba(255,255,255,0.05)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <TwitterIcon size={32} color="white" />
            </a>
            <a href="#" className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', transition: 'background 0.3s', borderRadius: 0, border: 'none', borderRight: '1px solid rgba(255,255,255,0.05)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <FacebookIcon size={32} color="white" />
            </a>
            <a href="#" className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', transition: 'background 0.3s', borderRadius: 0, border: 'none' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <YoutubeIcon size={32} color="white" />
            </a>
          </div>
        </div>

      </motion.div>

      {/* Rating Modal */}
      {ratingModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', width: '90%', maxWidth: '380px', textAlign: 'center' }}>
            <h3 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.8rem' }}>Leave a Rating</h3>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingModal({ ...ratingModal, value: star })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Star size={40} fill={star <= ratingModal.value ? 'var(--color-star)' : 'transparent'} color={star <= ratingModal.value ? 'var(--color-star)' : 'rgba(255,255,255,0.3)'} />
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn" onClick={() => setRatingModal({ ...ratingModal, isOpen: false })} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
              <button className="btn" onClick={submitRating} style={{ flex: 1, background: 'var(--color-primary)', color: 'white', padding: '1rem' }}>Submit</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
