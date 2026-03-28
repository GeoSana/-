import React, { useState, useEffect } from 'react';
import { useGameState } from '../context/GameStateContext';
import rawQuizzesData from '../data/quizzes.json';
import WordSearch from './WordSearch';
import MapLabeling from './MapLabeling';
import { geoQuestions } from '../data/questions_geo';
import { politicalQuestions } from '../data/questions_political';
import { economyQuestions } from '../data/questions_economy';
import { cultureQuestions } from '../data/questions_culture';
import { melodyQuestions } from '../data/questions_melody';

const quizzesData = [
  ...rawQuizzesData.filter(q => q.id !== 'kz-geo-general'),
  {
    id: "kz-geo",
    category: "geo",
    difficulty: 2,
    title: { ru: "Природа и География", kz: "Табиғат және География" },
    description: { ru: "Флора, фауна, горы и реки", kz: "Флора, фауна, таулар мен өзендер" },
    iconName: "Mountain",
    questions: geoQuestions
  },
  {
    id: "kz-political",
    category: "political",
    difficulty: 2,
    title: { ru: "Политико-административное", kz: "Саяси-әкімшілік" },
    description: { ru: "Границы, регионы, города", kz: "Шекаралар, облыстар, қалалар" },
    iconName: "Landmark",
    questions: politicalQuestions
  },
  {
    id: "kz-economy",
    category: "economy",
    difficulty: 2,
    title: { ru: "Экономика", kz: "Экономикалық" },
    description: { ru: "Промышленность и инфраструктура", kz: "Өнеркәсіп және инфрақұрылым" },
    iconName: "Cpu",
    questions: economyQuestions
  },
  {
    id: "kz-culture",
    category: "culture",
    difficulty: 2,
    title: { ru: "Культура и Общество", kz: "Мәдени және Қоғам" },
    description: { ru: "Традиции, религия, этносы", kz: "Дәстүрлер, дін, этностар" },
    iconName: "BookOpen",
    questions: cultureQuestions
  },
  {
    id: "kz-melody",
    category: "games",
    difficulty: 1,
    title: { ru: "Угадай мелодию (Текст)", kz: "Әуенді тап (Мәтіндік)" },
    description: { ru: "Популярные песни и строки", kz: "Танымал әндер мен өлең жолдары" },
    iconName: "Music",
    questions: melodyQuestions
  }
];

