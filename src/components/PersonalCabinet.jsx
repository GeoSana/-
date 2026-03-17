import React, { useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import Shop from '../features/Shop';

const PersonalCabinet = () => {
  const { xp, coins, level, levelTitle, progressInLevel, xpForNextLevel, discoveredRegions, achievements, user, isLoggedIn, t, language, streak, quests } = useGameState();
  const [showShop, setShowShop] = useState(false);

  if (!isLoggedIn) return null;

  return (
    <section id="cabinet" className="animate-up" style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{showShop ? t.shopTitle : t?.cabinet}</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              {language === 'ru' ? 'Добро пожаловать обратно, ' : 'Қош келдіңіз, '}
              <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{user?.name}</span>!
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => setShowShop(!showShop)}
              className="glass-card"
              style={{ 
                padding: '1rem 2rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                border: showShop ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: showShop ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255,255,255,0.03)'
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>{showShop ? '👤' : '🏪'}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: showShop ? 'var(--primary)' : 'white' }}>
                  {showShop ? (language === 'kz' ? 'Профиль' : 'Профиль') : t.shopTitle}
                </div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6 }}>{t.shopCoins}: {coins}</div>
              </div>
            </button>

            <div className="glass-card" style={{ padding: '1.1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <div style={{ fontSize: '1.5rem' }}>🔥</div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffd700' }}>{streak?.count || 0} {t?.days}</div>
                <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6 }}>{t?.streak}</div>
              </div>
            </div>
          </div>
        </div>

        {showShop ? (
          <Shop />
        ) : (
          <>
            <div className="cabinet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
              <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '8rem', opacity: 0.05, pointerEvents: 'none' }}>⭐</div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{t.rank}</div>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', lineHeight: 1 }}>{level}</div>
                <div style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: '700', marginTop: '0.5rem' }}>{levelTitle}</div>
                
                <div style={{ marginTop: '2rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{xp} XP</span>
                      <span style={{ color: 'white', fontWeight: '700' }}>{xpForNextLevel} XP</span>
                   </div>
                   <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressInLevel}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #6366f1)', boxShadow: '0 0 10px var(--primary)' }}></div>
                   </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800' }}>{discoveredRegions.length}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>{t.allRegions}</div>
                  </div>
                  <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'gold' }}>{coins}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>{t.shopCoins}</div>
                  </div>
                  <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t.records}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                       <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.today}</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>+150</div>
                       </div>
                       <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                       <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.best}</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>1,240</div>
                       </div>
                    </div>
                  </div>
              </div>

              <div className="glass-card" style={{ padding: '2rem' }}>
                 <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎯</span> {t?.dailyQuests}
                 </h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {quests && Object.entries(quests.daily || {}).map(([id, quest]) => (
                       <div key={id} style={{ opacity: quest.completed ? 0.6 : 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                             <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                               {t?.questList?.[id]?.title} {quest.completed && '✅'}
                             </div>
                             <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800' }}>+{quest.xp} XP</div>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{t?.questList?.[id]?.desc}</p>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                             <div style={{ width: `${(quest.progress / quest.total) * 100}%`, height: '100%', background: quest.completed ? '#10b981' : 'var(--primary)', transition: 'width 0.5s ease' }}></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="glass-card" style={{ padding: '2rem' }}>
                 <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📊</span> {t?.leaderboard}
                 </h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {t?.mockLeaderboard?.map((player, index) => (
                       <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', background: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', border: index === 0 ? '1px solid rgba(255, 215, 0, 0.2)' : '1px solid transparent' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: index === 0 ? '#ffd700' : 'rgba(255,255,255,0.1)', color: index === 0 ? '#000' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>
                             {index + 1}
                          </div>
                          <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: '600' }}>{player.name}</div>
                          <div style={{ textAlign: 'right' }}>
                             <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{player.level} LVL</div>
                             <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{player.xp} XP</div>
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
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="achievement-card glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem' }}>
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
          </>
        )}
      </div>
    </section>
  );
};

export default PersonalCabinet;
