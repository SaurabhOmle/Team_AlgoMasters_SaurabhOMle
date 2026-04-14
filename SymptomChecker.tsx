import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { symptomQuestions } from '../../data/mockData';
import { analyzeSymptoms, SymptomAnswers } from '../../utils/aiLogic';
import { ChevronRight, ChevronLeft, AlertCircle, CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<SymptomAnswers>({});
  const [result, setResult] = useState<ReturnType<typeof analyzeSymptoms> | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = symptomQuestions[currentQ];
  const progress = ((currentQ + 1) / symptomQuestions.length) * 100;

  const handleAnswer = (value: boolean) => {
    const newAnswers = { ...answers, [question.key]: value };
    setAnswers(newAnswers);

    if (currentQ < symptomQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const analysisResult = analyzeSymptoms(newAnswers);
      setResult(analysisResult);
      setShowResult(true);
    }
  };

  const goBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  const riskColors = {
    low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-500', icon: CheckCircle },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-500', icon: AlertTriangle },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-500', icon: AlertCircle },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar title="Symptom Checker" />
      <div className="max-w-lg mx-auto px-4 py-5">
        {!showResult ? (
          <div className="animate-fade-in">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Question {currentQ + 1} of {symptomQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div key={currentQ} className="animate-slide-up bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-6xl mb-4">{question.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswer(true)}
                  className="bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 font-bold py-4 rounded-xl text-lg active:scale-95 transition-all"
                >
                  😷 Yes
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="bg-green-50 hover:bg-green-100 border-2 border-green-200 text-green-700 font-bold py-4 rounded-xl text-lg active:scale-95 transition-all"
                >
                  😊 No
                </button>
              </div>
            </div>

            {/* Navigation */}
            {currentQ > 0 && (
              <button
                onClick={goBack}
                className="mt-4 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mx-auto"
              >
                <ChevronLeft size={16} /> Previous question
              </button>
            )}
          </div>
        ) : result && (
          <div className="animate-slide-up">
            {/* Result Card */}
            <div className={`${riskColors[result.level].bg} ${riskColors[result.level].border} border-2 rounded-2xl p-6 text-center mb-5`}>
              <div className={`inline-flex items-center justify-center w-16 h-16 ${riskColors[result.level].badge} rounded-full mb-4`}>
                {(() => { const Icon = riskColors[result.level].icon; return <Icon size={32} className="text-white" />; })()}
              </div>
              <h2 className={`text-2xl font-extrabold ${riskColors[result.level].text} uppercase mb-1`}>
                {result.level} Risk
              </h2>
              <div className="flex justify-center my-3">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${riskColors[result.level].badge} rounded-full transition-all duration-1000`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>
              <p className={`text-sm ${riskColors[result.level].text} mt-3 leading-relaxed`}>
                {result.advice}
              </p>
            </div>

            {/* Symptoms Found */}
            {result.symptoms.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
                <h3 className="font-bold text-gray-800 mb-3">Symptoms Detected</h3>
                <div className="flex flex-wrap gap-2">
                  {result.symptoms.map(s => (
                    <span key={s} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {result.level === 'high' && (
                <button
                  onClick={() => navigate('/patient/sos')}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  🚨 Emergency SOS
                </button>
              )}
              <button
                onClick={() => navigate('/patient/doctors')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ChevronRight size={20} /> Talk to Doctor
              </button>
              <button
                onClick={restart}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RotateCcw size={18} /> Check Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
