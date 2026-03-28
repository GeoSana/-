import React, { useState } from 'react';
import { useGameState } from '../context/GameStateContext';
const PersonalCabinet = () => {
  const { xp, level, levelTitle, progressInLevel, xpForNextLevel, discoveredRegions, achievements, user, isLoggedIn, t, language, streak, quests } = useGameState();

  if (!isLoggedIn) return null;

  return (
    <section id="cabinet" className="cabinet-section animate-up">
      <div className="container">
        <div className="cabinet-header">
          <div className="cabinet-title-area">
            <h2 className="cabinet-title">{t?.cabinet}</h2>
            <p className="cabinet-subtitle">
              {language === 'ru' ? 'Добро пожаловать обратно, ' : 'Қош келдіңіз, '}
              <span className="user-name-highlight">{user?.name}</span>!
            </p>
          </div>
          
          <div className="cabinet-actions">

            <div className="streak-badge glass-card">
              <div className="action-icon">🔥</div>
              <div className="action-text">
                <div className="action-title streak-count">{streak?.count || 0} {t?.days}</div>
                <div className="action-details">{t?.streak}</div>
              </div>
            </div>
          </div>
        </div>


            <div className="cabinet-grid">
              <div className="glass-card rank-card animate-up" style={{ animationDelay: '0.1s' }}>
                <div className="rank-bg-icon">⭐</div>
                <div className="card-label">{t.rank}</div>
                <div className="rank-number">{level}</div>
                <div className="rank-title">{levelTitle}</div>
                
                <div className="xp-container">
                   <div className="xp-values">
                      <span>{xp} XP</span>
                      <span>{xpForNextLevel} XP</span>
                   </div>
                   <div className="xp-progress-bg">
                      <div className="xp-progress-fill" style={{ width: `${progressInLevel}%` }}></div>
                   </div>
                </div>
              </div>
              
              <div className="stats-mini-grid animate-up" style={{ animationDelay: '0.2s' }}>
                  <div className="glass-card stat-mini-card stat-hover">
                    <div className="mini-icon">🗺️</div>
                    <div className="mini-value">{discoveredRegions.length}</div>
                    <div className="mini-label">{t.allRegions}</div>
                  </div>
                  <div className="glass-card stat-mini-card stat-hover">
                    <div className="mini-icon">🏆</div>
                    <div className="mini-value">{achievements.length}</div>
                    <div className="mini-label">{t.achievements}</div>
                  </div>
                  <div className="glass-card records-card stat-hover">
                    <div className="mini-label">{t.records}</div>
                    <div className="records-split">
                       <div className="record-item">
                          <div className="record-label">{t.today}</div>
                          <div className="record-value">+150</div>
                       </div>
                       <div className="record-divider"></div>
                       <div className="record-item">
                          <div className="record-label">{t.best}</div>
                          <div className="record-value primary-text">1,240</div>
                       </div>
                    </div>
                  </div>
              </div>

              <div className="glass-card quests-card animate-up" style={{ animationDelay: '0.3s' }}>
                 <h3 className="card-header-title">
                    <span>🎯</span> {t?.dailyQuests}
                 </h3>
                 <div className="quests-list">
                    {quests && Object.entries(quests.daily || {}).map(([id, quest]) => (
                       <div key={id} className={`quest-item ${quest.completed ? 'completed' : ''}`}>
                          <div className="quest-header">
                             <div className="quest-title">
                               {t?.questList?.[id]?.title} {quest.completed && '✅'}
                             </div>
                             <div className="quest-reward">+{quest.xp} XP</div>
                          </div>
                          <p className="quest-desc">{t?.questList?.[id]?.desc}</p>
                          <div className="quest-progress-bg">
                             <div className="quest-progress-fill" style={{ width: `${(quest.progress / quest.total) * 100}%`, background: quest.completed ? '#10b981' : 'var(--primary)' }}></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="glass-card leaderboard-card animate-up" style={{ animationDelay: '0.4s' }}>
                 <h3 className="card-header-title">
                    <span>📊</span> {t?.leaderboard}
                 </h3>
                 <div className="leaderboard-list">
                    {t?.mockLeaderboard?.map((player, index) => (
                       <div key={player.id} className={`leaderboard-item ${index === 0 ? 'top-player' : ''}`}>
                          <div className="player-rank">
                             {index + 1}
                          </div>
                          <div className="player-name">{player.name}</div>
                          <div className="player-stats">
                             <div className="player-level">{player.level} LVL</div>
                             <div className="player-xp">{player.xp} XP</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </div>

            {achievements.length > 0 && (
              <div className="cabinet-achievements" style={{ marginTop: '4rem' }}>
                <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>{t.unlocked} {t.achievements}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                  {achievements.map((achievement, i) => (
                    <div key={achievement.id} className="achievement-card glass-card animate-up" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', animationDelay: `${0.5 + (i * 0.1)}s` }}>
                      <div style={{ fontSize: '2.5rem' }}>
                         {achievement.id === 'first_quiz' ? '🔰' : 
                          achievement.id === 'perfect_score' ? '🎓' : 
                          achievement.id === 'level_5' ? '🧭' : 
                          achievement.id === 'level_10' ? '🥇' :
                          achievement.id === 'all_regions' ? '🗺️' : 
                          achievement.id === 'streak_3' ? '🔥' : 
                          achievement.id === 'streak_7' ? '🐉' :
                          achievement.id === 'pathfinder' ? '🧭' :
                          achievement.id === 'explorer_10' ? '🔭' : '🏆'}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{achievement.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{achievement.description}</p>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.4rem', fontWeight: '700' }}>{achievement.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
      </div>
    </section>
  );
};

export default PersonalCabinet;
