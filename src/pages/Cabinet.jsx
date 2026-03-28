import React from 'react';
import PersonalCabinet from '../components/PersonalCabinet';
import { useGameState } from '../context/GameStateContext';
import Auth from '../components/Auth';

const Cabinet = () => {
  const { isLoggedIn, t, language } = useGameState();

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>{isLoggedIn === false ? (language === 'kz' ? 'Кабинетті кöру үшін жүйеңіз' : 'Войдите, чтобы увидеть свой кабинет') : ''}</h2>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Auth />
        </div>
      </div>
    );
  }

  return (
    <>
      <PersonalCabinet />
    </>
  );
};

export default Cabinet;
