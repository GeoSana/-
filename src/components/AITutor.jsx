import React, { useState, useRef, useEffect } from 'react';
import { useGameState } from '../context/GameStateContext';

const knowledgeBase = {
  ru: [
    { keywords: ['площадь', 'территория', 'размер'], answer: 'Площадь Казахстана — 2 724 900 км². Это 9-я по величине страна в мире и самая большая среди стран, не имеющих выхода к морю.' },
    { keywords: ['столица', 'астана'], answer: 'Столица Казахстана — Астана. Она стала столицей в 1997 году. Это современный город с уникальной архитектурой, такой как Байтерек и Хан Шатыр.' },
    { keywords: ['самая длинная река', 'иртыш', 'реки'], answer: 'Самая длинная река — Иртыш (1700 км по РК). Также крупные реки: Сырдарья, Урал (Жайык), Или и Чу.' },
    { keywords: ['байконур', 'космодром'], answer: 'Байконур — первый и крупнейший космодром в мире. Отсюда был запущен первый спутник и первый человек в космос — Юрий Гагарин.' },
    { keywords: ['население', 'жители', 'сколько людей'], answer: 'Население Казахстана — более 20 миллионов человек. Страна является многонациональной и гостеприимной.' },
    { keywords: ['алматы', 'алма-ата'], answer: 'Алматы — крупнейший город Казахстана, "южная столица". Знаменит своими горами (Заилийский Алатау), катком Медеу и горнолыжным курортом Шымбулак.' },
    { keywords: ['каспий', 'озеро', 'море'], answer: 'Каспийское море — самое большое озеро в мире. На западе Казахстана развита добыча нефти именно в этом регионе.' },
    { keywords: ['балхаш'], answer: 'Озеро Балхаш уникально тем, что его восточная часть соленая, а западная — пресная.' },
    { keywords: ['степь', 'природа'], answer: 'Степи занимают около 26% территории Казахстана. Это родина тюльпанов и древних кочевников.' },
    { keywords: ['горы', 'пик', 'хан', 'тенгри'], answer: 'Самая высокая точка — пик Хан-Тенгри (6995 м). Основные горные системы: Алтай, Тянь-Шань и Сарыарка.' },
    { keywords: ['символ', 'байтерек'], answer: 'Монумент "Байтерек" в Астане символизирует дерево жизни и по легенде хранит яйцо священной птицы Самрук.' },
    { keywords: ['флаг', 'герб', 'гимн', 'голубой'], answer: 'Государственный флаг Казахстана имеет голубой цвет со стилизованным солнцем и парящим беркутом в центре.' },
    { keywords: ['язык', 'казахский', 'русский'], answer: 'Государственным языком является казахский. Русский язык имеет статус официального и используется в межнациональном общении.' },
    { keywords: ['деньги', 'тенге'], answer: 'Национальная валюта — тенге (KZT). Она была введена 15 ноября 1993 года.' },
    { keywords: ['привет', 'здравствуй', 'здравствуйте'], answer: 'Привет! Я виртуальный гид по географии Казахстана. О чем хочешь узнать?' },
  ],
  kz: [
    { keywords: ['алаң', 'аумақ', 'көлем'], answer: 'Қазақстанның аумағы — 2 724 900 км². Бұл әлемдегі 9-шы орын және теңізге шыға алмайтын ең үлкен ел.' },
    { keywords: ['астана'], answer: 'Қазақстанның астанасы — Астана қаласы. Ол 1997 жылы астана мәртебесін алды. Бәйтерек пен Хан Шатыр сияқты бірегей ғимараттарымен танымал.' },
    { keywords: ['өзен', 'ертіс'], answer: 'Ең ұзын өзен — Ертіс (ел ішінде 1700 км). Сондай-ақ Сырдария, Жайық, Іле және Шу өзендері өте маңызды.' },
    { keywords: ['байқоңыр', 'ғарыш'], answer: 'Байқоңыр — әлемдегі алғашқы және ең үлкен ғарыш айлағы. Мұнда бірінші жасанды серік пен тұңғыш ғарышкер Юрий Гагарин ұшты.' },
    { keywords: ['халық', 'адам саны'], answer: 'Қазақстан халқы 20 миллионнан асты. Еліміз көпұлтты және қонақжай.' },
    { keywords: ['алматы'], answer: 'Алматы — Қазақстанның ең үлкен қаласы, "Оңтүстік астана". Медеу мұз айдыны мен Шымбұлақ курортымен танымал.' },
    { keywords: ['каспий', 'теңіз'], answer: 'Каспий теңізі — әлемдегі ең үлкен көл. Еліміздің батысында мұнай өндіру осы аймақпен тығыз байланысты.' },
    { keywords: ['балқаш'], answer: 'Балқаш көлінің ерекшелігі — оның шығыс бөлігі тұзды, ал батыс бөлігі тұщы болып келеді.' },
    { keywords: ['дала', 'табиғат'], answer: 'Қазақстан аумағының 26%-ын дала алып жатыр. Бұл қызғалдақтардың отаны.' },
    { keywords: ['тау', 'шың', 'хан', 'тәңірі'], answer: 'Ең биік нүкте — Хан-Тәңірі шыңы (6995 м). Негізгі тау жүйелері: Алтай, Тянь-Шань және Сарыарқа.' },
    { keywords: ['нышан', 'бәйтерек'], answer: 'Астанадағы "Бәйтерек" монументі өмір ағашын бейнелейді және аңыз бойынша Самұрық құсының жұмыртқасын сақтайды.' },
    { keywords: ['ту', 'елтаңба', 'әнұран', 'көк'], answer: 'Қазақстанның мемлекеттік туы көк түсті, ортасында күн мен қалықтаған бүркіт бейнеленген.' },
    { keywords: ['тіл', 'қазақша', 'қазақ тілі'], answer: 'Мемлекеттік тіл — қазақ тілі. Орыс тілі ресми мәртебеге ие.' },
    { keywords: ['ақша', 'теңге'], answer: 'Ұлттық валюта — теңге (KZT). Ол 1993 жылы 15 қарашада енгізілді.' },
    { keywords: ['сәлем'], answer: 'Сәлем! Мен Қазақстан географиясы бойынша виртуалды гидпін. Не туралы білгіңіз келеді?' },
  ]
};

