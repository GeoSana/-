import React, { createContext, useState, useContext, useEffect } from 'react';
import { t } from '../data/translations';

const GameStateContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error('useGameState must be used within a GameStateProvider');
  return context;
};

export const GameStateProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('qazaqgeo_lang') || 'ru';
  });

  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('qazaqgeo_coins');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [purchasedItems, setPurchasedItems] = useState(() => {
    const saved = localStorage.getItem('qazaqgeo_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('qazaqgeo_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [discoveredRegions, setDiscoveredRegions] = useState(() => {
    const saved = localStorage.getItem('qazaqgeo_regions');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('qazaqgeo_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [quizCount, setQuizCount] = useState(() => {
    const saved = localStorage.getItem('qazaqgeo_quizzes');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qazaqgeo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('qazaqgeo_isLoggedIn') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [lastUnlocked, setLastUnlocked] = useState(null);

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('qazaqgeo_streak');
      return saved ? JSON.parse(saved) : { count: 0, lastDate: null };
    } catch (e) {
      return { count: 0, lastDate: null };
    }
  });

  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('qazaqgeo_quests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if reset is needed (daily)
        const today = new Date().toLocaleDateString();
        if (parsed.lastResetDate !== today) {
          return {
            daily: {
              quiz: { progress: 0, total: 1, completed: false, xp: 100 },
              discover: { progress: 0, total: 3, completed: false, xp: 150 }
            },
            milestones: parsed.milestones || {
              level_up: { progress: 0, total: 10, completed: false, xp: 1000 },
              regions_all: { progress: 0, total: 17, completed: false, xp: 2000 }
            },
            lastResetDate: today
          };
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return {
      daily: {
        quiz: { progress: 0, total: 1, completed: false, xp: 100 },
        discover: { progress: 0, total: 3, completed: false, xp: 150 }
      },
      milestones: {
        level_up: { progress: 0, total: 10, completed: false, xp: 1000 },
        regions_all: { progress: 0, total: 17, completed: false, xp: 2000 }
      },
      lastResetDate: new Date().toLocaleDateString()
    };
  });

  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  
  const getLevelTitle = (lvl) => {
    const titles_ru = ['Новичок', 'Путешественник', 'Следопыт', 'Исследователь', 'Первооткрыватель', 'Магистр географии', 'Легенда'];
    const titles_kz = ['Жаңа бастаушы', 'Жиһанкез', 'Ізкесуші', 'Зерттеуші', 'Алғашқы ашушы', 'География магистрі', 'Аңыз'];
    const titles = language === 'kz' ? titles_kz : titles_ru;
    return titles[Math.min(lvl - 1, titles.length - 1)];
  };

  const levelTitle = getLevelTitle(level);
  const currentT = t[language] || t.ru || t.kz || {}; 

  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const progressInLevel = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  const [lastLevel, setLastLevel] = useState(level);

  useEffect(() => {
    localStorage.setItem('qazaqgeo_xp', xp);
    localStorage.setItem('qazaqgeo_coins', coins);
    localStorage.setItem('qazaqgeo_items', JSON.stringify(purchasedItems));
    localStorage.setItem('qazaqgeo_regions', JSON.stringify(discoveredRegions));
    localStorage.setItem('qazaqgeo_achievements', JSON.stringify(achievements));
    localStorage.setItem('qazaqgeo_quizzes', quizCount);
    localStorage.setItem('qazaqgeo_isLoggedIn', isLoggedIn);
    localStorage.setItem('qazaqgeo_lang', language);
    localStorage.setItem('qazaqgeo_streak', JSON.stringify(streak));
    localStorage.setItem('qazaqgeo_quests', JSON.stringify(quests));
    if (user) localStorage.setItem('qazaqgeo_user', JSON.stringify(user));
    else localStorage.removeItem('qazaqgeo_user');
  }, [xp, coins, purchasedItems, discoveredRegions, achievements, quizCount, isLoggedIn, user, language, streak, quests]);

  // Streak Logic
  useEffect(() => {
    if (isLoggedIn) {
      const today = new Date().toLocaleDateString();
      if (streak.lastDate !== today) {
        setStreak(prev => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toLocaleDateString();
          
          let newCount = prev.lastDate === yesterdayStr ? prev.count + 1 : 1;
          
          // Achievement for streak
          if (newCount >= 7) unlockAchievement('streak_7');
          
          return { count: newCount, lastDate: today };
        });
      }
    }
  }, [isLoggedIn]);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // Handle Level Up "Wow" effect
  useEffect(() => {
    if (level > lastLevel) {
      setTimeout(() => {
        setLastLevel(level);
        setLastUnlocked({
          id: `level_${level}`,
          title: language === 'kz' ? `${level} деңгейге жеттіңіз!` : `Уровень ${level} достигнут!`,
          description: language === 'kz' ? `Енді сіздің мәртебеңіз: ${levelTitle}` : `Теперь ваш статус: ${levelTitle}`,
          type: 'level'
        });
        
        // Custom achievements for specific levels
        if (level >= 5) unlockAchievement('level_5');
        if (level >= 10) unlockAchievement('level_10');
      }, 0);
    }
  }, [level, lastLevel, language, levelTitle]);

  const addXp = (amount, isQuiz = false, score = 0) => {
    let finalAmount = amount;
    
    // Streak bonus
    if (streak.count > 1) {
      const bonus = Math.floor(amount * (Math.min(streak.count, 10) / 100)); // Up to 10% bonus
      finalAmount += bonus;
    }

    const newXp = xp + finalAmount;
    setXp(newXp);

    // Award GeoCoins (10% of XP)
    const coinReward = Math.floor(finalAmount * 0.1);
    if (coinReward > 0) {
      setCoins(prev => prev + coinReward);
    }
    
    if (isQuiz) {
      const newQuizCount = quizCount + 1;
      setQuizCount(newQuizCount);

      // Check for first quiz
      if (newQuizCount === 1) {
        unlockAchievement('first_quiz');
      }

      // Check for "Scholar" achievement (Perfect Score)
      if (score === 100) {
        unlockAchievement('perfect_score');
      }

      // Check for "Persistent" achievement (3 Quizzes)
      if (newQuizCount >= 3) {
        unlockAchievement('streak_3');
      }

      // Quest Progress: Daily Quiz
      updateQuestProgress('daily', 'quiz', 1);
    }
  };

  const updateQuestProgress = (type, id, amount) => {
    setQuests(prev => {
      const quest = prev[type][id];
      if (quest.completed) return prev;

      const newProgress = Math.min(quest.progress + amount, quest.total);
      const isNowCompleted = newProgress === quest.total;

      if (isNowCompleted) {
        // Award XP immediately
        const bonusXp = quest.xp;
        setTimeout(() => {
          setXp(currXp => currXp + bonusXp);
          setLastUnlocked({
            id: `quest_${id}`,
            title: language === 'kz' ? 'Тапсырма орындалды!' : 'Задание выполнено!',
            description: language === 'kz' ? `Сіз +${bonusXp} XP алдыңыз` : `Вы получили +${bonusXp} XP`,
            type: 'achievement'
          });
        }, 100);
      }

      return {
        ...prev,
        [type]: {
          ...prev[type],
          [id]: { ...quest, progress: newProgress, completed: isNowCompleted }
        }
      };
    });
  };

  const discoverRegion = (regionId) => {
    if (!discoveredRegions.includes(regionId)) {
      const newRegions = [...discoveredRegions, regionId];
      setDiscoveredRegions(newRegions);
      addXp(50);

      // Check for "Pathfinder"
      if (newRegions.length >= 5) {
        unlockAchievement('pathfinder');
      }

      // Check for "Explorer"
      if (newRegions.length >= 10) {
        unlockAchievement('explorer_10');
      }

      // Check for "Grand Explorer" (assuming 17 regions)
      if (newRegions.length >= 17) {
        unlockAchievement('all_regions');
      }

      // Quest Progress: Daily Discover
      updateQuestProgress('daily', 'discover', 1);
      // Quest Progress: Milestone Regions
      updateQuestProgress('milestones', 'regions_all', 1);

      return true;
    }
    return false;
  };

  const unlockAchievement = (key) => {
    if (!achievements.some(a => a.id === key)) {
      const achievementsMap = t[language]?.achievementsList || t.ru.achievementsList;
      const achievementInfo = achievementsMap[key] || { title: key, desc: '' };
      const newAchievement = { 
        id: key, 
        title: achievementInfo.title, 
        description: achievementInfo.desc, 
        date: new Date().toLocaleDateString(), 
        type: 'achievement' 
      };
      setAchievements(prev => [...prev, newAchievement]);
      setLastUnlocked(newAchievement);
    }
  };

  const buyItem = (item) => {
    if (coins >= item.price && !purchasedItems.includes(item.id)) {
      setCoins(prev => prev - item.price);
      setPurchasedItems(prev => [...prev, item.id]);
      
      setLastUnlocked({
        id: `buy_${item.id}`,
        title: language === 'kz' ? 'Сатып алу сәтті өтті!' : 'Покупка совершена!',
        description: language === 'kz' ? `${item.title.kz} енді сіздікі!` : `${item.title.ru} теперь у вас!`,
        type: 'achievement'
      });
      return true;
    }
    return false;
  };

  const clearAchievementNotification = () => setLastUnlocked(null);

  return (
    <GameStateContext.Provider value={{
      xp,
      coins,
      purchasedItems,
      level,
      levelTitle,
      progressInLevel,
      xpForNextLevel,
      discoveredRegions,
      achievements,
      lastUnlocked,
      isLoggedIn,
      streak,
      quests,
      user,
      language,
      setLanguage,
      t: currentT,
      addXp,
      discoverRegion,
      unlockAchievement,
      updateQuestProgress,
      login,
      logout,
      clearAchievementNotification
    }}>
      {children}
    </GameStateContext.Provider>
  );
};
