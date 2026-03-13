import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { cn } from '../utils/cn';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background Particles (Simulated with CSS/SVG) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#111827]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              {isLogin ? 'С возвращением' : 'Создать аккаунт'}
            </h1>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Войдите, чтобы продолжить обучение' : 'Присоединяйтесь к QazaqGeo Learn'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Имя пользователя</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Иван Иванов"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Пароль</label>
                {isLogin && <a href="#" className="text-xs text-emerald-400 hover:underline">Забыли пароль?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <button className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] flex items-center justify-center gap-2 mt-6">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-emerald-400 font-medium hover:underline focus:outline-none"
              >
                {isLogin ? 'Создать' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
