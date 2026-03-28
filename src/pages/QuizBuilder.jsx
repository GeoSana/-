import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';

const QuizBuilder = () => {
  const { t, language } = useGameState();
  const navigate = useNavigate();
  const [customQuizzes, setCustomQuizzes] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    titleKz: '',
    titleRu: '',
    descKz: '',
    descRu: '',
    questions: [
      { 
        textKz: '', textRu: '', 
        optionsKz: ['', '', '', ''], 
        optionsRu: ['', '', '', ''], 
        correctAnswer: 0 
      }
    ]
  });

  useEffect(() => {
    const saved = localStorage.getItem('custom_quizzes');
    if (saved) {
      try {
        setCustomQuizzes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse custom quizzes', e);
      }
    }
  }, []);

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions, 
        { textKz: '', textRu: '', optionsKz: ['', '', '', ''], optionsRu: ['', '', '', ''], correctAnswer: 0 }
      ]
    });
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...formData.questions];
    updated.splice(index, 1);
    setFormData({ ...formData, questions: updated });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData({ ...formData, questions: updated });
  };

  const handleOptionChange = (qIndex, optIndex, lang, value) => {
    const updated = [...formData.questions];
    if (lang === 'kz') updated[qIndex].optionsKz[optIndex] = value;
    else updated[qIndex].optionsRu[optIndex] = value;
    setFormData({ ...formData, questions: updated });
  };

  const saveQuiz = () => {
    // Basic validation
    if (!formData.titleRu || !formData.titleKz || formData.questions.length === 0) {
      alert(language === 'kz' ? 'Тақырыпты толтырыңыз!' : 'Заполните заголовок!');
      return;
    }

    // Format for the engine
    const newQuiz = {
      id: 'custom-' + Date.now(),
      category: 'custom',
      iconName: 'user',
      title: {
        kz: formData.titleKz,
        ru: formData.titleRu
      },
      description: {
        kz: formData.descKz || 'Пайдаланушы викторинасы',
        ru: formData.descRu || 'Пользовательская викторина'
      },
      questions: formData.questions.map((q, i) => ({
        id: i + 1,
        question: {
          kz: q.textKz || q.textRu,
          ru: q.textRu || q.textKz
        },
        options: {
          kz: q.optionsKz.map(o => o || '-'),
          ru: q.optionsRu.map(o => o || '-')
        },
        correctAnswer: parseInt(q.correctAnswer),
        explanation: {
          kz: '',
          ru: ''
        }
      }))
    };

    const updatedQuizzes = [...customQuizzes, newQuiz];
    localStorage.setItem('custom_quizzes', JSON.stringify(updatedQuizzes));
    setCustomQuizzes(updatedQuizzes);
    
    setSuccessMsg(language === 'kz' ? 'Викторина сәтті сақталды!' : 'Викторина успешно сохранена!');
    setTimeout(() => {
      setSuccessMsg('');
      navigate('/quizzes');
    }, 2000);
  };

  return (
    <section className="cabinet-section animate-up">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="cabinet-title font-serif" style={{ fontSize: '2.5rem' }}>
            {language === 'kz' ? 'Тест құрастырушы' : 'Конструктор тестов'}
          </h2>
          <button className="btn btn-secondary" onClick={() => navigate('/quizzes')}>
            ← {language === 'kz' ? 'Артқа' : 'Назад'}
          </button>
        </div>

        {successMsg && (
          <div className="glass-card animate-pop" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981', color: '#10b981', padding: '1rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 'bold' }}>
            {successMsg}
          </div>
        )}

        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            {language === 'kz' ? 'Негізгі ақпарат' : 'Основная информация'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Название (RU)*</label>
              <input 
                type="text" 
                value={formData.titleRu} 
                onChange={(e) => setFormData({...formData, titleRu: e.target.value})} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Тақырып (KZ)*</label>
              <input 
                type="text" 
                value={formData.titleKz} 
                onChange={(e) => setFormData({...formData, titleKz: e.target.value})} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Описание короткое (RU)</label>
              <input 
                type="text" 
                value={formData.descRu} 
                onChange={(e) => setFormData({...formData, descRu: e.target.value})} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Қысқаша сипаттама (KZ)</label>
              <input 
                type="text" 
                value={formData.descKz} 
                onChange={(e) => setFormData({...formData, descKz: e.target.value})} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
              />
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
          {language === 'kz' ? 'Сұрақтар' : 'Вопросы'}
        </h3>

        {formData.questions.map((q, qIndex) => (
          <div key={qIndex} className="glass-card animate-up" style={{ padding: '2rem', marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <button 
                onClick={() => handleRemoveQuestion(qIndex)}
                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>
            
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              {language === 'kz' ? 'Сұрақ' : 'Вопрос'} {qIndex + 1}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Вопрос (RU)"
                value={q.textRu} 
                onChange={(e) => handleQuestionChange(qIndex, 'textRu', e.target.value)} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
              />
              <input 
                type="text" 
                placeholder="Сұрақ (KZ)"
                value={q.textKz} 
                onChange={(e) => handleQuestionChange(qIndex, 'textKz', e.target.value)} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
              />
            </div>

            <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {language === 'kz' ? 'Варианттар (4) және дұрыс жауапты белгілеңіз:' : 'Варианты (4) и выберите правильный:'}
            </p>

            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {[0, 1, 2, 3].map((optIndex) => (
                <div key={optIndex} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="radio" 
                    name={`correct-${qIndex}`} 
                    checked={q.correctAnswer == optIndex}
                    onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                    style={{ transform: 'scale(1.5)', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1 }}>
                    <input 
                      type="text" 
                      placeholder={`Вариант ${optIndex + 1} (RU)`}
                      value={q.optionsRu[optIndex]} 
                      onChange={(e) => handleOptionChange(qIndex, optIndex, 'ru', e.target.value)} 
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${q.correctAnswer == optIndex ? 'var(--primary)' : 'var(--border)'}`, color: 'white' }} 
                    />
                    <input 
                      type="text" 
                      placeholder={`В-т ${optIndex + 1} (KZ)`}
                      value={q.optionsKz[optIndex]} 
                      onChange={(e) => handleOptionChange(qIndex, optIndex, 'kz', e.target.value)} 
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${q.correctAnswer == optIndex ? 'var(--primary)' : 'var(--border)'}`, color: 'white' }} 
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <button className="btn btn-secondary" onClick={handleAddQuestion} style={{ width: '100%', padding: '1rem', borderStyle: 'dashed' }}>
            + {language === 'kz' ? 'Сұрақ қосу' : 'Добавить вопрос'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button className="btn btn-primary" onClick={saveQuiz} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            💾 {language === 'kz' ? 'Сақтау' : 'Сохранить'}
          </button>
        </div>

      </div>
    </section>
  );
};

export default QuizBuilder;
