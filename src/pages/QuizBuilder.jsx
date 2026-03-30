import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import { saveCommunityQuiz } from '../services/quizService';
import { extractQuizFromTextOrUrl } from '../services/aiImportService';

const QuizBuilder = () => {
  const { t, language } = useGameState();
  const navigate = useNavigate();
  const [customQuizzes, setCustomQuizzes] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

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

  const saveQuiz = async () => {
    // Basic validation
    if (!formData.titleRu || !formData.titleKz || formData.questions.length === 0) {
      alert(language === 'kz' ? 'Тақырыпты толтырыңыз!' : 'Заполните заголовок!');
      return;
    }

    // Format for the engine
    const newQuiz = {
      id: 'custom-' + Date.now(),
      category: 'community',
      iconName: 'BookOpen',
      difficulty: 1,
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
        explanation: { kz: '', ru: '' }
      }))
    };

    // 1. Save to localStorage (for "My quizzes" tab)
    const localQuiz = { ...newQuiz, category: 'custom' };
    const updatedLocal = [...customQuizzes, localQuiz];
    localStorage.setItem('custom_quizzes', JSON.stringify(updatedLocal));
    setCustomQuizzes(updatedLocal);

    setTimeout(() => {
      setSuccessMsg('');
      navigate('/quizzes');
    }, 1000);
  };

  const handleAiImport = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiError('');
    try {
      const generatedQuiz = await extractQuizFromTextOrUrl(aiInput.trim(), language);
      
      // Update form data with generated data
      setFormData({
        titleRu: generatedQuiz.titleRu || '',
        titleKz: generatedQuiz.titleKz || '',
        descRu: generatedQuiz.descRu || '',
        descKz: generatedQuiz.descKz || '',
        questions: generatedQuiz.questions || []
      });
      
      // Switch back to manual tab to let user review
      setActiveTab('manual');
      setAiInput('');
      setSuccessMsg(language === 'kz' ? '✨ Тест AI арқылы сәтті сәтті құрылды! Тексеріп, сақтаңыз.' : '✨ Тест успешно сгенерирован AI! Проверьте и сохраните.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setAiError(err.message || 'Ошибка импорта. Попробуйте еще раз.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section className="cabinet-section animate-up">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="qb-header">
          <h2 className="cabinet-title font-serif" style={{ fontSize: '2.5rem', margin: 0 }}>
            {language === 'kz' ? 'Тест құрастырушы' : 'Конструктор тестов'}
          </h2>
          <button className="btn btn-secondary" onClick={() => navigate('/quizzes')}>
            ← {language === 'kz' ? 'Артқа' : 'Назад'}
          </button>
        </div>

        {/* Tabs */}
        <div className="qb-tabs">
          <button 
            onClick={() => setActiveTab('manual')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === 'manual' ? 'var(--primary)' : 'white', 
              fontSize: '1.2rem', 
              fontWeight: activeTab === 'manual' ? 'bold' : 'normal',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ✍️ {language === 'kz' ? 'Қолмен құру' : 'Ручное создание'}
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === 'ai' ? '#a855f7' : 'white', 
              fontSize: '1.2rem', 
              fontWeight: activeTab === 'ai' ? 'bold' : 'normal',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ✨ {language === 'kz' ? 'AI Импорт (Сілтеме/Мәтін)' : 'AI Импорт (Ссылка/Текст)'}
            <span style={{ fontSize: '0.7rem', background: '#a855f7', color: 'white', padding: '2px 6px', borderRadius: '10px' }}>NEW</span>
          </button>
        </div>

        {activeTab === 'ai' && (
          <div className="quiz-card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#a855f7' }}>
              {language === 'kz' ? 'Смарт импорт' : 'Умный импорт'}
            </h3>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              {language === 'kz' 
                ? 'Кез-келген мәтінді немесе басқа сайттағы тестке сілтемені (URL) қойыңыз. AI автоматты түрде сұрақтарды тауып, аударып, дайын тест жасайды!' 
                : 'Вставьте любой текст с вопросами ИЛИ прямую ссылку (URL) на тест с другого сайта. AI сам найдет вопросы, переведет их и соберет готовый тест!'}
            </p>
            
            <textarea 
              className="chat-input"
              style={{ width: '100%', minHeight: '150px', padding: '1rem', marginBottom: '1rem', resize: 'vertical' }}
              placeholder={language === 'kz' ? "Мәтінді немесе https://... сілтемесін осында қойыңыз" : "Вставьте текст или ссылку https://... сюда"}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              disabled={isAiLoading}
            ></textarea>

            {aiError && (
              <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                {aiError}
              </div>
            )}

            <button 
              className="btn" 
              style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: 'white', width: '100%', padding: '1rem', fontSize: '1.2rem' }}
              onClick={handleAiImport}
              disabled={isAiLoading || !aiInput.trim()}
            >
              {isAiLoading ? '⏳ ' + (language === 'kz' ? 'AI жұмыс істеуде...' : 'AI обрабатывает...') : '✨ ' + (language === 'kz' ? 'Тест құру' : 'Сгенерировать тест')}
            </button>
          </div>
        )}

        {successMsg && (
          <div className="glass-card animate-pop" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981', color: '#10b981', padding: '1rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 'bold' }}>
            {successMsg}
          </div>
        )}

        {activeTab === 'manual' && (
          <>
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                {language === 'kz' ? 'Негізгі ақпарат' : 'Основная информация'}
              </h3>
              
              <div className="qb-grid-2">
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

                <div className="qb-grid-2" style={{ marginBottom: '1.5rem' }}>
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
                    <div key={optIndex} className="qb-option-row">
                      <input 
                        type="radio" 
                        name={`correct-${qIndex}`} 
                        checked={q.correctAnswer == optIndex}
                        onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                        style={{ transform: 'scale(1.5)', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                      <div className="qb-option-grid">
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
              <button className="btn btn-primary" onClick={saveQuiz} disabled={publishing} style={{ padding: '1rem 3rem', fontSize: '1.1rem', opacity: publishing ? 0.7 : 1 }}>
                {publishing ? '⏳ ' + (language === 'kz' ? 'Жариялануда...' : 'Публикуется...') : '💾 ' + (language === 'kz' ? 'Сақтау және жариялау' : 'Сохранить и опубликовать')}
              </button>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default QuizBuilder;
