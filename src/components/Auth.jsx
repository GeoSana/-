import React, { useState } from 'react';
import { useGameState } from '../context/GameStateContext';

const Auth = ({ onSuccess }) => {
  const { login } = useGameState();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Update global state
      login({ 
        email, 
        name: isLogin ? email.split('@')[0] : name,
        id: Math.random().toString(36).substr(2, 9)
      });

      setMessage(isLogin ? 'Вход выполнен успешно!' : 'Аккаунт успешно создан!');
      
      // Close modal after showing success message
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="auth-container animate-up">
      <div className="glass-card auth-card" style={{ 
        padding: '4rem 3rem', 
        width: '100%', 
        maxWidth: '480px',
        borderColor: 'rgba(14, 165, 233, 0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(14, 165, 233, 0.1)'
      }}>
        <h2 className="font-serif" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>
          {isLogin ? 'С возвращением' : 'Присоединяйтесь'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem' }}>
          {isLogin ? 'Авторизуйтесь для доступа к вашему прогрессу' : 'Создайте аккаунт и начните свое исследование сегодня'}
        </p>

        {message && (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(16, 185, 129, 0.1)', 
            color: '#10b981', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2rem', 
            textAlign: 'center',
            fontWeight: '600',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            {message}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>ПОЛНОЕ ИМЯ</label>
              <input 
                type="text" 
                placeholder="Имя Фамилия" 
                className="chat-input"
                style={{ width: '100%', padding: '0.85rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>ЭЛЕКТРОННАЯ ПОЧТА</label>
            <input 
              type="email" 
              placeholder="example@qazaqgeo.kz" 
              className="chat-input"
              style={{ width: '100%', padding: '0.85rem' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>ПАРОЛЬ</label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              className="chat-input"
              style={{ width: '100%', padding: '0.85rem' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className={`btn btn-primary ${loading ? 'loading' : ''}`} 
            style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Обработка...' : (isLogin ? 'Войти в систему' : 'Зарегистрироваться')}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? 'Впервые в QazaqGeo?' : 'Уже зарегистрированы?'} 
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '700', marginLeft: '0.5rem', textDecoration: 'underline' }}
          >
            {isLogin ? 'Создать аккаунт' : 'Войти'}
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem 1.5rem !important;
          }
          .auth-card h2 {
            font-size: 1.75rem !important;
          }
          .auth-card p {
            font-size: 0.9rem !important;
            margin-bottom: 1.5rem !important;
          }
        }
      `}</style>
    </div>

  );
};

export default Auth;
