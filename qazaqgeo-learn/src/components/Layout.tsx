import { Outlet, Link, useLocation } from 'react-router-dom';
import { Map, MessageSquare, BrainCircuit, User } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/map', label: 'Регионы', icon: Map },
    { path: '/tutor', label: 'ИИ-Наставник', icon: MessageSquare },
    { path: '/quiz', label: 'Тестирование', icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#060B14] border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight text-white font-serif">
              Qazaq <span className="text-[#00A3FF]">Geo</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isActive 
                      ? "text-white" 
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/auth"
              className="bg-[#00A3FF] hover:bg-[#008DE0] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 shadow-lg shadow-[#00A3FF]/20"
            >
              Войти
            </Link>
          </nav>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden p-2 text-slate-400 hover:text-white">
            <Map className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#020408] border-t border-white/5 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <span className="text-2xl font-bold tracking-tight text-white font-serif">
                  Qazaq <span className="text-white">Geo</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed">
                Первая инновационная платформа для глубокого изучения истории и географии Казахстана через интерактивный опыт.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-6 font-sans">Навигация</h4>
              <ul className="space-y-4">
                <li><Link to="/map" className="text-slate-400 hover:text-white text-sm transition-colors">Карта</Link></li>
                <li><Link to="/tutor" className="text-slate-400 hover:text-white text-sm transition-colors">ИИ-Тьютор</Link></li>
                <li><Link to="/quiz" className="text-slate-400 hover:text-white text-sm transition-colors">Квизы</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-6 font-sans">Поддержка</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Документация</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Контакты</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">О проекте</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-6 font-sans">Правовая информация</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Конфиденциальность</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Условия использования</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden sticky bottom-0 z-50 w-full border-t border-white/5 bg-[#060B14]/90 backdrop-blur-xl pb-safe">
        <div className="flex items-center justify-around p-1.5">
          {[...navItems, { path: '/auth', label: 'Войти', icon: User }].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-1.5 rounded-xl text-[9px] font-medium transition-colors",
                  isActive ? "text-[#00A3FF]" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
