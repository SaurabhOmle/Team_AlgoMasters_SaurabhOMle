import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { doctors, Doctor } from '../../data/mockData';
import { generateCallSummary, generateMedicines } from '../../utils/aiLogic';
import { addConsultation } from '../../utils/storage';
import { generateId } from '../../utils/storage';
import { Phone, PhoneOff, Star, Clock, Users, Mic, MicOff, Video, VideoOff, MessageSquare } from 'lucide-react';

type ViewState = 'list' | 'calling' | 'in-call' | 'summary';

export default function DoctorConnect() {
  const [view, setView] = useState<ViewState>('list');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callSummary, setCallSummary] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [ratingValue, setRatingValue] = useState(0);
  const [callInterval, setCallInterval] = useState<NodeJS.Timeout | null>(null);

  const startCall = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setView('calling');
    setCallDuration(0);

    // Simulate ringing
    setTimeout(() => {
      setView('in-call');
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      setCallInterval(interval);
    }, 2500);
  };

  const endCall = () => {
    if (callInterval) clearInterval(callInterval);

    const symptoms = ['Fever', 'Cough', 'Body Pain'];
    const summary = generateCallSummary(selectedDoctor!.name, symptoms);
    const medicines = generateMedicines(symptoms);
    setCallSummary(summary);

    // Save consultation
    addConsultation({
      id: generateId(),
      patientId: 'p1',
      patientName: 'Ramesh Yadav',
      doctorId: selectedDoctor!.id,
      doctorName: selectedDoctor!.name,
      date: new Date().toISOString().split('T')[0],
      symptoms,
      summary,
      medicines,
      riskLevel: 'medium',
    });

    setView('summary');
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setView('list');
    setSelectedDoctor(null);
    setCallSummary('');
    setRatingValue(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar title="Talk to Doctor" />
      <div className="max-w-lg mx-auto px-4 py-5">

        {view === 'list' && (
          <div className="animate-fade-in space-y-3">
            <p className="text-sm text-gray-500 mb-4">Available doctors for consultation</p>
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="text-4xl">{doc.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{doc.name}</h3>
                  <p className="text-xs text-gray-500">{doc.specialization}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <Star size={12} fill="currentColor" /> {doc.rating}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} /> {doc.experience}yr
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Users size={12} /> {doc.totalPatients}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => doc.available && startCall(doc)}
                  disabled={!doc.available}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all active:scale-95 ${
                    doc.available
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md shadow-green-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Phone size={14} /> {doc.available ? 'Call' : 'Busy'}
                </button>
              </div>
            ))}
          </div>
        )}

        {view === 'calling' && selectedDoctor && (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh]">
            <div className="relative mb-6">
              <div className="text-7xl">{selectedDoctor.avatar}</div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ripple" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-300 animate-ripple" style={{ animationDelay: '0.5s' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{selectedDoctor.name}</h2>
            <p className="text-gray-500 text-sm mt-1">Calling...</p>
            <div className="mt-8">
              <button
                onClick={reset}
                className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 active:scale-90 transition-transform"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        )}

        {view === 'in-call' && selectedDoctor && (
          <div className="animate-fade-in flex flex-col items-center min-h-[70vh]">
            {/* Simulated video area */}
            <div className="w-full aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl relative overflow-hidden mb-4">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-8xl mb-3">{selectedDoctor.avatar}</div>
                <h3 className="text-white font-bold text-lg">{selectedDoctor.name}</h3>
                <p className="text-gray-400 text-sm">{selectedDoctor.specialization}</p>
              </div>
              {/* Self view */}
              <div className="absolute top-4 right-4 w-20 h-28 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
                <span className="text-3xl">🧑</span>
              </div>
              {/* Call timer */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono">
                🔴 {formatDuration(callDuration)}
              </div>
              {/* Connected badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Connected
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  micOn ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-600'
                }`}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button
                onClick={endCall}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 active:scale-90 transition-transform"
              >
                <PhoneOff size={28} />
              </button>
              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  videoOn ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-600'
                }`}
              >
                {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              <button className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
        )}

        {view === 'summary' && selectedDoctor && (
          <div className="animate-slide-up space-y-4">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-emerald-800">Call Completed</h2>
              <p className="text-sm text-emerald-600 mt-1">Duration: {formatDuration(callDuration)}</p>
            </div>

            {/* AI Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <h3 className="font-bold text-gray-800">AI Consultation Summary</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-xl p-4 border border-blue-100">
                "{callSummary}"
              </p>
            </div>

            {/* Recording */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">📼 Recording Saved</h3>
              <p className="text-xs text-gray-500">The consultation recording has been saved for your records.</p>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <h3 className="font-bold text-gray-800 mb-3">Rate your experience</h3>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRatingValue(star)}
                    className="transition-transform hover:scale-110 active:scale-90"
                  >
                    <Star
                      size={32}
                      className={star <= ratingValue ? 'text-amber-400' : 'text-gray-300'}
                      fill={star <= ratingValue ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
              {ratingValue > 0 && (
                <p className="text-sm text-emerald-600 mt-2 font-medium animate-fade-in">
                  Thank you for your feedback! ⭐
                </p>
              )}
            </div>

            <button
              onClick={reset}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              Back to Doctors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
