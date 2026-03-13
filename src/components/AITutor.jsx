import React, { useState, useRef, useEffect } from 'react';

const knowledgeBase = [
  { keywords: ['площадь', 'территория', 'размер'], answer: 'Площадь Казахстана составляет около 2 724 900 км² — это 9-я по величине страна в мире. Территория протянулась на 3000 км с запада на восток и на 1700 км с севера на юг.' },
  { keywords: ['столица', 'астана'], answer: 'Столицей Казахстана является город Астана (ранее Нур-Султан). Он расположен в центральной части страны и стал столицей в 1997 году, сменив Алматы.' },
  { keywords: ['самая длинная река', 'иртыш'], answer: 'Самая длинная река в Казахстане — Иртыш, её протяженность на территории страны составляет 1 700 км. Общая длина Иртыша — 4 248 км.' },
  { keywords: ['самая высокая точка', 'хан-тенгри', 'пик'], answer: 'Самая высокая точка Казахстана — пик Хан-Тенгри (7 010 м). Расположен на стыке границ Казахстана, Кыргызстана и Китая в горах Тянь-Шань.' },
  { keywords: ['озеро', 'балхаш', 'каспий'], answer: 'Крупнейшие озёра Казахстана: Каспийское море (на западе), озеро Балхаш (уникально тем, что одна часть пресная, другая — солёная), и Аральское море.' },
  { keywords: ['население', 'сколько людей', 'жители'], answer: 'Население Казахстана превышает 20 миллионов человек. Крупнейшие города: Алматы (~2 млн), Астана (~1.4 млн), Шымкент (~1.2 млн).' },
  { keywords: ['байконур', 'космодром', 'космос'], answer: 'Космодром Байконур — первый и крупнейший космодром в мире! Он расположен в Кызылординской области. Именно отсюда 12 апреля 1961 года Юрий Гагарин отправился в первый полёт в космос.' },
  { keywords: ['алматы', 'южная столица'], answer: 'Алматы — крупнейший город и бывшая столица Казахстана. Расположен у подножия гор Заилийского Алатау. Знаменит парком Кок-Тобе, катком Медеу и горнолыжным курортом Шымбулак.' },
  { keywords: ['пустыня', 'степь'], answer: 'Большая часть Казахстана — степи и полупустыни. Самая крупная пустыня — Кызылкум на юге. Также выделяются Бетпак-Дала (Голодная степь) и плато Устюрт.' },
  { keywords: ['граница', 'соседи', 'сосед'], answer: 'Казахстан граничит с 5 странами: Россия (на севере), Китай (на востоке), Кыргызстан, Узбекистан и Туркменистан (на юге). Общая длина границ ~ 13 200 км.' },
  { keywords: ['чарын', 'каньон'], answer: 'Чарынский каньон — уникальный памятник природы в Алматинской области. Его возраст 12 миллионов лет! Длина каньона — около 154 км, а самая известная часть — "Долина замков".' },
  { keywords: ['полезные ископаемые', 'нефть', 'уран', 'ресурс'], answer: 'Казахстан богат полезными ископаемыми: 1-е место в мире по запасам урана, в топ-10 по нефти, газу, хрому, свинцу и цинку. Нефтяные месторождения сосредоточены на западе (Кашаган, Тенгиз).' },
  { keywords: ['шёлковый путь', 'шелковый'], answer: 'Великий Шёлковый путь проходил через территорию Казахстана. Крупнейшие города на этом пути: Туркестан, Тараз, Отрар. Сейчас наследие Шёлкового пути — важная часть культурного туризма.' },
];

const suggestions = [
  'Какая столица Казахстана?',
  'Расскажи про Байконур',
  'Самая высокая точка?',
  'Что такое Чарынский каньон?',
];

const AITutor = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Салем! 👋 Я ваш персональный гид по географии Казахстана. О чем вы хотели бы узнать сегодня?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const findAnswer = (question) => {
    const lowerQ = question.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(kw => lowerQ.includes(kw))) {
        return item.answer;
      }
    }
    return `Это отличный вопрос! О Казахстане можно рассказывать бесконечно. Может быть, вас интересуют конкретные регионы, природные заповедники или история развития наших городов?`;
  };

  const handleSend = (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { id: Date.now(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(messageText);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: answer, sender: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="tutor-container">
      <div className="tutor-info decorate-anim">
        <h3 className="font-serif tutor-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
          Ваш персональный <br /><span style={{ color: 'var(--primary)' }}>путеводитель</span>
        </h3>
        <p className="tutor-desc" style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Наш искусственный интеллект глубоко изучил географии, культуру и ресурсы всех 17 областей Казахстана, чтобы помочь вам в обучении.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {suggestions.map((s, idx) => (
            <button 
              key={idx} 
              onClick={() => handleSend(s)}
              style={{
                background: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                color: 'var(--primary)',
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              className="suggestion-btn"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card tutor-chat">
        <div className="chat-header">
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', color: 'white',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)'
          }}>
            🇰🇿
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>AI QazaqBot</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></span>
              Система активна
            </div>
          </div>
        </div>

        <div className="chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender === 'ai' ? 'message-ai' : 'message-user'}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="message message-ai" style={{ opacity: 0.7 }}>
              Аназизирую запрос...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Введите ваш вопрос здесь..."
            />
            <button 
              onClick={() => handleSend()}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.8rem',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ➔
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .suggestion-btn:hover {
          background: rgba(14, 165, 233, 0.15) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .tutor-title {
            font-size: 2rem !important;
            margin-bottom: 1rem !important;
          }
          .tutor-desc {
            font-size: 1rem !important;
            margin-bottom: 1.5rem !important;
          }
          .tutor-chat {
            height: 450px !important;
          }
          .chat-header {
            padding: 1rem !important;
          }
          .chat-body {
            padding: 1rem !important;
          }
          .chat-input-area {
            padding: 1rem !important;
          }
        }
        @media (max-width: 480px) {
          .tutor-title {
            font-size: 1.75rem !important;
          }
          .suggestion-btn {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default AITutor;
