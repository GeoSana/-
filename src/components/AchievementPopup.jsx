import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useGameState } from '../context/GameStateContext';

const AchievementPopup = () => {
  const { lastUnlocked, clearAchievementNotification, t, language, levelTitle } = useGameState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastUnlocked) {
      setVisible(true);
      
      const isLevelUp = lastUnlocked.id?.startsWith('level_');
      const duration = isLevelUp ? 6 * 1000 : 4 * 1000;
      
      if (isLevelUp) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ffffff', '#ff8c00']
        });
      }

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(clearAchievementNotification, 500);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [lastUnlocked, clearAchievementNotification]);

  if (!lastUnlocked || !visible) return null;

  const isLevelUp = lastUnlocked.id?.startsWith('level_');

  return (
    <div className="achievement-popup-wrapper" style={{
      position: 'fixed',
      bottom: '40px',
      right: '40px',
      zIndex: 10001,
      pointerEvents: 'none'
    }}>
      <div className="achievement-popup-content animate-right" style={{ pointerEvents: 'auto' }}>
        <div className="glass-card" style={{
          padding: '1.2rem 2rem',
          border: `2px solid ${isLevelUp ? '#ffd700' : 'var(--primary)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: `0 10px 40px ${isLevelUp ? 'rgba(255, 215, 0, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          minWidth: '350px'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            background: isLevelUp ? 'linear-gradient(45deg, #ffd700, #ff8c00)' : 'linear-gradient(45deg, #0ea5e9, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
          }}>
            {isLevelUp ? '👑' : '🏆'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              color: isLevelUp ? '#ffd700' : 'var(--primary)', 
              fontWeight: '800', 
              fontSize: '0.65rem', 
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.2rem'
            }}>
              {isLevelUp ? (language === 'kz' ? 'ЖАҢА ДЕҢГЕЙ' : 'НОВЫЙ УРОВЕНЬ') : t.unlocked}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{lastUnlocked.title}</h3>
            {isLevelUp && (
               <div style={{ color: '#ffd700', fontSize: '0.9rem', fontWeight: '700', marginTop: '0.1rem' }}>
                  {levelTitle}
               </div>
            )}
            {!isLevelUp && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{lastUnlocked.description}</p>}
          </div>
          <button 
            onClick={() => {
              setVisible(false);
              setTimeout(clearAchievementNotification, 500);
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              opacity: 0.5, 
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0.5rem'
            }}
          >×</button>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
