import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, AlertTriangle, Heart, MapPin, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function EmergencySOS() {
  const { state, dispatch, t } = useApp();
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showGuidance, setShowGuidance] = useState(false);
  const [emergencyTimer, setEmergencyTimer] = useState(0);

  useEffect(() => {
    if (isActivated) {
      const interval = setInterval(() => {
        setEmergencyTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActivated]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleActivate = () => {
    if (isActivated) {
      setIsActivated(false);
      setEmergencyTimer(0);
      setShowGuidance(false);
      setCountdown(3);
      return;
    }

    // 3 second countdown
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          setIsActivated(true);
          // Show guidance after 2 seconds
          setTimeout(() => setShowGuidance(true), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const guidanceSteps = [
    { icon: '🧘', text: t('sosStep1') },
    { icon: '👔', text: t('sosStep2') },
    { icon: '📞', text: t('sosStep3') },
    { icon: '👨‍👩‍👧', text: t('sosStep4') },
    { icon: '💊', text: t('sosStep5') },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass sticky top-0 z-10">
        <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'home' })} className="p-2 rounded-xl hover:bg-surface-3 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold font-display">{t('emergency')}</h1>
      </div>

      <div className="flex flex-col items-center pt-8 px-4">
        {/* Main SOS Button */}
        <AnimatePresence mode="wait">
          {!isActivated && countdown === 3 ? (
            <motion.div
              key="main-button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative"
            >
              {/* Outer ring */}
              <div className="absolute -inset-8 rounded-full border-2 border-red-500/20 sos-pulse" />
              <div className="absolute -inset-16 rounded-full border border-red-500/10" />

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleActivate}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex flex-col items-center justify-center glow-danger relative z-10"
              >
                <AlertTriangle size={48} className="text-white mb-2" />
                <span className="text-white text-2xl font-bold">SOS</span>
                <span className="text-red-200 text-xs mt-1">Tap to activate</span>
              </motion.button>
            </motion.div>
          ) : !isActivated && countdown > 0 ? (
            <motion.div
              key="countdown"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: countdown }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center"
            >
              <span className="text-white text-7xl font-bold">{countdown}</span>
            </motion.div>
          ) : (
            <motion.div
              key="activated"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              {/* Activated state */}
              <div className="relative">
                <div className="absolute -inset-6 rounded-full border-2 border-red-500 sos-pulse" />
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex flex-col items-center justify-center relative z-10 glow-danger">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <AlertTriangle size={40} className="text-white" />
                  </motion.div>
                  <span className="text-white text-sm font-bold mt-2">SOS ACTIVE</span>
                </div>
              </div>

              {/* Timer */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <Clock size={16} className="text-red-400" />
                <span className="text-2xl font-mono text-red-400 font-bold">{formatTime(emergencyTimer)}</span>
              </div>

              {/* Status messages */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 space-y-2"
              >
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 connectivity-dot" />
                  <span className="text-sm text-red-300">{t('sosHelp')}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <MapPin size={14} className="text-text-muted" />
                  <span className="text-xs text-text-muted">Location data queued for sync</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Heart size={14} className="text-text-muted" />
                  <span className="text-xs text-text-muted">Health records attached</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency Call Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="mt-8 flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
          onClick={() => alert('In production: This would call 108 Ambulance Service')}
        >
          <Phone size={20} />
          <span className="font-semibold">Call 108 Ambulance</span>
        </motion.button>

        {/* Cancel button */}
        {isActivated && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleActivate}
            className="mt-4 px-8 py-3 rounded-xl glass border border-surface-4 text-text-muted hover:text-text text-sm transition-colors"
          >
            {t('cancelSOS')}
          </motion.button>
        )}
      </div>

      {/* Emergency Guidance */}
      <AnimatePresence>
        {showGuidance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mt-8"
          >
            <div className="p-4 rounded-2xl glass border border-red-500/10">
              <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} /> {t('sosGuidance')}
              </h3>
              <div className="space-y-3">
                {guidanceSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.3 }}
                    className="flex items-start gap-3 p-2 rounded-lg bg-surface-3/30"
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-sm text-text">{step.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pre-recorded audio guidance */}
            <div className="mt-4 p-4 rounded-2xl glass border border-primary/10">
              <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-2">
                🔊 Audio Guidance Available
              </h4>
              <p className="text-xs text-text-muted">
                Pre-recorded emergency guidance plays in your language when activated.
                {state.settings.language === 'hi' && ' (हिन्दी में उपलब्ध)'}
                {state.settings.language === 'mr' && ' (मराठीत उपलब्ध)'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary/40 rounded-full"
                      animate={{ height: [4, Math.random() * 16 + 4, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-primary">Playing...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick info cards */}
      {!isActivated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 mt-8 space-y-3"
        >
          <div className="p-4 rounded-2xl glass border border-surface-4">
            <h4 className="text-sm font-semibold text-text mb-2">How SOS Works</h4>
            <div className="space-y-2">
              {[
                { icon: '1️⃣', text: 'Tap the SOS button in any emergency' },
                { icon: '2️⃣', text: 'Your health data is prepared for sending' },
                { icon: '3️⃣', text: 'When network is available, data is sent automatically' },
                { icon: '4️⃣', text: 'Follow the step-by-step guidance' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span>{item.icon}</span>
                  <span className="text-xs text-text-muted">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl glass border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <span className="text-sm font-semibold text-primary">Works Offline</span>
            </div>
            <p className="text-xs text-text-muted">
              The SOS feature works even without internet. Your emergency data is stored locally and sent automatically when connectivity is restored.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
