import React from 'react';
import InteractiveMap from '../components/InteractiveMap';
import DemographicsChart from '../components/DemographicsChart';
import kaz1 from '../assets/kaz_landscape_1.png';
import kaz2 from '../assets/kaz_landscape_2.png';
import kaz3 from '../assets/kaz_landscape_3.png';
import kazBg from '../assets/kaz_background.png';
import { useGameState } from '../context/GameStateContext';

const Home = ({ onAuthClick }) => {
  const { isLoggedIn, t, language } = useGameState();

  return (
    <>
      <section className="hero">
        <div className="hero-slideshow">
          <div className="hero-slide" style={{ backgroundImage: `url(${kazBg})` }}></div>
          <div className="hero-slide" style={{ backgroundImage: `url(${kaz1})` }}></div>
          <div className="hero-slide" style={{ backgroundImage: `url(${kaz2})` }}></div>
          <div className="hero-slide" style={{ backgroundImage: `url(${kaz3})` }}></div>
        </div>

        <div className="hero-overlay"></div>
        <div className="container">
          <div className="animate-up">
            <span className="hero-tag">{t.popularDestinations}</span>
            <h1>Geo<span>Sana</span></h1>
            <p className="hero-subtitle">
              {t.subtitle}
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <a href="#map" className="btn btn-primary">{t.startExploring}</a>
              {isLoggedIn ? (
                <a href="/cabinet" className="btn btn-secondary">{t.cabinet}</a>
              ) : (
                <button onClick={onAuthClick} className="btn btn-secondary">{t.cabinet}</button>
              )}
            </div>
          </div>

          <div className="hero-stats animate-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-card">
              <div className="stat-number">17</div>
              <div className="stat-label">{language === 'kz' ? 'Негізгі облыстар' : 'Основных областей'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2.7М</div>
              <div className="stat-label">{language === 'kz' ? 'Шаршы шақырым' : 'Квадратных километров'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">20М+</div>
              <div className="stat-label">{language === 'kz' ? 'Ел тұрғындары' : 'Жителей страны'}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="map">
        <div className="container">
          <div className="section-header">
            <h2>{t.regionsTitle}</h2>
            <p>{t.regionsDesc}</p>
          </div>
          <InteractiveMap />
        </div>
      </section>

      <div className="container">
        <DemographicsChart />
      </div>
    </>
  );
};

export default Home;
