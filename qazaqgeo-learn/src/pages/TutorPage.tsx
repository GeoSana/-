import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, GraduationCap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type TutorMode = 'qa' | 'learning';

export default function TutorPage() {
  const [mode, setMode] = useState<TutorMode>('qa');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Сәлеметсіз бе! Я ваш виртуальный тьютор по географии Казахстана. Задавайте любые вопросы о природе, ресурсах, городах или истории нашей страны!',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize default chat on mount
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Ты — ИИ-Тьютор образовательной платформы QazaqGeo Learn. Твоя задача — помогать пользователям изучать географию, природу, экономику и историю Казахстана. Отвечай дружелюбно, информативно и на русском языке. Используй эмодзи для оживления текста.',
      }
    });
  }, []);

  const handleModeChange = async (newMode: TutorMode) => {
    if (newMode === mode || isLoading) return;
    
    setMode(newMode);
    setMessages([]);
    setInput('');
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const systemInstruction = newMode === 'qa' 
      ? 'Ты — ИИ-Тьютор образовательной платформы QazaqGeo Learn. Твоя задача — помогать пользователям изучать географию, природу, экономику и историю Казахстана. Отвечай дружелюбно, информативно и на русском языке. Используй эмодзи для оживления текста.'
      : 'Ты — ИИ-Экзаменатор по геологии Казахстана. Твоя задача — проводить интерактивное обучение, задавая пользователю вопросы по геологии, полезным ископаемым, рельефу и тектоническому строению Казахстана. Задавай строго по одному вопросу. Жди ответ пользователя, оценивай его, кратко объясняй правильный ответ (если нужно) и задавай следующий вопрос. Будь дружелюбным, поддерживающим преподавателем. Используй эмодзи.';

    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
      }
    });

    if (newMode === 'qa') {
      setMessages([{
        id: Date.now().toString(),
        text: 'Сәлеметсіз бе! Я ваш виртуальный тьютор по географии Казахстана. Задавайте любые вопросы о природе, ресурсах, городах или истории нашей страны!',
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } else {
      setIsLoading(true);
      try {
        const response = await chatRef.current.sendMessage({ message: 'Привет! Представься как экзаменатор по геологии Казахстана и задай мне первый вопрос.' });
        setMessages([{
          id: Date.now().toString(),
          text: response.text || 'Привет! Готов к первому вопросу по геологии Казахстана?',
          sender: 'bot',
          timestamp: new Date(),
        }]);
      } catch (error) {
        console.error('Error generating response:', error);
        setMessages([{
          id: Date.now().toString(),
          text: 'Произошла ошибка при запуске режима обучения. Пожалуйста, попробуйте позже.',
          sender: 'bot',
          timestamp: new Date(),
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
         const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
         chatRef.current = ai.chats.create({
           model: 'gemini-3-flash-preview',
           config: {
             systemInstruction: mode === 'qa' 
               ? 'Ты — ИИ-Тьютор образовательной платформы QazaqGeo Learn. Твоя задача — помогать пользователям изучать географию, природу, экономику и историю Казахстана. Отвечай дружелюбно, информативно и на русском языке. Используй эмодзи для оживления текста.'
               : 'Ты — ИИ-Экзаменатор по геологии Казахстана. Твоя задача — проводить интерактивное обучение, задавая пользователю вопросы по геологии, полезным ископаемым, рельефу и тектоническому строению Казахстана. Задавай строго по одному вопросу. Жди ответ пользователя, оценивай его, кратко объясняй правильный ответ (если нужно) и задавай следующий вопрос. Будь дружелюбным, поддерживающим преподавателем. Используй эмодзи.'
           }
         });
      }

      const response = await chatRef.current.sendMessage({ message: input });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || 'Извините, я не смог найти ответ на ваш вопрос.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Произошла ошибка при обращении к базе знаний. Пожалуйста, попробуйте позже.',
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 lg:p-8 bg-[#060B14]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500 ${
            mode === 'qa' 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/30' 
              : 'bg-gradient-to-br from-[#00A3FF] to-blue-600 shadow-[#00A3FF]/30'
          }`}>
            {mode === 'qa' ? <Bot className="w-6 h-6 text-white" /> : <GraduationCap className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-serif">ИИ-Тьютор</h1>
            <p className="text-slate-400">
              {mode === 'qa' ? 'Ваш персональный гид по географии Казахстана' : 'Проверка знаний по геологии Казахстана'}
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-[#0A1120] p-1.5 rounded-2xl border border-white/5 shadow-xl">
          <button
            onClick={() => handleModeChange('qa')}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === 'qa' 
                ? 'bg-white/10 text-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Свободное общение
          </button>
          <button
            onClick={() => handleModeChange('learning')}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === 'learning' 
                ? 'bg-white/10 text-[#00A3FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Режим обучения
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0A1120] border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-[#00A3FF]/20 border border-[#00A3FF]/30 text-[#00A3FF]' 
                    : mode === 'learning' 
                      ? 'bg-[#00A3FF]/20 border border-[#00A3FF]/30 text-[#00A3FF]'
                      : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : (mode === 'learning' ? <GraduationCap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />)}
                </div>
                
                <div className={`p-4 rounded-2xl text-[15px] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#00A3FF]/10 border border-[#00A3FF]/20 text-blue-50 rounded-tr-sm'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 max-w-[80%]"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                mode === 'learning' 
                  ? 'bg-[#00A3FF]/20 border border-[#00A3FF]/30 text-[#00A3FF]'
                  : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              }`}>
                {mode === 'learning' ? <GraduationCap className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/5 border-t border-white/5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'qa' ? "Спросите меня о самой длинной реке или космодроме..." : "Введите ваш ответ..."}
              className="w-full bg-[#060B14]/50 border border-white/10 rounded-xl py-4 pl-6 pr-16 text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF]/50 focus:ring-1 focus:ring-[#00A3FF]/50 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-[#00A3FF] hover:bg-[#008DE0] disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(0,163,255,0.3)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
