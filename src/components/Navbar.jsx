import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';

const Navbar = ({ onAuthClick, isScrolled }) => {
  const location = useLocation();
  const { level, levelTitle, xp, coins, xpForNextLevel, progressInLevel, isLoggedIn, user, logout, language, setLanguage, t } = useGameState();

  return (
    <nav className={isScrolled ? 'scrolled shadow-lg' : ''}>
      <div className="container nav-content">
        <div className="nav-brand">
          <Link to="/" className="logo">
            Geo<span>Sana</span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="nav-level-badge">
              <div className="level-num">LVL {level}</div>
              <div className="xp-progress">
                <div className="xp-bar" style={{ width: `${progressInLevel}%` }}></div>
                <span className="xp-tooltip">{levelTitle} • {xp}/{xpForNextLevel} XP</span>
              </div>
            </div>

            {isLoggedIn && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px', 
                background: 'rgba(255, 215, 0, 0.1)', 
                padding: '4px 10px', 
                borderRadius: '15px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: 'gold'
              }}>
                <span>💰</span>
                <span>{coins}</span>
              </div>
            )}
          </div>
        </div>

        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t.map}</Link>
          <Link to="/quizzes" className={location.pathname === '/quizzes' ? 'active' : ''}>{t.quizzes}</Link>

          <div className="lang-toggle" style={{ display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setLanguage('ru')} 
              className={language === 'ru' ? 'active' : ''}
              style={{ 
                border: 'none', 
                background: language === 'ru' ? 'var(--primary)' : 'transparent', 
                color: 'white', 
                borderRadius: '15px', 
                padding: '2px 8px', 
                fontSize: '0.7rem', 
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              RU
            </button>
            <button 
              onClick={() => setLanguage('kz')} 
              className={language === 'kz' ? 'active' : ''}
              style={{ 
                border: 'none', 
                background: language === 'kz' ? 'var(--primary)' : 'transparent', 
                color: 'white', 
                borderRadius: '15px', 
                padding: '2px 8px', 
                fontSize: '0.7rem', 
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              KZ
            </button>
          </div>

          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/cabinet" style={{ fontWeight: '700', color: 'var(--primary)' }}>
                {user?.name || t.cabinet}
              </Link>
              <button 
                onClick={() => logout()} 
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', opacity: 0.8 }}
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAuthClick()} 
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
            >
              {isLoggedIn ? t.cabinet : t.logout?.replace('Выйти', 'Войти')}
            </button>
          )}
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
