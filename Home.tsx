import { motion } from 'framer-motion';
import { Mic, Wifi, WifiOff, Activity, Radio } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import AnimatedAvatar from './AnimatedAvatar';
import { getConnectivityColor, getConnectivityLabel } from '../utils/connectivity';

export default function Home() {
  const { state, dispatch, t } = useApp();
  const { connectivity } = state;

  const actions = [
    {
      key: 'symptoms',
      icon: '🩺',
      label: t('checkSymptoms'),
      desc: t('checkDesc'),
      color: 'from-primary/20 to-primary/5',
      border: 'border-primary/20',
      hoverBorder: 'hover:border-primary/50',
      page: 'symptoms' as const,
    },
    {
      key: 'connect',
      icon: '👨‍⚕️',
      label: t('connectDoctor'),
      desc: t('connectDesc'),
      color: 'from-secondary/20 to-secondary/5',
      border: 'border-secondary/20',
      hoverBorder: 'hover:border-secondary/50',
      page: 'doctor' as const,
    },
    {
      key: 'vault',
      icon: '📋',
      label: t('healthVault'),
      desc: t('healthVaultDesc'),
      color: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/20',
      hoverBorder: 'hover:border-blue-500/50',
      page: 'vault' as const,
    },
    {
      key: 'emergency',
      icon: '🆘',
      label: t('emergencyBtn'),
      desc: t('emergencyDesc'),
      color: 'from-red-500/20 to-red-500/5',
      border: 'border-red-500/20',
      hoverBorder: 'hover:border-red-500/50',
      page: 'emergency' as const,
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Connectivity Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 py-2 glass rounded-xl mx-4 mt-3"
      >
        <div className="flex items-center gap-2">
          {connectivity.isOnline ? (
            <Wifi size={14} style={{ color: getConnectivityColor(connectivity.quality) }} />
          ) : (
            <WifiOff size={14} className="text-red-400" />
          )}
          <span className="text-xs text-text-muted">
            {connectivity.isOnline ? getConnectivityLabel(connectivity.quality) : t('offline')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Activity size={12} className="text-text-muted" />
            <span className="text-xs text-text-muted">
              {connectivity.isOnline ? `${connectivity.speed.toFixed(1)} Mbps` : '--'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Radio size={12} className="text-text-muted" />
            <span className="text-xs text-text-muted">
              {connectivity.mode === 'video' ? '📹' : connectivity.mode === 'audio' ? '📞' : '💬'}
            </span>
          </div>
          <div
            className="w-2 h-2 rounded-full connectivity-dot"
            style={{ backgroundColor: getConnectivityColor(connectivity.quality) }}
          />
        </div>
      </motion.div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center pt-8 pb-4"
      >
        <AnimatedAvatar size="lg" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <h2 className="text-xl font-semibold text-text font-display">
            {t('greeting')}
          </h2>
          <p className="text-text-muted mt-1 text-sm">{t('greetingSub')}</p>
        </motion.div>

        {/* Voice Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: 'SET_PAGE', page: 'symptoms' })}
          className={`mt-6 flex items-center gap-3 px-6 py-4 rounded-2xl glass glow-primary transition-all duration-300 hover:bg-primary/10`}
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mic-pulse">
            <Mic className="text-primary" size={24} />
          </div>
          <span className="text-base font-medium text-text">{t('speakSymptoms')}</span>
        </motion.button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="px-4 mt-4"
      >
        <h3 className="text-sm font-medium text-text-muted mb-3 uppercase tracking-wider">
          {t('quickActions')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'SET_PAGE', page: action.page })}
              className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} border ${action.border} ${action.hoverBorder} transition-all duration-300 text-left card-hover`}
            >
              <span className="text-3xl">{action.icon}</span>
              <h4 className="text-sm font-semibold text-text mt-3 leading-tight">{action.label}</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{action.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Health Tip Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="px-4 mt-5"
      >
        <div className="p-4 rounded-2xl glass border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Health Tip</span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            {state.settings.language === 'hi'
              ? 'रोज़ 8 गिलास पानी पिएं और 30 मिनट व्यायाम करें। यह आपकी सेहत को दुरुस्त रखेगा।'
              : state.settings.language === 'mr'
              ? 'रोज 8 ग्लास पाणी प्या आणि 30 मिनिट व्यायाम करा. तुमचे आरोग्य चांगले राहील.'
              : 'Drink 8 glasses of water daily and exercise for 30 minutes. This keeps your body healthy and strong.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