const suggestions = {
  ru: ['Какая столица Казахстана?', 'Расскажи про Байконур', 'Сколько людей в стране?'],
  kz: ['Қазақстанның астанасы қай қала?', 'Байқоңыр туралы айтып бер', 'Халық саны қанша?']
};

let nextId = 10;

const AITutor = () => {
  const { language } = useGameState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: language === 'kz' ? "Сәлем! 👋 Мен сіздің Қазақстан географиясы бойынша жеке гидпін. Бүгін не туралы білгіңіз келеді?" : "Салем! 👋 Я ваш персональный гид по географии Казахстана. О чем вы хотели бы узнать сегодня?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ 
      id: 1, 
      text: language === 'kz' ? "Сәлем! 👋 Мен сіздің Қазақстан географиясы бойынша жеке гидпін. Бүгін не туралы білгіңіз келеді?" : "Салем! 👋 Я ваш персональный гид по географии Казахстана. О чем вы хотели бы узнать сегодня?", 
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
      
      if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        const systemPrompt = `You are a helpful AI guide for Kazakhstan geography. 
        Answer in ${language === 'kz' ? 'Kazakh' : 'Russian'}. 
        Keep answers concise and informative. 
        Use the following knowledge base if relevant: ${JSON.stringify(knowledgeBase[language])}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Question: ${messageText}` }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            answer = data.candidates[0].content.parts[0].text;
          }
        } else {
          const errData = await response.json();
          console.error('Gemini API error details:', errData);
        }
      } else {
        console.warn('VITE_GEMINI_API_KEY is missing or invalid in .env');
      }
    } catch (error) {
      console.error('AI API call failed:', error);
    }

    // 2. Fallback to Local Knowledge Base if AI failed or returned no answer
    if (!answer) {
      answer = findAnswer(messageText);
    }

    // 3. Default response if nothing found
    if (!answer) {
      answer = language === 'kz' 
        ? "Бұл өте жақсы сұрақ! Қазақстан туралы шексіз айтуға болады. Нақтырақ не білгіңіз келеді?" 
        : "Это отличный вопрос! О Казахстане можно рассказывать бесконечно. Что именно вы хотели бы уточнить?";
    }

    setMessages(prev => [...prev, { id: nextId++, text: answer, sender: 'ai' }]);
    setIsTyping(false);
  };

  return (
    <div className={`floating-chat-widget ${isOpen ? 'expanded' : ''}`}>
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
        <span className="fab-icon">{isOpen ? '✕' : '🤖'}</span>
      </button>

      <div className="chat-popup glass-card">
        <div className="chat-header">
          <div className="chat-avatar">🇰🇿</div>
          <div className="chat-header-text">
            <div className="chat-title">AI QazaqBot</div>
            <div className="status-indicator">
              <span className="dot" style={{ backgroundColor: import.meta.env.VITE_GEMINI_API_KEY ? '#10b981' : '#f59e0b' }}></span>
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
          {isTyping && <div className="message message-ai typing">...</div>}
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
