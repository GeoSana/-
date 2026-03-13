import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Map, Car, Flag, Globe, ChevronLeft, Mountain, Landmark, Utensils, BookOpen, Music, Star, Cpu } from 'lucide-react';
import { cn } from '../utils/cn';
import { quizzesData, type Quiz } from '../data/quizzes';

// Map string names to actual Lucide components
const iconMap = {
  Map: Map,
  Car: Car,
  Flag: Flag,
  Globe: Globe,
  Mountain: Mountain,
  Landmark: Landmark,
  Utensils: Utensils,
  BookOpen: BookOpen,
  Music: Music,
  Trophy: Trophy,
  Star: Star,
  Cpu: Cpu,
};

export default function QuizPage() {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeQuiz = quizzesData.find(q => q.id === activeQuizId);

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered || !activeQuiz) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === activeQuiz.questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (!activeQuiz) return;

    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const returnToMenu = () => {
    setActiveQuizId(null);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 bg-[#060B14]">
      <div className="w-full max-w-7xl">
        
        <AnimatePresence mode="wait">
          {!activeQuizId ? (
            // --- QUIZ SELECTION MENU ---
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 font-serif">Проверка Знаний</h1>
                <p className="text-slate-400 text-lg">Выберите тему для проверки своих знаний о Казахстане</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {quizzesData.map((quiz, index) => {
                  const Icon = iconMap[quiz.iconName];
                  return (
                    <motion.button
                      key={quiz.id}
                      onClick={() => handleStartQuiz(quiz.id)}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative rounded-2xl text-left transition-all duration-500 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,163,255,0.15)] flex flex-col h-[400px] w-full border border-white/5 hover:border-[#00A3FF]/30 bg-[#0A1120]"
                    >
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 group-hover:scale-110" 
                        style={{ backgroundImage: `url(https://picsum.photos/seed/${quiz.id}/400/800)` }} 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-[#060B14]/80 to-transparent" />
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full p-6">
                        {/* Top: Icon & Badge */}
                        <div className="flex justify-between items-start mb-auto">
                          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-[#00A3FF]/20 group-hover:border-[#00A3FF]/50 transition-colors">
                            <Icon className="w-6 h-6 text-white group-hover:text-[#00A3FF] transition-colors" />
                          </div>
                          <div className="inline-flex items-center text-xs font-bold text-white bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            {quiz.questions.length} вопр.
                          </div>
                        </div>
                        
                        {/* Bottom: Text & Action */}
                        <div className="mt-auto pt-4">
                          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00A3FF] transition-colors leading-tight drop-shadow-md font-serif">{quiz.title}</h3>
                          <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3 drop-shadow">
                            {quiz.description}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-white/10 group-hover:border-[#00A3FF]/30 transition-colors">
                            <span className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-[#00A3FF] transition-colors">
                              Начать
                            </span>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#00A3FF] group-hover:text-white text-white transition-all duration-300 group-hover:translate-x-1">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            // --- ACTIVE QUIZ FLOW ---
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl mx-auto"
            >
              <button 
                onClick={returnToMenu}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Вернуться к списку квизов
              </button>

              {!isFinished ? (
                <div className="bg-[#0A1120] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  {/* Progress Bar */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                    <motion.div 
                      className="h-full bg-[#00A3FF]"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion) / activeQuiz.questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="flex justify-between items-center mb-10 mt-2">
                    <span className="text-[#00A3FF] font-medium text-sm tracking-widest uppercase">
                      Вопрос {currentQuestion + 1} из {activeQuiz.questions.length}
                    </span>
                    <span className="text-slate-500 text-sm font-medium">
                      Счет: {score}
                    </span>
                  </div>

                  {/* Visual Element (e.g. Flag or License Plate Number) */}
                  {activeQuiz.questions[currentQuestion].visual && (
                    <div className="mb-10 flex justify-center">
                      <div className="text-8xl select-none drop-shadow-2xl bg-white/5 p-8 rounded-3xl border border-white/10">
                        {activeQuiz.questions[currentQuestion].visual}
                      </div>
                    </div>
                  )}

                  <h2 className="text-3xl font-bold text-white mb-10 leading-snug text-center font-serif">
                    {activeQuiz.questions[currentQuestion].question}
                  </h2>

                  <div className="space-y-4">
                    {activeQuiz.questions[currentQuestion].options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === activeQuiz.questions[currentQuestion].correctAnswer;
                      const showCorrect = isAnswered && isCorrect;
                      const showWrong = isAnswered && isSelected && !isCorrect;

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={isAnswered}
                          className={cn(
                            "w-full flex items-center justify-between p-5 rounded-2xl border text-left transition-all duration-300",
                            !isAnswered && "border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#00A3FF]/50 text-slate-300",
                            showCorrect && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                            showWrong && "border-red-500/50 bg-red-500/10 text-red-400",
                            isAnswered && !isSelected && !isCorrect && "border-white/5 bg-transparent text-slate-600 opacity-50"
                          )}
                        >
                          <span className="font-medium text-lg">{option}</span>
                          {showCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                          {showWrong && <XCircle className="w-6 h-6 text-red-500" />}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-10 pt-8 border-t border-white/5"
                      >
                        <p className="text-slate-400 text-base leading-relaxed mb-8">
                          <span className="text-white font-medium mr-2">Объяснение:</span>
                          {activeQuiz.questions[currentQuestion].explanation}
                        </p>
                        <button
                          onClick={handleNext}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-[#00A3FF] hover:bg-[#008DE0] text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(0,163,255,0.3)] hover:shadow-[0_0_30px_rgba(0,163,255,0.5)]"
                        >
                          {currentQuestion < activeQuiz.questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // --- RESULTS ---
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#0A1120] border border-white/5 rounded-3xl p-12 shadow-2xl text-center"
                >
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#00A3FF] to-blue-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,163,255,0.4)]">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4 font-serif">Тест завершен!</h2>
                  <p className="text-slate-400 mb-10 text-xl">
                    Вы ответили правильно на <span className="text-[#00A3FF] font-bold text-3xl mx-2">{score}</span> из {activeQuiz.questions.length} вопросов.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={resetQuiz}
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Пройти заново
                    </button>
                    <button
                      onClick={returnToMenu}
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-[#00A3FF] hover:bg-[#008DE0] text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(0,163,255,0.3)]"
                    >
                      К списку квизов
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
