import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Type, Wifi, WifiOff, Info, Moon, Shield } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { clearSyncQueue, getPendingSyncCount } from '../utils/storage';

export default function Settings() {
  const { state, dispatch, t } = useApp();
  const { settings } = state;
  const pendingSync = getPendingSyncCount();

  const languages = [
    { code: 'en' as const, label: t('english'), flag: '🇬🇧' },
    { code: 'hi' as const, label: t('hindi'), flag: '🇮🇳' },
    { code: 'mr' as const, label: t('marathi'), flag: '🏴' },
  ];

  const fontSizes = [
    { value: 'normal' as const, label: 'A', size: 'text-sm' },
    { value: 'large' as const, label: 'A+', size: 'text-base' },
    { value: 'extra-large' as const, label: 'A++', size: 'text-lg' },
  ];

  const handleClearSync = () => {
    clearSyncQueue();
    alert('Sync queue cleared!');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass sticky top-0 z-10">
        <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'home' })} className="p-2 rounded-xl hover:bg-surface-3 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold font-display">{t('settings')}</h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Language */}
        <div className="p-4 rounded-2xl glass border border-surface-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">{t('language')}</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { language: lang.code } })}
                className={`p-3 rounded-xl text-center transition-all ${
                  settings.language === lang.code
                    ? 'bg-primary/20 border-2 border-primary text-primary'
                    : 'bg-surface-3/50 border border-surface-4 text-text-muted hover:border-primary/30'
                }`}
              >
                <span className="text-xl block mb-1">{lang.flag}</span>
                <span className="text-xs font-medium">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="p-4 rounded-2xl glass border border-surface-4">
          <div className="flex items-center gap-2 mb-3">
            <Type size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">{t('fontSize')}</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {fontSizes.map(fs => (
              <button
                key={fs.value}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { fontSize: fs.value } })}
                className={`p-3 rounded-xl text-center transition-all ${
                  settings.fontSize === fs.value
                    ? 'bg-primary/20 border-2 border-primary text-primary'
                    : 'bg-surface-3/50 border border-surface-4 text-text-muted hover:border-primary/30'
                }`}
              >
                <span className={`${fs.size} font-bold`}>{fs.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Offline Mode Toggle */}
        <div className="p-4 rounded-2xl glass border border-surface-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.offlineMode ? (
                <WifiOff size={20} className="text-red-400" />
              ) : (
                <Wifi size={20} className="text-primary" />
              )}
              <div>
                <h3 className="text-sm font-semibold text-text">{t('offlineToggle')}</h3>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {settings.offlineMode ? 'Offline simulation active' : 'Normal connectivity mode'}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { offlineMode: !settings.offlineMode } })}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                settings.offlineMode ? 'bg-red-500' : 'bg-surface-4'
              }`}
            >
              <motion.div
                animate={{ x: settings.offlineMode ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
              />
            </button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="p-4 rounded-2xl glass border border-surface-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">{t('syncStatus')}</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text">{pendingSync} items {t('pending')}</p>
              <p className="text-[10px] text-text-muted mt-0.5">All data stored locally and encrypted</p>
            </div>
            {pendingSync > 0 && (
              <button
                onClick={handleClearSync}
                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
              >
                Clear Queue
              </button>
            )}
          </div>
          <div className="mt-2 h-1.5 bg-surface-4 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: pendingSync > 0 ? '60%' : '100%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* About */}
        <div className="p-4 rounded-2xl glass border border-surface-4">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">{t('about')}</h3>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">{t('aboutDesc')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Offline-First', 'AI Powered', 'Voice Enabled', 'QR Health Records', 'Multi-Language'].map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Version */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Moon size={12} className="text-text-muted" />
            <span className="text-xs text-text-muted">Vaid v1.0.0</span>
          </div>
          <p className="text-[10px] text-text-muted/50">Made with ❤️ for rural India</p>
        </div>
      </div>
    </div>
  );
}
