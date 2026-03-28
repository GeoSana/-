import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useGameState } from '../context/GameStateContext';

const MainLayout = ({ children, onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language } = useGameState();

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
                Geo<span>Sana</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
                {language === 'kz'
                  ? 'Қазақстанның тарихы мен географиясын интерактивті тәсілмен тереңінен зерттеуге арналған алғашқы инновациялық платформа.'
                  : 'Первая инновационная платформа для глубокого изучения истории и географии Казахстана через интерактивный опыт.'}
              </p>
            </div>
            
            <div className="footer-links">
              <h4>{language === 'kz' ? 'Навигация' : 'Навигация'}</h4>
              <Link to="/">{language === 'kz' ? 'Карта' : 'Карта'}</Link>
              <Link to="/quizzes">{language === 'kz' ? 'Викториналар' : 'Квизы'}</Link>
            </div>
            
            <div className="footer-links">
              <h4>{language === 'kz' ? 'Қолдау' : 'Поддержка'}</h4>
              <Link to="#">{language === 'kz' ? 'Құжаттама' : 'Документация'}</Link>
              <Link to="#">{language === 'kz' ? 'Байланыс' : 'Контакты'}</Link>
              <Link to="#">{language === 'kz' ? 'Жоба туралы' : 'О проекте'}</Link>
            </div>
            
            <div className="footer-links">
              <h4>{language === 'kz' ? 'Құқықтық ақпарат' : 'Правовая информация'}</h4>
              <a href="#">{language === 'kz' ? 'Құпиялылық' : 'Конфиденциальность'}</a>
              <a href="#">{language === 'kz' ? 'Пайдалану шарттары' : 'Условия использования'}</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} GeoSana. {language === 'kz' ? 'Білімдегі жетістік.' : 'Совершенство в образовании.'}</p>
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
