import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children, onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="main-layout">
      <Navbar onAuthClick={onAuthClick} isScrolled={isScrolled} />
      
      <main>
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-info">
              <div className="footer-logo">
                Qazaq<span>Geo</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
                Первая инновационная платформа для глубокого изучения истории и географии Казахстана через интерактивный опыт.
              </p>
            </div>
            
            <div className="footer-links">
              <h4>Навигация</h4>
              <a href="#map">Карта</a>
              <a href="#tutor">ИИ-Тьютор</a>
              <a href="#quizzes">Квизы</a>
            </div>
            
            <div className="footer-links">
              <h4>Поддержка</h4>
              <a href="#">Документация</a>
              <a href="#">Контакты</a>
              <a href="#">О проекте</a>
            </div>
            
            <div className="footer-links">
              <h4>Правовая информация</h4>
              <a href="#">Конфиденциальность</a>
              <a href="#">Условия использования</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} QazaqGeo Learn. Совершенство в образовании.</p>
            <div className="social-links">
              {/* Social icons could go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
