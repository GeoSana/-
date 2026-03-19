import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AITutor from './components/AITutor';
import AchievementPopup from './components/AchievementPopup';
import Home from './pages/Home';
import Cabinet from './pages/Cabinet';
import QuizPage from './pages/QuizPage';
import Auth from './components/Auth';
import { useGameState } from './context/GameStateContext';

function App() {
  const [showAuth, setShowAuth] = useState(false);

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
