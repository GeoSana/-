import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

  return (
    <Router>
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
          <div className="modal-overlay" onClick={() => setShowAuth(false)} style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)'
          }}>
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <button className="auth-close-btn" onClick={() => setShowAuth(false)} style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none',
                border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', zIndex: 10, opacity: 0.5
              }}>×</button>
              <Auth onSuccess={() => setShowAuth(false)} />
            </div>
          </div>
        )}

        <AITutor />
      </MainLayout>
    </Router>
  );
}

export default App;
