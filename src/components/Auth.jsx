import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container animate-up" style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div className="glass-card auth-card" style={{ padding: '3.5rem', width: '100%', maxWidth: '480px' }}>
        <h2 className="font-serif" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>
          {isLogin ? 'С возвращением' : 'Присоединяйтесь'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem' }}>
          {isLogin ? 'Авторизуйтесь для доступа к вашему прогрессу' : 'Создайте аккаунт и начните свое исследование сегодня'}
        </p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>ПОЛНОЕ ИМЯ</label>
              <input 
                type="text" 
                placeholder="Имя Фамилия" 
                className="chat-input"
                style={{ width: '100%', padding: '0.85rem' }}
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
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>ПАРОЛЬ</label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              className="chat-input"
              style={{ width: '100%', padding: '0.85rem' }}
            />
          </div>

          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}>
            {isLogin ? 'Войти в систему' : 'Зарегистрироваться'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? 'Впервые в QazaqGeo?' : 'Уже зарегистрированы?'} 
          <button 
            onClick={() => setIsLogin(!isLogin)}
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
