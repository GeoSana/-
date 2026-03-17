import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Map, BrainCircuit, MessageSquare, ArrowRight, Globe, ShieldQuestion, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1580910215167-c208d1f705b6?q=80&w=2070&auto=format&fit=crop" 
            alt="Kazakhstan Landscape" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060B14]/80 via-[#060B14]/60 to-[#060B14]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-serif">
              Исследуйте Географию <br className="hidden md:block" />
              <span className="text-[#00A3FF]">Казахстана</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Интерактивная платформа для глубокого изучения регионов, истории и культуры через современные технологии и искусственный интеллект.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/map"
                className="w-full sm:w-auto px-8 py-4 bg-[#00A3FF] hover:bg-[#008DE0] text-white rounded-lg font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(0,163,255,0.3)] hover:shadow-[0_0_30px_rgba(0,163,255,0.5)] flex items-center justify-center gap-2"
              >
                <Map className="w-5 h-5" />
                Начать путешествие
              </Link>
              <Link 
                to="/tutor"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <MessageSquare className="w-5 h-5" />
                ИИ-Наставник
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#060B14] relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Интерактивный Атлас</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Выберите регион на карте, чтобы узнать подробную информацию о его географии, экономике и культуре.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#0A1120] border border-white/5 p-8 rounded-2xl group"
            >
              <div className="w-12 h-12 bg-[#00A3FF]/10 rounded-xl flex items-center justify-center mb-6 text-[#00A3FF] group-hover:bg-[#00A3FF] group-hover:text-white transition-colors duration-300">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-serif">Детальные Карты</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Изучайте топографию, климатические зоны и административное деление с помощью наших интерактивных карт.
              </p>
              <Link to="/map" className="text-[#00A3FF] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Открыть карту <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#0A1120] border border-white/5 p-8 rounded-2xl group"
            >
              <div className="w-12 h-12 bg-[#00A3FF]/10 rounded-xl flex items-center justify-center mb-6 text-[#00A3FF] group-hover:bg-[#00A3FF] group-hover:text-white transition-colors duration-300">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-serif">Умный Тьютор</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Задавайте вопросы нашему ИИ-наставнику и получайте развернутые ответы по географии Казахстана.
              </p>
              <Link to="/tutor" className="text-[#00A3FF] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Начать диалог <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#0A1120] border border-white/5 p-8 rounded-2xl group"
            >
              <div className="w-12 h-12 bg-[#00A3FF]/10 rounded-xl flex items-center justify-center mb-6 text-[#00A3FF] group-hover:bg-[#00A3FF] group-hover:text-white transition-colors duration-300">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-serif">Проверка Знаний</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Проходите увлекательные квизы и тесты, чтобы закрепить изученный материал и узнать новое.
              </p>
              <Link to="/quiz" className="text-[#00A3FF] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Пройти квиз <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quizzes Preview Section */}
      <section className="py-24 bg-[#020408] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Проверка Знаний</h2>
              <p className="text-slate-400 max-w-xl">Популярные тесты для проверки ваших знаний о Казахстане.</p>
            </div>
            <Link to="/quiz" className="text-[#00A3FF] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Все квизы <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Регионы Казахстана', desc: 'Проверьте знание областей и их центров', icon: MapPin, color: 'from-[#00A3FF] to-blue-600', img: 'https://images.unsplash.com/photo-1596395819057-cb3733102430?q=80&w=800&auto=format&fit=crop' },
              { title: 'Природа и Климат', desc: 'Вопросы о реках, горах и природных зонах', icon: Globe, color: 'from-[#00A3FF] to-blue-600', img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop' },
              { title: 'История и Культура', desc: 'Исторические факты и культурное наследие', icon: ShieldQuestion, color: 'from-[#00A3FF] to-blue-600', img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop' }
            ].map((quiz, i) => (
              <Link key={i} to="/quiz" className="group relative h-[300px] rounded-2xl overflow-hidden block">
                <img src={quiz.img} alt={quiz.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-[#060B14]/60 to-transparent opacity-90" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${quiz.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <quiz.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-serif">{quiz.title}</h3>
                  <p className="text-slate-300 text-sm">{quiz.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
