import { motion, AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, Stethoscope, FolderHeart, UserRound, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';
import Home from './components/Home';
import SymptomChecker from './components/SymptomChecker';
import HealthVault from './components/HealthVault';
import DoctorDashboard from './components/DoctorDashboard';
import EmergencySOS from './components/EmergencySOS';
import Settings from './components/Settings';

function AppContent() {
  const { state, dispatch, t } = useApp();
  const { currentPage, showWelcome } = state;

  const navItems = [
    { key: 'home', icon: HomeIcon, label: t('home'), page: 'home' as const },
    { key: 'symptoms', icon: Stethoscope, label: t('symptoms'), page: 'symptoms' as const },
    { key: 'vault', icon: FolderHeart, label: t('vault'), page: 'vault' as const },
    { key: 'doctor', icon: UserRound, label: t('doctor'), page: 'doctor' as const },
    { key: 'emergency', icon: AlertTriangle, label: t('emergency'), page: 'emergency' as const },
    { key: 'settings', icon: SettingsIcon, label: t('settings'), page: 'settings' as const },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home />;
      case 'symptoms': return <SymptomChecker />;
      case 'vault': return <HealthVault />;
      case 'doctor': return <DoctorDashboard />;
      case 'emergency': return <EmergencySOS />;
      case 'settings': return <Settings />;
    }
  };

  // Welcome screen
  if (showWelcome) {
    return (
      <WelcomeScreen onDismiss={() => dispatch({ type: 'DISMISS_WELCOME' })} />
    );
  }

  return (
    <div className="min-h-screen bg-animated relative">
      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-surface-4 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
          {navItems.map(item => {
            const isActive = currentPage === item.page;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => dispatch({ type: 'SET_PAGE', page: item.page })}
                className={`relative flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-200 min-w-[52px] ${
                  isActive
                    ? 'text-primary'
                    : item.key === 'emergency'
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary rounded-full"
                  />
                )}
                <Icon size={20} className={item.key === 'emergency' && !isActive ? 'text-red-400/60' : ''} />
                <span className="text-[10px] mt-0.5 truncate w-full text-center">{item.label}</span>
                {item.key === 'emergency' && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full connectivity-dot" />
                )}
              </button>
            );
          })}
        </div>
        {/* Safe area spacer for mobile */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
}

function WelcomeScreen({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="min-h-screen bg-animated flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* Floating medical icons */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, Math.sin(i) * 50, 0],
            y: [0, Math.cos(i) * 30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 15}%`,
          }}
        >
          {['🏥', '💊', '❤️', '🩺', '🧬', '👨‍⚕️'][i]}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-dark mx-auto flex items-center justify-center glow-primary mb-6"
        >
          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-bold font-display bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"
        >
          Vaid
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-text-muted mt-3 text-lg"
        >
          Doctor in Your Pocket
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-text-muted/60 mt-2 text-sm max-w-xs mx-auto"
        >
          Your health companion that works even without internet
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap justify-center gap-2 mt-6"
        >
          {[
            { icon: '🩺', text: 'AI Diagnosis' },
            { icon: '🎤', text: 'Voice Enabled' },
            { icon: '📡', text: 'Works Offline' },
            { icon: '🌐', text: '3 Languages' },
            { icon: '📋', text: 'QR Health Records' },
            { icon: '🆘', text: 'Emergency SOS' },
          ].map((badge, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="px-3 py-1.5 rounded-full glass border border-surface-4 text-xs text-text-muted flex items-center gap-1.5"
            >
              <span>{badge.icon}</span>
              {badge.text}
            </motion.span>
          ))}
        </motion.div>

        {/* Get Started button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDismiss}
          className="mt-10 px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-surface font-semibold text-lg glow-primary hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          Get Started →
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-[10px] text-text-muted/40 mt-4"
        >
          Made with ❤️ for rural India • Works offline
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
