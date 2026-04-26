import React, { useState, useRef, useEffect } from 'react';
import { useGameState } from '../context/GameStateContext';

const knowledgeBase = {
  ru: [
    { keywords: ['столица', 'астана'], answer: 'Астана — столица Казахстана с 1997 года. Это современный город с уникальной архитектурой: монумент Байтерек (97 м), Дворец Мира и Согласия, Хан Шатыр и грандиозный ЭКСПО-2017.' },
    { keywords: ['байконур', 'космодром'], answer: 'Байконур — первый и крупнейший космодром в мире, расположенный в Кызылординской области. Отсюда 12 апреля 1961 года в космос полетел Юрий Гагарин.' },
    { keywords: ['байтерек', 'монумент'], answer: 'Монумент "Байтерек" в Астане символизирует Дерево жизни. Высота — 97 метров, что связано с переносом столицы в 1997 году.' },
    { keywords: ['западно-казахстанская', 'бко', 'зко', 'батыс қазақстан', 'уральск', 'орал'], answer: 'Западно-Казахстанская область (ЗКО) — регион на стыке Европы и Азии. Административный центр — город Уральск. Площадь: 151 339 км². Население: около 686 000 человек. Регион богат историческим наследием, здесь расположен главный водный ресурс — река Урал (Жайык). Основные отрасли: нефтегазовая промышленность, сельское хозяйство.' },
    { keywords: ['алматы', 'мегаполис'], answer: 'Алматы — крупнейший город Казахстана, культурная и деловая столица страны с населением более 2 млн человек. Расположен у подножия гор Заилийского Алатау.' },
    { keywords: ['шымкент'], answer: 'Шымкент — третий по величине город Казахстана. Расположен на юге страны, является экономическим и культурным центром южного региона.' },
    { keywords: ['атырау', 'каспий'], answer: 'Атырауская область — нефтяная столица Казахстана, расположена на берегу Каспийского моря. Здесь добывается значительная часть казахстанской нефти.' },
    { keywords: ['актобе', 'актюбинск'], answer: 'Актюбинская область — крупнейшая по территории область Казахстана (300 629 км²). Административный центр — Актобе. Регион богат нефтью, хромитами и другими полезными ископаемыми.' },
    { keywords: ['мангистау', 'актау'], answer: 'Мангистауская область расположена на берегу Каспийского моря. Центр — Актау. Известна уникальными «марсианскими» пейзажами, подземными мечетями и богатыми запасами нефти.' },
    { keywords: ['гагарин', 'полет'], answer: 'Юрий Гагарин стал первым человеком, покорившим космос. Его корабль стартовал с космодрома Байконур в Кызылординской области Казахстана.' },
    { keywords: ['привет', 'здравствуй', 'здравствуйте', 'помогите', 'помощь'], answer: 'Привет! 👋 Я AI-гид по Казахстану. Спрашивайте меня про любые регионы, города, историю и географию Казахстана!' }
  ],
  kz: [
    { keywords: ['астана', 'елорда'], answer: 'Астана — 1997 жылдан бері Қазақстанның елордасы. Ол Бәйтерек, Бейбітшілік және Келісім сарайы, Хан Шатыр сияқты ерекше ғимараттарымен танымал. ЭКСПО-2017 де осы қалада өтті.' },
    { keywords: ['байқоңыр', 'ғарыш айлағы', 'ғарыш'], answer: 'Байқоңыр — әлемдегі ең алғашқы әрі ірі ғарыш айлағы. Ол Қызылорда облысында орналасқан. 1961 жылы осы жерден тұңғыш рет Юрий Гагарин ғарышқа ұшты.' },
    { keywords: ['бәйтерек', 'монумент'], answer: 'Астанадағы "Бәйтерек" монументі Өмір ағашын бейнелейді. Биіктігі 97 метр — астананы 1997 жылы ауыстырумен байланысты.' },
    { keywords: ['батыс қазақстан', 'бқо', 'орал', 'жайық', 'зко'], answer: 'Батыс Қазақстан облысы (БҚО) — Еуропа мен Азияның қиылысында орналасқан аймақ. Орталығы — Орал қаласы. Ауданы: 151 339 км². Халқы: шамамен 686 000 адам. Аймақта Жайық өзені ағады. Мұнай-газ өнеркәсібі мен ауыл шаруашылығы жетекші салалар болып табылады.' },
    { keywords: ['алматы'], answer: 'Алматы — Қазақстанның ең ірі қаласы, 2 миллионнан астам халқы бар мәдени және іскерлік орталық. Іле Алатауы тауларының етегінде орналасқан.' },
    { keywords: ['шымкент'], answer: 'Шымкент — Қазақстанның үшінші ірі қаласы. Оңтүстік Қазақстанның экономикалық және мәдени орталығы.' },
    { keywords: ['атырау', 'каспий'], answer: 'Атырау облысы — Қазақстанның мұнай астанасы, Каспий теңізінің жағасында орналасқан.' },
    { keywords: ['ақтөбе', 'ақтөбинск'], answer: 'Ақтөбе облысы — Қазақстанның ең үлкен облысы (300 629 км²). Мұнай, хром және басқа пайдалы қазбаларға бай аймақ.' },
    { keywords: ['маңғыстау', 'ақтау'], answer: 'Маңғыстау облысы Каспий теңізінің жағасында орналасқан. Орталығы — Ақтау. «Марсиандық» пейзаждары мен жер асты мешіттерімен танымал.' },
    { keywords: ['гагарин', 'ұшу'], answer: 'Юрий Гагарин ғарышқа алғаш ұшқан адам. Оның кемесі Байқоңыр ғарыш айлағынан ұшырылды.' },
    { keywords: ['сәлем', 'салем', 'көмек'], answer: 'Сәлем! 👋 Мен Қазақстан туралы AI-гидпін. Маған Қазақстанның кез келген аймағы, қалалары, тарихы мен географиясы туралы сұрақ қоя аласыз!' }
  ]
};

