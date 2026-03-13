import React, { useState } from 'react';

const Navbar = ({ onAuthClick, isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={isScrolled ? 'scrolled' : ''}>
      <div className="container nav-content">
        <a href="/" className="logo">
          Qazaq<span>Geo</span>
        </a>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#map" onClick={() => setIsMobileMenuOpen(false)}>Регионы</a>
          <a href="#tutor" onClick={() => setIsMobileMenuOpen(false)}>ИИ-Наставник</a>
          <a href="#quizzes" onClick={() => setIsMobileMenuOpen(false)}>Тестирование</a>

          <button 
            onClick={() => {
              onAuthClick();
              setIsMobileMenuOpen(false);
            }} 
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
          >
            Войти
          </button>
        </div>

        <button 
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ display: 'none' }}
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div 
          className="menu-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000
          }}
        />
      )}
    </nav>

  );
};

export default Navbar;
