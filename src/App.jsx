import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import InteractiveMap from './components/InteractiveMap';
import AITutor from './components/AITutor';
import Quizzes from './features/Quizzes';
import Auth from './components/Auth';

function App() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return (
      <MainLayout>
        <div className="container" style={{ paddingTop: '120px' }}>
          <Auth />
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => setShowAuth(false)} className="btn btn-secondary">
              ← Вернуться на главную
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout onAuthClick={() => setShowAuth(true)}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slideshow">
          <div className="hero-slide" style={{ backgroundImage: 'url(/src/assets/kaz_landscape_1.png)' }}></div>
          <div className="hero-slide" style={{ backgroundImage: 'url(/src/assets/kaz_landscape_2.png)' }}></div>
          <div className="hero-slide" style={{ backgroundImage: 'url(/src/assets/kaz_landscape_3.png)' }}></div>
        </div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="animate-up">
            <span className="hero-tag">Новая эра обучения</span>
            <h1>Исследуйте Географию <span>Казахстана</span></h1>
            <p className="hero-subtitle">
              Интеллектуальная образовательная платформа, объединяющая передовые технологии картографии и искусственный интеллект для изучения родного края.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <a href="#map" className="btn btn-primary">Начать исследование</a>
              <button onClick={() => setShowAuth(true)} className="btn btn-secondary">Личный кабинет</button>
            </div>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-card">
              <div className="stat-number">17</div>
              <div className="stat-label">Основных областей</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2.7М</div>
              <div className="stat-label">Квадратных километров</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">20М+</div>
              <div className="stat-label">Жителей страны</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map">
        <div className="container">
          <div className="section-header">
            <h2>Интерактивный Атлас</h2>
            <p>Откройте для себя богатство каждого региона через детальную визуализацию и актуальные данные.</p>
          </div>
          <InteractiveMap />
        </div>
      </section>

      {/* AI Tutor Section */}
      <section id="tutor" className="tutor-section">
        <div className="container">

          <AITutor />
        </div>
      </section>

      {/* Quizzes Section */}
      <section id="quizzes">
        <div className="container">
          <div className="section-header">
            <h2>Проверка Знаний</h2>
            <p>Закрепите изученный материал с помощью наших интерактивных тестов и викторин.</p>
          </div>
          <Quizzes />
        </div>
      </section>
    </MainLayout>
  );
}

export default App;