const suggestions = {
  ru: ['Расскажи про БКО / Уральск', 'Факты о Байконуре', 'Что такое Байтерек?', 'Расскажи про Мангистау'],
  kz: ['БҚО / Орал туралы айтып бер', 'Байқоңыр туралы фактілер', 'Маңғыстау туралы айт', 'Астана туралы айтып бер']
};

let nextId = 10;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const AITutor = () => {
  const { language } = useGameState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: language === 'kz' ? "Сәлем! 👋 Мен Қазақстанның барлық аймақтары бойынша сіздің жеке гидпін. БҚО, Астана, Байқоңыр және басқа аймақтар туралы сұрай беріңіз!" : "Привет! 👋 Я ваш гид по всему Казахстану. Спрашивайте про ЗКО, Астану, Байконур и любые другие регионы!", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ 
      id: 1, 
      text: language === 'kz' ? "Сәлем! 👋 Мен Қазақстанның барлық аймақтары бойынша сіздің жеке гидпін. БҚО, Астана, Байқоңыр және басқа аймақтар туралы сұрай беріңіз!" : "Привет! 👋 Я ваш гид по всему Казахстану. Спрашивайте про ЗКО, Астану, Байконур и любые другие регионы!", 
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
      // Жестко привязываем ключ OpenRouter
      const apiKey = OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
      
      if (apiKey) {
        const systemPrompt = `You are a knowledgeable AI guide specialized in Kazakhstan's geography, regions, history, and culture.
        Current language: ${language === 'kz' ? 'Kazakh' : 'Russian'}. 
        You MUST answer in ${language === 'kz' ? 'Kazakh' : 'Russian'} and provide accurate, educational information.
        You can answer about: all regions of Kazakhstan (including West Kazakhstan / ЗКО / БҚО, Astana, Baikonur, Almaty, Shymkent, Atyrau, Aktobe, Mangistau, Karaganda, etc.), Kazakhstani geography, history, culture, landmarks, economy, and nature.
        If the user asks about topics completely unrelated to Kazakhstan, politely redirect them to Kazakhstan-related topics.
        Keep your answers concise and engaging (max 3-4 sentences).`;

        // Simple chat history (last 4 messages)
        const historyPart = messages.slice(-4).map(m => 
          `${m.sender === 'ai' ? 'Bot' : 'User'}: ${m.text}`
        ).join('\n');

        const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "openrouter/free",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Chat History:\n${historyPart}\n\nUser Question: ${messageText}` }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices?.[0]?.message?.content) {
            answer = "🤖 " + data.choices[0].message.content;
          } else {
            answer = "🤖 [AI не смог ничего ответить на ваш запрос. Лимит или блокировка]";
          }
        } else {
          const errorText = await response.text();
          console.error('OpenRouter API Error Status:', response.status, errorText);
          answer = `🤖 [Ошибка API: HTTP ${response.status}]`;
        }
      } else {
        answer = "🤖 [ОШИБКА: Ключ API пустой или не загрузился]";
      }
    } catch (error) {
      console.error('AI Bot Request Failed:', error);
      answer = `🤖 [Ошибка соединения с Google: ${error.message}]`;
    }

    // 2. Fallback to Local Knowledge Base
    if (!answer) {
      answer = findAnswer(messageText);
    }

    // 3. Last Resort
    if (!answer) {
      answer = language === 'kz' 
        ? "Бұл туралы толық ақпарат таба алмадым. Қазақстанның аймақтары, қалалары немесе тарихы туралы сұрақ қойып көріңіз!" 
        : "Не нашёл точной информации по этому вопросу. Попробуйте спросить о регионах, городах или истории Казахстана!";
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
              <span className={`status-dot ${OPENROUTER_API_KEY ? 'online' : 'offline'}`}></span>
              {OPENROUTER_API_KEY 
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
