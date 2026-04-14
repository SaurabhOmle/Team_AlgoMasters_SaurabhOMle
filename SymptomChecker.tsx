import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, ArrowLeft, ChevronDown, ChevronUp, Volume2, Info, Sparkles, AlertTriangle, Shield, Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import AnimatedAvatar from './AnimatedAvatar';
import { getDiagnosis, explainMedicalTerm } from '../utils/aiEngine';
import type { DiagnosisResult } from '../utils/storage';

export default function SymptomChecker() {
  const { state, dispatch, t } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [explainedTerms, setExplainedTerms] = useState<Record<string, string>>({});
  const [showSimpleExplanation, setShowSimpleExplanation] = useState(false);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);

  function createRecognition() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = state.settings.language === 'hi' ? 'hi-IN' : state.settings.language === 'mr' ? 'mr-IN' : 'en-US';
    return recognition;
  }

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const startListening = () => {
    const recognition = createRecognition();
    if (!recognition) {
      setInputText(state.settings.language === 'hi' ? 'मुझे सिरदर्द और बुखार है' : state.settings.language === 'mr' ? 'मला डोके दुखते आणि ताप आहे' : 'I have a headache and fever');
      return;
    }

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      // Fallback demo text
      setInputText(state.settings.language === 'hi' ? 'मुझे सिरदर्द और चक्कर आ रहे हैं' : state.settings.language === 'mr' ? 'मला डोके दुखते आणि चक्कर येत आहेत' : 'I have a headache and feel dizzy');
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const diagnosis = await getDiagnosis(inputText);
      setResult(diagnosis);
    } catch {
      setResult({
        symptoms: [inputText],
        possibleConditions: [{ name: 'Unable to analyze', confidence: 0, explanation: 'Please try again.', simpleExplanation: 'Could not process your symptoms. Please try again.' }],
        urgency: 'low',
        nextSteps: ['Try again', 'Consult a doctor directly'],
        homeRemedies: ['Rest and stay hydrated'],
        simpleExplanation: 'Could not process your symptoms.',
        doctorRecommendation: 'Please consult a doctor.',
      });
    }
    setIsProcessing(false);
  };

  const handleExplainTerm = (term: string) => {
    const explanation = explainMedicalTerm(term);
    setExplainedTerms(prev => ({ ...prev, [term]: explanation }));
  };

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return { color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', icon: AlertTriangle, label: t('emergencyLevel'), barColor: 'bg-red-500' };
      case 'medium': return { color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30', icon: Shield, label: t('medium'), barColor: 'bg-yellow-500' };
      default: return { color: 'text-primary', bg: 'bg-primary/15 border-primary/30', icon: Heart, label: t('low'), barColor: 'bg-primary' };
    }
  };

  const urgencyConfig = result ? getUrgencyConfig(result.urgency) : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass sticky top-0 z-10">
        <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'home' })} className="p-2 rounded-xl hover:bg-surface-3 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold font-display">{t('symptoms')}</h1>
        <Sparkles className="text-primary ml-auto" size={18} />
      </div>

      {/* Avatar + Voice Input */}
      <div className="flex flex-col items-center pt-6 px-4">
        <AnimatedAvatar isListening={isListening} isThinking={isProcessing} size="md" />

        <p className="text-text-muted text-sm mt-4 text-center">
          {isListening ? t('listening') : isProcessing ? t('processing') : t('speakSymptoms')}
        </p>

        {/* Mic Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isListening ? stopListening : startListening}
          className={`mt-4 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? 'bg-red-500 recording-pulse'
              : 'bg-primary/20 border-2 border-primary/30 hover:bg-primary/30'
          }`}
        >
          {isListening ? <MicOff size={28} className="text-white" /> : <Mic size={28} className="text-primary" />}
        </motion.button>

        {/* Text Input */}
        <div className="w-full mt-4 relative">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={t('typeSymptoms')}
            className="w-full p-4 pr-14 rounded-2xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-text placeholder-text-muted/50 resize-none min-h-[80px] text-base"
            rows={3}
          />
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-2 bottom-2 p-2 rounded-xl bg-primary text-surface disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Quick Symptom Tags */}
        {!result && !isProcessing && (
          <div className="flex flex-wrap gap-2 mt-3">
            {['Headache', 'Fever', 'Cough', 'Stomach pain', 'Chest pain', 'Dizziness'].map(tag => (
              <button
                key={tag}
                onClick={() => setInputText(prev => prev ? `${prev}, ${tag.toLowerCase()}` : `I have ${tag.toLowerCase()}`)}
                className="px-3 py-1.5 rounded-full text-xs bg-surface-3 text-text-muted hover:text-text hover:bg-surface-4 transition-colors border border-surface-4"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Processing Animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 mt-6"
          >
            <div className="p-6 rounded-2xl glass border border-primary/10 text-center">
              <div className="flex justify-center gap-2 mb-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-primary rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <p className="text-sm text-text-muted">{t('processing')}</p>
              <div className="mt-4 h-1 bg-surface-4 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && urgencyConfig && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 mt-6 space-y-3"
          >
            <h3 className="text-lg font-semibold font-display">{t('results')}</h3>

            {/* Urgency Badge */}
            <div className={`p-4 rounded-2xl border ${urgencyConfig.bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <urgencyConfig.icon className={urgencyConfig.color} size={24} />
                  <div>
                    <p className="text-xs text-text-muted">{t('urgency')}</p>
                    <p className={`text-lg font-bold ${urgencyConfig.color}`}>{urgencyConfig.label}</p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-2" style={{ borderColor: urgencyConfig.barColor === 'bg-red-500' ? '#FF6B6B' : urgencyConfig.barColor === 'bg-yellow-500' ? '#FDCB6E' : '#00D4AA' }}>
                  <span className="text-2xl">{result.urgency === 'emergency' ? '🚨' : result.urgency === 'medium' ? '⚠️' : '✅'}</span>
                </div>
              </div>
              {/* Urgency bar */}
              <div className="mt-3 h-2 bg-surface-4 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${urgencyConfig.barColor}`}
                  initial={{ width: '0%' }}
                  animate={{ width: result.urgency === 'emergency' ? '95%' : result.urgency === 'medium' ? '60%' : '25%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            {/* Simple Explanation Toggle */}
            <button
              onClick={() => setShowSimpleExplanation(!showSimpleExplanation)}
              className="w-full p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
            >
              <Volume2 size={16} />
              {t('explain')}
              <ChevronDown size={14} className={`transition-transform ${showSimpleExplanation ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showSimpleExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl glass border border-primary/10">
                    <p className="text-sm text-text leading-relaxed">
                      🗣️ {result.simpleExplanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Possible Conditions */}
            <div className="p-4 rounded-2xl glass">
              <button onClick={() => toggleSection('conditions')} className="w-full flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text">{t('possibleConditions')}</h4>
                {expandedSections['conditions'] ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
              </button>
              <AnimatePresence>
                {expandedSections['conditions'] !== false && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 space-y-2"
                  >
                    {result.possibleConditions.map((cond, i) => (
                      <div key={i} className="p-3 rounded-xl bg-surface-3/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text">{cond.name}</span>
                          <span className="text-xs text-primary">{Math.round(cond.confidence * 100)}% {t('confidence')}</span>
                        </div>
                        <div className="mt-1 h-1 bg-surface-4 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${cond.confidence * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
                          />
                        </div>
                        {cond.explanation && (
                          <p className="text-xs text-text-muted mt-2">{cond.explanation}</p>
                        )}
                        {explainedTerms[cond.name] ? (
                          <div className="mt-2 p-2 rounded-lg bg-primary/10 text-xs text-primary">
                            💡 {explainedTerms[cond.name]}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleExplainTerm(cond.name)}
                            className="mt-2 flex items-center gap-1 text-xs text-primary hover:text-primary-light"
                          >
                            <Info size={12} /> {t('explain')}
                          </button>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next Steps */}
            <div className="p-4 rounded-2xl glass">
              <button onClick={() => toggleSection('nextSteps')} className="w-full flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text">{t('nextSteps')}</h4>
                {expandedSections['nextSteps'] ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
              </button>
              <AnimatePresence>
                {expandedSections['nextSteps'] !== false && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                    {result.nextSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 p-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary font-bold">{i + 1}</span>
                        </div>
                        <span className="text-sm text-text">{step}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Home Remedies */}
            <div className="p-4 rounded-2xl glass border border-green-500/10">
              <button onClick={() => toggleSection('remedies')} className="w-full flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text">🌿 {t('homeRemedies')}</h4>
                {expandedSections['remedies'] ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
              </button>
              <AnimatePresence>
                {expandedSections['remedies'] !== false && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                    {result.homeRemedies.map((remedy, i) => (
                      <div key={i} className="flex items-start gap-2 p-2">
                        <span className="text-green-400">•</span>
                        <span className="text-sm text-text">{remedy}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Doctor Recommendation */}
            <div className={`p-4 rounded-2xl border ${result.urgency === 'emergency' ? 'bg-red-500/10 border-red-500/30' : 'bg-primary/5 border-primary/20'}`}>
              <h4 className="text-sm font-semibold text-text flex items-center gap-2">
                👨‍⚕️ {t('doctorRecommendation')}
              </h4>
              <p className={`text-sm mt-2 ${result.urgency === 'emergency' ? 'text-red-300' : 'text-text-muted'}`}>
                {result.doctorRecommendation}
              </p>
            </div>

            {/* Retry */}
            <button
              onClick={() => { setResult(null); setInputText(''); }}
              className="w-full py-3 rounded-2xl glass border border-surface-4 text-text-muted hover:text-text hover:border-primary/30 transition-all text-sm"
            >
              {t('checkSymptoms')} →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
