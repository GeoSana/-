import React, { useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import quizzesData from '../data/quizzes.json';
import SongQuiz from './SongQuiz';
import WordSearch from './WordSearch';
import MapLabeling from './MapLabeling';

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
    setSelectedQuiz(quiz);
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

  const [activeCategory, setActiveCategory] = useState('kz');

  const filteredQuizzes = quizzesData.filter(q => q.category === activeCategory);

  if (showResult) {
    const totalQuestions = 
      selectedQuiz.type === 'wordsearch' ? selectedQuiz.wordSearchData.words.length :
      selectedQuiz.type === 'map-labeling' ? selectedQuiz.mapLabelingData.pins.length :
      selectedQuiz.questions.length;
    const percentage = Math.round((score / (totalQuestions || 1)) * 100);
    
    return (
      <div className="wordwall-quiz-container animate-pop">
        <div className="quiz-game-card glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '6rem', marginBottom: '2rem', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))' }}>
            {percentage >= 80 ? '👑' : percentage >= 50 ? '🥈' : '🥉'}
          </div>
          <h2 className="font-serif" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {percentage >= 80 ? (language === 'kz' ? 'ТАМАША!' : 'ВЕЛИКОЛЕПНО!') : t.quizCompleted}
          </h2>
          
          <div style={{ 
            background: 'var(--bg-dark)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '2.5rem',
            margin: '2.5rem 0',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              {score} / {totalQuestions}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {language === 'kz' ? 'ДҰРЫС ЖАУАПТАР' : 'ПРАВИЛЬНЫХ ОТВЕТОВ'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{ padding: '1rem 3rem' }} onClick={() => startQuiz(selectedQuiz)}>
              {language === 'kz' ? 'ҚАЙТАЛАУ' : 'ПЕРЕСДАТЬ'}
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 3rem' }} onClick={backToSelection}>
              {t.backToQuizzes}
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

  if (selectedQuiz?.type === 'song-quiz') {
    return (
      <div className="wordwall-quiz-container animate-fade-in">
        <div style={{ marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={backToSelection} style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
            ← {t.backToList}
          </button>
        </div>
        <SongQuiz 
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
          <div className="glass-card" style={{ 
            padding: '0.6rem 2rem', 
            fontWeight: '800',
            color: 'var(--primary)',
            fontSize: '1.1rem'
          }}>
            {currentIndex + 1} / {selectedQuiz.questions.length}
          </div>
        </div>

        <div className="quiz-split-layout">
          <div className="quiz-visual-side animate-pop" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {currentQ.image ? (
              <img 
                src={currentQ.image.startsWith('/') ? import.meta.env.BASE_URL + currentQ.image.slice(1) : currentQ.image} 
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
      <div className="quiz-category-tabs">
        <button 
          className={`quiz-category-tab ${activeCategory === 'kz' ? 'active' : ''}`}
          onClick={() => setActiveCategory('kz')}
        >
          <img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/KZ.svg" alt="KZ" style={{ width: '22px', borderRadius: '3px' }} />
          {language === 'ru' ? 'Казахстан' : 'Қазақстан'}
        </button>
        <button 
          className={`quiz-category-tab ${activeCategory === 'world' ? 'active' : ''}`}
          onClick={() => setActiveCategory('world')}
        >
          🌍 {language === 'ru' ? 'Мир' : 'Әлем'}
        </button>
      </div>

      <div className="quiz-selection-grid">
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
