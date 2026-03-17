import React from 'react';
import { useGameState } from '../context/GameStateContext';

const Achievements = () => {
  const { achievements, t } = useGameState();

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" style={{ padding: '4rem 0' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>{t.achievements}</h2>
          <p>{t.testKnowledgeDesc}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {achievements.map((achievement) => {
            const info = t.achievementsList[achievement.id] || { title: achievement.title, desc: achievement.description };
            return (
              <div key={achievement.id} className="achievement-card glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem' }}>
                <div className="achievement-icon" style={{ fontSize: '2.5rem' }}>
                  {achievement.id === 'first_quiz' ? '🔰' : 
                   achievement.id === 'perfect_score' ? '🎓' : 
                   achievement.id === 'level_5' ? '🧭' : 
                   achievement.id === 'all_regions' ? '🗺️' : 
                   achievement.id === 'streak_3' ? '🔥' : '🏆'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{info.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{info.desc}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: '700' }}>
                    {t.unlocked.toUpperCase()}: {achievement.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
