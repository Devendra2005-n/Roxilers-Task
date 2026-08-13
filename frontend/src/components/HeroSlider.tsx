import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: 'LEVITICUS',
    videoUrl: '/h1.mp4',
    color: '#93c5fd'
  },
  {
    id: 2,
    title: 'SHEEP IN THE BOX',
    videoUrl: '/h2.mp4',
    color: '#fef08a'
  },
  {
    id: 3,
    title: 'I LOVE BOOSTERS',
    videoUrl: '/h3.mp4',
    color: '#22d3ee'
  },
  {
    id: 4,
    title: 'HOKUM',
    videoUrl: '/h4.mp4',
    color: '#f87171'
  },
  {
    id: 5,
    title: 'EXIT 8',
    videoUrl: 'h5.mp4',
    color: '#a78bfa'
  },
  {
    id: 6,
    title: 'THE CHRISTOPHERS',
    videoUrl: '/h6.mp4',
    color: '#f97316'
  },
  {
    id: 7,
    title: 'EPIC: IN CONCERT',
    videoUrl: '/h7.mp4',
    color: '#10b981'
  },
  {
    id: 8,
    title: 'ALPHA',
    videoUrl: '/h8.mp4',
    color: '#f43f5e'
  },
  {
    id: 9,
    title: 'NIRVANNA',
    videoUrl: '/h9.mp4',
    color: '#e879f9'
  }
];

export const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '80vh',
      minHeight: '700px',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      marginTop: '-2rem',
      marginBottom: '3rem',
      overflow: 'hidden'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          <video
            src={slides[currentIndex].videoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />
          
          <div className="container" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ 
                fontSize: 'clamp(4rem, 8vw, 8rem)', 
                lineHeight: 0.9, 
                color: slides[currentIndex].color,
                textTransform: 'uppercase',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                textShadow: '0 4px 24px rgba(0,0,0,0.5)'
              }}
            >
              {slides[currentIndex].title}
            </motion.h1>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '0.5rem', zIndex: 10 }}>
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? '2rem' : '0.5rem',
              height: '0.5rem',
              borderRadius: '1rem',
              background: idx === currentIndex ? slide.color : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
