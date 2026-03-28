import React, { useState, useRef, useEffect } from 'react';
import { useGameState } from '../context/GameStateContext';

const knowledgeBase = {
  ru: [
    { keywords: ['столица', 'астана'], answer: 'Астана — столица Казахстана с 1997 года. Это современный город с уникальной архитектурой, такой как символ Байтерек, Дворец Мира и Согласия и Хан Шатыр.' },
    { keywords: ['байконур', 'космодром'], answer: 'Байконур — первый и крупнейший космодром в мире, расположенный в Кызылординской области. Отсюда 12 апреля 1961 года в космос полетел Юрий Гагарин.' },
    { keywords: ['байтерек', 'монумент'], answer: 'Монумент "Байтерек" в Астане символизирует Дерево жизни. Высота сооружения составляет 97 метров, что связано с переносом столицы в 1997 году.' },
    { keywords: ['гагарин', 'полет'], answer: 'Юрий Гагарин стал первым человеком, покорившим космос. Его корабль стартовал с космодрома Байконур.' },
    { keywords: ['привет', 'здравствуй', 'здравствуйте'], answer: 'Привет! Я виртуальный гид. Спрашивай меня только об Астане и Байконуре!' }
  ],
  kz: [
    { keywords: ['астана', 'елорда'], answer: 'Астана — 1997 жылдан бері Қазақстанның елордасы. Ол Бәйтерек, Бейбітшілік және Келісім сарайы сияқты ерекше ғимараттарымен танымал.' },
    { keywords: ['байқоңыр', 'ғарыш'], answer: 'Байқоңыр — әлемдегі ең алғашқы әрі ірі ғарыш айлағы. Ол Қызылорда облысында орналасқан. 1961 жылы осы жерден тұңғыш рет Юрий Гагарин ғарышқа ұшты.' },
    { keywords: ['бәйтерек', 'монумент'], answer: 'Астанадағы "Бәйтерек" монументі Өмір ағашын бейнелейді. Биіктігі 97 метр, ол астананы ауыстырған 1997 жылмен тікелей байланысты.' },
    { keywords: ['гагарин', 'ұшу'], answer: 'Юрий Гагарин ғарышқа алғаш ұшқан адам. Оның кемесі Байқоңыр ғарыш айлағынан ұшырылды.' },
    { keywords: ['сәлем'], answer: 'Сәлем! Мен виртуалды гидпін. Маған тек Астана мен Байқоңыр туралы сұрақтар қоя аласыз!' }
  ]
};

const suggestions = {
  ru: ['Расскажи про Астану', 'Факты о Байконуре', 'Что означает Байтерек?'],
  kz: ['Астана туралы айтып бер', 'Байқоңыр туралы фактілер', 'Бәйтерек не мағына береді?']
};

let nextId = 10;

const AITutor = () => {
  const { language } = useGameState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: language === 'kz' ? "Сәлем! 👋 Мен сіздің Астана және Байқоңыр бойынша жеке гидпін. Осы тақырыптар бойынша сұрай беріңіз!" : "Салем! 👋 Я ваш гид по Астане и Байконуру. Задавайте ваши вопросы об этих двух местах!", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ 
      id: 1, 
      text: language === 'kz' ? "Сәлем! 👋 Мен сіздің Астана және Байқоңыр бойынша жеке гидпін. Осы тақырыптар бойынша сұрай беріңіз!" : "Салем! 👋 Я ваш гид по Астане и Байконуру. Задавайте ваши вопросы об этих двух местах!", 
      sender: 'ai' 
    }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const findAnswer = (question) => {
    const lowerQ = question.toLowerCase();
    const currentKB = knowledgeBase[language];
    for (const item of currentKB) {
      if (item.keywords.some(kw => lowerQ.includes(kw))) {
        return item.answer;
      }
    }
    return null;
  };

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { id: nextId++, text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    let answer = null;

    // 1. Try AI first
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (apiKey && apiKey.length > 20 && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        const systemPrompt = `You are a strict AI tutor specialized ONLY in two topics: Astana (the capital of Kazakhstan) and Baikonur (the spaceport).
        Current language: ${language === 'kz' ? 'Kazakh' : 'Russian'}. 
        You MUST answer in ${language === 'kz' ? 'Kazakh' : 'Russian'} and provide accurate, educational information.
        IMPORTANT: If the user asks about ANYTHING other than Astana, Baikonur, or space exploration from Kazakhstan, you must politely refuse to answer and remind them that your scope is limited strictly to Astana and Baikonur.
        Keep your answers concise and engaging (max 3-4 sentences).`;

        // Simple chat history (last 4 messages)
        const historyPart = messages.slice(-4).map(m => 
          `${m.sender === 'ai' ? 'Bot' : 'User'}: ${m.text}`
        ).join('\n');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\nChat History:\n${historyPart}\n\nUser Question: ${messageText}` }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            answer = data.candidates[0].content.parts[0].text;
          }
        } else {
          const errorText = await response.text();
          console.error('Gemini API Error Status:', response.status, errorText);
        }
      }
    } catch (error) {
      console.error('AI Bot Request Failed:', error);
    }

    // 2. Fallback to Local Knowledge Base
    if (!answer) {
      answer = findAnswer(messageText);
    }

    // 3. Last Resort
    if (!answer) {
      answer = language === 'kz' 
        ? "Кешіріңіз, бұл тақырып бойынша жауап бере алмаймын. Мен тек Астана және Байқоңыр туралы сұрақтарға жауап беремін." 
        : "Извините, я не могу ответить на этот вопрос. Пожалуйста, задавайте вопросы только про Астану или Байконур.";
    }

    setMessages(prev => [...prev, { id: Date.now(), text: answer, sender: 'ai' }]);
    setIsTyping(false);
  };

  return (
    <div className={`floating-chat-widget ${isOpen ? 'expanded' : ''}`}>
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
        <span className="fab-icon">{isOpen ? '✕' : '🤖'}</span>
      </button>

      <div className="chat-popup glass-card">
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div className="chat-header-text">
            <div className="chat-title">AI QazaqBot</div>
            <div className="status-indicator">
              <span className={`status-dot ${import.meta.env.VITE_GEMINI_API_KEY ? 'online' : 'offline'}`}></span>
              {import.meta.env.VITE_GEMINI_API_KEY 
                ? (language === 'kz' ? 'Жүйе желіде (AI)' : 'Система онлайн (AI)') 
                : (language === 'kz' ? 'Білім қоры (Offline)' : 'База знаний (Offline)')}
            </div>
          </div>
        </div>

        <div className="chat-body scrollbar-custom">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender === 'ai' ? 'message-ai' : 'message-user'}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="message message-ai typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && !isTyping && (
          <div className="chat-suggestions">
            {suggestions[language].map((s, idx) => (
              <button key={idx} onClick={() => handleSend(s)} className="suggestion-pill">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-area">
          <div className="input-group">
            <input 
              type="text" 
              className="chat-input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'kz' ? "Сұрақ қойыңыз..." : "Спросите меня о чем-нибудь..."}
            />
            <button onClick={() => handleSend()} className="chat-send-btn">➔</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
