import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';

const Navbar = ({ onAuthClick, isScrolled }) => {
  const location = useLocation();
  const { level, levelTitle, xp, coins, xpForNextLevel, progressInLevel, isLoggedIn, user, logout, language, setLanguage, t } = useGameState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <nav className={`${isScrolled ? 'scrolled shadow-lg' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="container nav-content">
        <div className="nav-brand">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            Geo<span>Sana</span>
          </Link>
          
          <div className="nav-stats-mobile">
            <div className="nav-level-badge">
              <div className="level-num">LVL {level}</div>
              <div className="xp-progress">
                <div className="xp-bar" style={{ width: `${progressInLevel}%` }}></div>
              </div>
            </div>

            {isLoggedIn && (
              <div className="nav-coins">
                <span>💰</span>
                <span>{coins}</span>
              </div>
            )}
          </div>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
        >
          <span className={`bar ${isMenuOpen ? 'bar-open-1' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'bar-open-2' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'bar-open-3' : ''}`}></span>
        </button>

        {/* Backdrop - closes menu when tapping outside */}
        {isMenuOpen && (
          <div
            className="nav-backdrop"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>{t.map}</Link>
          <Link to="/quizzes" className={location.pathname === '/quizzes' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>{t.quizzes}</Link>

          <div className="lang-toggle-wrapper">
            <div className="lang-toggle">
              <button 
                onClick={() => { setLanguage('ru'); setIsMenuOpen(false); }} 
                className={language === 'ru' ? 'active' : ''}
              >
                RU
              </button>
              <button 
                onClick={() => { setLanguage('kz'); setIsMenuOpen(false); }} 
                className={language === 'kz' ? 'active' : ''}
              >
                KZ
              </button>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="nav-user-area">
              <Link to="/cabinet" className="nav-cabinet-link" onClick={() => setIsMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="nav-user-name">{user?.name || t.cabinet}</span>
              </Link>
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }} 
                className="btn btn-secondary btn-sm"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { onAuthClick(); setIsMenuOpen(false); }} 
              className="btn btn-primary btn-sm"
            >
              {t.login}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