const Quizzes = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { addXp, language, t } = useGameState();

  const backToSelection = () => {
    setSelectedQuiz(null);
    setShowResult(false);
    setCurrentIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  const startQuiz = (quiz) => {
    let quizToStart = quiz;
    // Shuffle and pick 10 random questions for standard quizzes
    if (quiz.questions && quiz.questions.length > 0 && !['wordsearch', 'map-labeling', 'song-quiz'].includes(quiz.type)) {
      quizToStart = {
        ...quiz,
        questions: [...quiz.questions].sort(() => 0.5 - Math.random()).slice(0, 10)
      };
    }

    setSelectedQuiz(quizToStart);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (idx) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    
    const isCorrect = idx === selectedQuiz.questions[currentIndex].correctAnswer;
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentIndex + 1 < selectedQuiz.questions.length) {
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        finishQuiz(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  const finishQuiz = (finalCorrectCount = score) => {
    setScore(finalCorrectCount);
    setShowResult(true);
    const difficultyMultiplier = selectedQuiz.difficulty === 3 ? 2.0 : selectedQuiz.difficulty === 2 ? 1.5 : 1.0;
    
    // Use dynamic total based on quiz type
    const total = 
      selectedQuiz.type === 'wordsearch' ? selectedQuiz.wordSearchData.words.length :
      selectedQuiz.type === 'map-labeling' ? selectedQuiz.mapLabelingData.pins.length :
      selectedQuiz.questions.length;

    const baseScore = Math.round((finalCorrectCount / (total || 1)) * 100);
    const finalXp = Math.round(baseScore * difficultyMultiplier);
    addXp(finalXp, true, baseScore);
  };

  const getQuizIcon = (iconName) => {
    const icons = {
      'Map': '🗺️',
      'Car': '🚗',
      'Flag': '🚩',
      'Globe': '🌍',
      'Mountain': '🏔️',
      'Landmark': '🏛️',
      'Utensils': '🍴',
      'BookOpen': '📖',
      'Music': '🎵',
      'Trophy': '🏆',
      'Star': '⭐',
      'Camera': '📸',
      'Cpu': '💻'
    };
    return icons[iconName] || '📝';
  };

  const [activeCategory, setActiveCategory] = useState('geo');
  const [customQuizzes, setCustomQuizzes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('custom_quizzes');
    if (saved) {
      try {
        setCustomQuizzes(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const allQuizzes = [...quizzesData, ...customQuizzes];

  const filteredQuizzes = allQuizzes.filter(q => {
    if (activeCategory === 'games') {
      return ['kz', 'world', 'games'].includes(q.category); // Keep legacy kz/world in games, plus new 'games'
    }
    return q.category === activeCategory;
  });

  if (showResult) {
    const totalQuestions = 
      selectedQuiz.type === 'wordsearch' ? selectedQuiz.wordSearchData.words.length :
      selectedQuiz.type === 'map-labeling' ? selectedQuiz.mapLabelingData.pins.length :
      selectedQuiz.questions.length;
    const percentage = Math.round((score / (totalQuestions || 1)) * 100);
    const diffMultiplier = selectedQuiz.difficulty === 3 ? 2.0 : selectedQuiz.difficulty === 2 ? 1.5 : 1.0;
    const xpEarned = Math.round(percentage * diffMultiplier);
    const medal = percentage >= 80 ? '👑' : percentage >= 50 ? '🥈' : '🥉';

    const handleShare = async () => {
      const quizName = selectedQuiz.title[language];
      const shareText = language === 'kz'
        ? `${medal} GeoSana-да "${quizName}" викторинасында ${score}/${totalQuestions} жауап бердім! ${xpEarned} XP алдым 🎉\nhttps://GeoSana.github.io/-/`
        : `${medal} Прошёл квиз "${quizName}" на GeoSana! Результат: ${score}/${totalQuestions}. Заработал ${xpEarned} XP 🎉\nhttps://GeoSana.github.io/-/`;
      if (navigator.share) {
        try { await navigator.share({ text: shareText }); } catch (_) {}
      } else {
        try {
          await navigator.clipboard.writeText(shareText);
          alert(language === 'kz' ? 'Мәтін алмасу буферіне көшірілді!' : 'Текст скопирован в буфер обмена!');
        } catch (_) {}
      }
    };
    
    return (
      <div className="wordwall-quiz-container animate-pop">
        <div className="quiz-game-card glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))' }}>
            {medal}
          </div>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {percentage >= 80 ? (language === 'kz' ? 'ТАМАША!' : 'ВЕЛИКОЛЕПНО!') : t.quizCompleted}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            {selectedQuiz.title[language]}
          </p>
          
          {/* Score + XP block */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: '1fr 1px 1fr',
            background: 'var(--bg-dark)', 
            borderRadius: '20px', 
            padding: '1.5rem 2rem',
            margin: '0 0 2rem',
            border: '1px solid var(--border)',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {score}/{totalQuestions}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                {language === 'kz' ? 'ЖАУАПТАР' : 'ОТВЕТОВ'}
              </div>
            </div>
            <div style={{ width: '1px', height: '100%', background: 'var(--border)' }} />
            <div>
              <div style={{ 
                fontSize: '2.5rem', fontWeight: '900', lineHeight: 1,
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                +{xpEarned}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                XP {language === 'kz' ? 'АЛДЫҢЫЗ' : 'ПОЛУЧЕНО'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }} className="quiz-result-actions">
            <button className="btn btn-primary" style={{ padding: '1rem 2rem' }} onClick={() => startQuiz(selectedQuiz)}>
              🔄 {language === 'kz' ? 'Қайталау' : 'Пересдать'}
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 2rem' }} onClick={backToSelection}>
              {t.backToQuizzes}
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '1rem 2rem', borderColor: 'rgba(14,165,233,0.3)' }}
              onClick={handleShare}
            >
              📤 {language === 'kz' ? 'Бөлісу' : 'Поделиться'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedQuiz?.type === 'wordsearch') {
    return (
      <div className="wordwall-quiz-container animate-fade-in">
        <div style={{ marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={backToSelection} style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
            ← {t.backToList}
          </button>
        </div>
        <WordSearch 
            quiz={selectedQuiz} 
            onComplete={() => finishQuiz(selectedQuiz.wordSearchData.words.length)} 
            language={language}
            t={t}
        />
      </div>
    );
  }

  if (selectedQuiz?.type === 'map-labeling') {
    return (
      <div className="wordwall-quiz-container animate-fade-in" style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={backToSelection} style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
            ← {t.backToList}
          </button>
        </div>
        <MapLabeling 
            quiz={selectedQuiz} 
            onComplete={(cScore) => finishQuiz(cScore)} 
            language={language}
            t={t}
        />
      </div>
    );
  }



  if (selectedQuiz) {
    const currentQ = selectedQuiz.questions[currentIndex];

    return (
      <div className="wordwall-quiz-container animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <button className="btn btn-secondary" onClick={backToSelection} style={{ padding: '0.8rem 2rem', borderRadius: 'var(--radius-lg)' }}>
            ← {t.backToList}
          </button>
          <div className="quiz-progress-wrapper glass-card">
            <div className="quiz-progress-text">
              {currentIndex + 1} / {selectedQuiz.questions.length}
            </div>
            <div className="quiz-progress-track">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${((currentIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="quiz-split-layout">
          <div className="quiz-visual-side animate-pop" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {currentQ.image ? (
              <img 
                src={currentQ.image.startsWith('http') ? currentQ.image : (window.location.pathname.startsWith('/-') ? '/-/' : '/') + currentQ.image.replace(/^\//, '')} 
                alt="visual" 
                style={{ 
                    maxWidth: '96%', 
                    maxHeight: '96%', 
                    objectFit: 'contain',
                    borderRadius: '12px',
                    filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))'
                }} 
              />
            ) : (
              <div className="quiz-icon-ww pulsing" style={{ fontSize: '8rem' }}>
                {currentQ.visual || getQuizIcon(selectedQuiz.iconName)}
              </div>
            )}
          </div>

          <div className="quiz-question-side">
            <h2 className="quiz-question-text animate-up font-serif" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
              {currentQ.question[language]}
            </h2>

            <div className="options-grid-ww">
              {currentQ.options[language].map((opt, idx) => {
                const isCorrect = idx === currentQ.correctAnswer;
                const isSelected = idx === selectedAnswer;
                
                let className = "option-btn-ww animate-up";
                if (isAnswered) {
                  if (isCorrect) className += " correct";
                  else if (isSelected) className += " wrong";
                }

                return (
                  <button 
                    key={idx} 
                    className={className}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    style={{ 
                        animationDelay: `${idx * 0.1}s`,
                    }}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="animate-pop glass-card" style={{ 
                marginTop: '2rem', 
                padding: '2rem', 
                textAlign: 'left',
                border: '1px solid var(--primary-muted)'
              }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  <span style={{ marginRight: '0.5rem' }}>💡</span>
                  {currentQ.explanation[language]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wordwall-quiz-container">
      <div className="quiz-category-tabs" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <button 
          className={`quiz-category-tab ${activeCategory === 'geo' ? 'active' : ''}`}
          onClick={() => setActiveCategory('geo')}
        >
          🏔️ {language === 'ru' ? 'География' : 'География'}
        </button>
        <button 
          className={`quiz-category-tab ${activeCategory === 'political' ? 'active' : ''}`}
          onClick={() => setActiveCategory('political')}
        >
          🏛️ {language === 'ru' ? 'Политика' : 'Саясат'}
        </button>
        <button 
          className={`quiz-category-tab ${activeCategory === 'economy' ? 'active' : ''}`}
          onClick={() => setActiveCategory('economy')}
        >
          🏭 {language === 'ru' ? 'Экономика' : 'Экономика'}
        </button>
        <button 
          className={`quiz-category-tab ${activeCategory === 'culture' ? 'active' : ''}`}
          onClick={() => setActiveCategory('culture')}
        >
          📚 {language === 'ru' ? 'Культура' : 'Мәдениет'}
        </button>
        <button 
          className={`quiz-category-tab ${activeCategory === 'games' ? 'active' : ''}`}
          onClick={() => setActiveCategory('games')}
        >
          🎮 {language === 'ru' ? 'Мини-игры' : 'Шағын ойындар'}
        </button>
        <button 
          className={`quiz-category-tab ${activeCategory === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveCategory('custom')}
        >
          👤 {language === 'ru' ? 'Мои тесты' : 'Менің тестерім'}
        </button>
      </div>

      <div className="quiz-selection-grid">
        {filteredQuizzes.length === 0 && activeCategory === 'custom' && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: '0.4' }}>📝</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
              {language === 'kz' ? 'Әлі тест құрылған жоқ' : 'Вы еще не создали ни одного теста'}
            </h3>
            <p>
              {language === 'kz' ? 'Жоғарыдағы мәзірден жаңа тест құрастырыңыз' : 'Создайте новый тест через меню сверху'}
            </p>
          </div>
        )}
        {filteredQuizzes.map((quiz, qIdx) => (
          <div 
            key={quiz.id} 
            className="quiz-selection-tile animate-pop" 
            onClick={() => startQuiz(quiz)}
            style={{ animationDelay: `${qIdx * 0.1}s` }}
          >
            <div className="quiz-icon-ww" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
              {getQuizIcon(quiz.iconName)}
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'white', fontFamily: 'Playfair Display, serif' }}>
              {quiz.title[language]}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4', maxWidth: '220px' }}>
              {quiz.description[language]}
            </p>
            
            <div style={{ 
                fontSize: '0.7rem', 
                background: 'rgba(255,255,255,0.05)', 
                padding: '4px 10px', 
                borderRadius: '10px',
                display: 'inline-block',
                marginTop: 'auto',
                color: quiz.difficulty === 3 ? '#ef4444' : quiz.difficulty === 2 ? '#f59e0b' : '#10b981',
                border: '1px solid currentColor',
                fontWeight: '700'
            }}>
              {t.difficultyLabel}: {quiz.difficulty === 3 ? t.diffHard : quiz.difficulty === 2 ? t.diffMedium : t.diffEasy}
            </div>

            <div style={{
                fontSize: '0.75rem',
                color: 'var(--primary)',
                fontWeight: 'bold',
                marginTop: '8px'
            }}>
              ✨ {t.potentialReward}: {Math.round(100 * (quiz.difficulty === 3 ? 2.0 : quiz.difficulty === 2 ? 1.5 : 1.0))} XP
            </div>
            
            <div className="play-button-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
