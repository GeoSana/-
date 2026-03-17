import React, { useState, useRef, useEffect } from 'react';

const SongQuiz = ({ quiz, onComplete, language, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const audioRef = useRef(null);

  const currentQ = quiz.questions[currentIndex];

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAnswer = (idx) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    audioRef.current.pause();
    setIsPlaying(false);

    if (idx === currentQ.correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < quiz.questions.length) {
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
        onComplete(score + (idx === currentQ.correctAnswer ? 1 : 0));
      }
    }, 2000);
  };

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.load();
        setIsPlaying(false);
    }
  }, [currentIndex]);

  if (showScore) return null; // Quizzes.jsx handles results

  return (
    <div className="song-quiz-container animate-fade-in">
      <div className="quiz-split-layout">
        <div className="quiz-visual-side animate-pop" style={{ background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
          {/* Animated Equalizer Background */}
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '100%', 
            height: '40%', 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: '4px', 
            padding: '0 20px', 
            opacity: isPlaying ? 0.3 : 0.1,
            transition: 'opacity 0.3s'
          }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ 
                flex: 1, 
                backgroundColor: 'var(--primary)', 
                height: isPlaying ? `${Math.random() * 100}%` : '10%',
                transition: isPlaying ? 'height 0.1s ease-in-out' : 'height 1s ease'
              }}></div>
            ))}
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div className={`music-disc ${isPlaying ? 'spinning' : ''}`} style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #333 30%, #111 100%)',
              border: '10px solid #222',
              boxShadow: '0 0 30px rgba(0,0,0,0.5)',
              margin: '0 auto 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', border: '5px solid #000' }}></div>
              <div style={{ position: 'absolute', fontSize: '2rem' }}>🎵</div>
            </div>

            <button 
              onClick={handlePlayPause}
              className="song-play-btn pulsing"
              style={{
                background: 'var(--primary)',
                border: 'none',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 0 30px rgba(14, 165, 233, 0.6)',
                transition: 'all 0.3s ease'
              }}
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <audio ref={audioRef} src={currentQ.audioUrl} onEnded={() => setIsPlaying(false)} />
          </div>
        </div>

        <div className="quiz-question-side">
          <h2 className="quiz-question-text animate-up">{currentQ.question[language]}</h2>
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
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                   <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                   {opt}
                </button>
              );
            })}
          </div>
          {isAnswered && (
             <div className="animate-pop" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>💡 {currentQ.explanation[language]}</p>
             </div>
          )}
        </div>
      </div>

      <style>{`
        .spinning {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SongQuiz;
