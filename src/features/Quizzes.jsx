import React, { useState, useEffect, useMemo } from 'react';
import { feature } from 'topojson-client';
import { geoPath, geoMercator } from 'd3-geo';
import worldData from '../data/world-110m.json';

const Quizzes = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameMode, setGameMode] = useState(null); // 'FLAG', 'FACT', 'SHAPE', null (menu)
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const shapesData = useMemo(() => {
    try {
      const geojson = feature(worldData, worldData.objects.countries);
      return geojson.features;
    } catch (err) {
      console.error("Failed to parse TopoJSON", err);
      return [];
    }
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,population,ccn3');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const validCountries = data.filter(c => c.name?.common && c.flags?.svg);
      const merged = validCountries.map(c => {
        const countryId = c.ccn3 ? parseInt(c.ccn3, 10) : -1;
        const matchingShape = shapesData.find(s => parseInt(s.id, 10) === countryId);
        return { ...c, shape: matchingShape || null };
      });
      setCountries(merged);
      setLoading(false);
    } catch (err) {
      setError('Не удалось загрузить данные о странах. ' + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const getRandomSubset = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const startQuiz = (mode) => {
    let pool = countries;
    if (mode === 'SHAPE') pool = countries.filter(c => c.shape);
    else if (mode === 'FACT') pool = countries.filter(c => c.capital && c.capital[0] && c.population && c.region);
    
    if (pool.length < 4) {
      alert("Недостаточно данных для запуска этого режима.");
      return;
    }

    const generated = [];
    for (let i = 0; i < 10; i++) {
      const optionsPool = getRandomSubset(pool, 4);
      const targetCountry = optionsPool[Math.floor(Math.random() * 4)];
      generated.push({
        target: targetCountry,
        options: optionsPool.map(c => c.name.common),
      });
    }

    setQuestions(generated);
    setGameMode(mode);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (optionName) => {
    if (isAnswered) return;
    setSelectedAnswer(optionName);
    setIsAnswered(true);
    if (optionName === questions[currentIndex].target.name.common) setScore(score + 10);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const renderShape = (shapeFeature) => {
    if (!shapeFeature) return null;
    const projection = geoMercator().fitSize([320, 240], shapeFeature);
    const pathGenerator = geoPath().projection(projection);
    const d = pathGenerator(shapeFeature);
    return (
      <svg width="320" height="240" style={{ filter: 'drop-shadow(0 0 15px var(--primary))', margin: '0 auto', display: 'block' }}>
        <path fill="rgba(14, 165, 233, 0.2)" stroke="var(--primary)" strokeWidth="2" d={d} />
      </svg>
    );
  };

  if (loading) return <div style={{ color: 'var(--primary)', textAlign: 'center', padding: '100px' }}>Загрузка образовательных модулей...</div>;
  if (error) return <div style={{ color: 'var(--accent)', textAlign: 'center', padding: '100px' }}>{error}</div>;

  if (showResult) {
    const maxScore = questions.length * 10;
    return (
      <div className="glass-card animate-up" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{score >= maxScore * 0.7 ? '🏆' : '📚'}</div>
        <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Результаты</h2>
        <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.5rem' }}>{score} / {maxScore}</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          {score >= maxScore * 0.7 ? 'Превосходно! У вас глубокие знания в географии.' : 'Хорошая работа. Продолжайте исследовать мир!'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => startQuiz(gameMode)}>Пересдать</button>
          <button className="btn btn-secondary" onClick={() => setGameMode(null)}>К меню</button>
        </div>
      </div>
    );
  }

  if (gameMode) {
    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const target = currentQ.target;

    return (
      <div className="quiz-active-view" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={() => setGameMode(null)} style={{ padding: '0.5rem 1rem' }}>← Назад</button>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Вопрос {currentIndex + 1} / {questions.length}</span>
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: '700' }}>Cчёт: {score}</div>
        </div>

        <div className="glass-card" style={{ padding: '3rem' }}>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '3rem', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.4s ease' }}></div>
          </div>

          <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
            {gameMode === 'FLAG' && <img src={target.flags.svg} alt="Flag" style={{ maxWidth: '300px', borderRadius: 'var(--radius-md)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />}
            {gameMode === 'SHAPE' && renderShape(target.shape)}
            {gameMode === 'FACT' && (
              <div className="font-serif" style={{ fontSize: '1.5rem', textAlign: 'left', display: 'grid', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div><span style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'block' }}>СТОЛИЦА</span> {target.capital[0]}</div>
                <div><span style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'block' }}>РЕГИОН</span> {target.region}</div>
                <div><span style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'block' }}>НАСЕЛЕНИЕ</span> {target.population.toLocaleString()}</div>
              </div>
            )}
          </div>

          <h3 className="font-serif" style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2.5rem' }}>Какая это страна?</h3>

          <div className="quiz-options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {currentQ.options.map((opt, idx) => {
              let btnStyle = { padding: '1.5rem', textAlign: 'left', fontWeight: '500' };
              let className = "btn btn-secondary";
              
              if (isAnswered) {
                if (opt === target.name.common) {
                  btnStyle.borderColor = '#10b981';
                  btnStyle.background = 'rgba(16, 185, 129, 0.1)';
                  btnStyle.color = '#10b981';
                } else if (opt === selectedAnswer) {
                  btnStyle.borderColor = '#ef4444';
                  btnStyle.background = 'rgba(239, 68, 68, 0.1)';
                  btnStyle.color = '#ef4444';
                }
              }

              return (
                <button 
                  key={idx} 
                  className={className} 
                  style={btnStyle}
                  onClick={() => handleAnswer(opt)}
                >
                  <span style={{ marginRight: '1rem', opacity: '0.5' }}>{idx + 1}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-grid-wrapper">
      <div className="quiz-grid">
        <div className="glass-card quiz-card" onClick={() => startQuiz('FLAG')} style={{ cursor: 'pointer' }}>
          <div className="quiz-icon">🚩</div>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Флаги Мира</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Проверьте свою зрительную память и знание государственных символов.</p>
        </div>

        <div className="glass-card quiz-card" onClick={() => startQuiz('FACT')} style={{ cursor: 'pointer' }}>
          <div className="quiz-icon">🌍</div>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Анализ Фактов</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Сможете ли вы узнать страну по её столице, региону и численности населения?</p>
        </div>

        <div className="glass-card quiz-card" onClick={() => startQuiz('SHAPE')} style={{ cursor: 'pointer' }}>
          <div className="quiz-icon">🗺️</div>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Контурная Карта</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Самый сложный уровень: узнайте государство по его уникальным очертаниям.</p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .quiz-active-view .glass-card {
            padding: 1.5rem !important;
          }
          .quiz-active-view h3 {
            font-size: 1.4rem !important;
            margin-bottom: 1.5rem !important;
          }
          .quiz-active-view .quiz-options-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }


          .quiz-active-view img {
            max-width: 100% !important;
          }
          .quiz-active-view svg {
            width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>

  );
};

export default Quizzes;
