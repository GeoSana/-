import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AITutor from './components/AITutor';
import AchievementPopup from './components/AchievementPopup';
import Home from './pages/Home';
import Cabinet from './pages/Cabinet';
import QuizPage from './pages/QuizPage';
import QuizBuilder from './pages/QuizBuilder';
import Auth from './components/Auth';

function App() {
  const [showAuth, setShowAuth] = useState(false);

  const IS_MAINTENANCE_MODE = false;

  if (IS_MAINTENANCE_MODE) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', color: '#1f2937', textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2563eb', fontWeight: 'bold' }}>Сайт временно недоступен 🚧</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', lineHeight: '1.6', color: '#4b5563' }}>
          Мы проводим плановые технические работы, чтобы улучшить платформу GeoSana.
          Пожалуйста, зайдите к нам немного позже. Спасибо за понимание!
        </p>
      </div>
    );
  }

  // Determine basename dynamically to work both on root and subfolder (/-)
  const basename = window.location.pathname.startsWith('/-') ? '/-' : '';

  return (
    <BrowserRouter basename={basename}>
      <AchievementPopup />
      <MainLayout onAuthClick={() => setShowAuth(true)}>
        <Routes>
          <Route path="/" element={<Home onAuthClick={() => setShowAuth(true)} />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/quizzes" element={<QuizPage />} />
          <Route path="/create" element={<QuizBuilder />} />
          <Route path="/auth" element={
            <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
              <Auth onSuccess={() => window.history.back()} />
            </div>
          } />
        </Routes>

        {showAuth && (
          <div className="modal-overlay" onClick={() => setShowAuth(false)}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <button className="auth-close-btn" onClick={() => setShowAuth(false)}>×</button>
              <Auth onSuccess={() => setShowAuth(false)} />
            </div>
          </div>
        )}

        <AITutor />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
