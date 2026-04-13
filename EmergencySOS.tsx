import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { addSOSRequest, getSOSRequests, generateId } from '../../utils/storage';
import { AlertTriangle, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';

type SOSState = 'ready' | 'searching' | 'connected' | 'history';

export default function EmergencySOS() {
  const [state, setState] = useState<SOSState>('ready');
  const [sosHistory, setSOSHistory] = useState(getSOSRequests());
  const [showHistory, setShowHistory] = useState(false);

  const triggerSOS = () => {
    setState('searching');

    setTimeout(() => {
      const request = {
        id: generateId(),
        patientId: 'p1',
        patientName: 'Ramesh Yadav',
        village: 'Sundarpur',
        symptoms: 'Emergency - Patient pressed SOS',
        timestamp: new Date().toISOString(),
        status: 'accepted' as const,
        doctorId: 'd1',
      };
      addSOSRequest(request);
      setSOSHistory(getSOSRequests());
      setState('connected');
    }, 3000);
  };

  const reset = () => {
    setState('ready');
  };

  useEffect(() => {
    setSOSHistory(getSOSRequests());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navbar title="Emergency SOS" />
      <div className="max-w-lg mx-auto px-4 py-5">

        {state === 'ready' && !showHistory && (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-800">Emergency Help</h2>
              <p className="text-sm text-gray-500 mt-1">Press the SOS button to connect immediately</p>
            </div>

            <button
              onClick={triggerSOS}
              className="w-40 h-40 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl shadow-red-300 animate-pulse-sos active:scale-90 transition-transform"
            >
              <AlertTriangle size={48} className="mb-1" />
              <span className="text-2xl font-extrabold">SOS</span>
            </button>

            <p className="text-xs text-gray-400 mt-6 text-center max-w-xs">
              Pressing this button will alert nearby doctors and send your location for immediate assistance
            </p>

            <div className="flex items-center gap-2 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              <MapPin size={16} className="text-red-500" />
              <span className="text-sm text-red-700">Location: Sundarpur, UP</span>
            </div>

            {sosHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="mt-6 text-sm text-gray-500 underline"
              >
                View SOS History ({sosHistory.length})
              </button>
            )}
          </div>
        )}

        {state === 'searching' && (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh]">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Phone size={28} className="text-white" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ripple" />
              <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ripple" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-0 rounded-full border-4 border-red-100 animate-ripple" style={{ animationDelay: '1s' }} />
            </div>
            <h2 className="text-xl font-bold text-red-700">Searching for Doctors...</h2>
            <p className="text-sm text-gray-500 mt-2">Alerting doctors in your area</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        {state === 'connected' && (
          <div className="animate-slide-up flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-emerald-700">Doctor Accepted!</h2>
            <p className="text-sm text-gray-500 mt-2">Dr. Priya Sharma is connecting to you</p>

            <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">👩‍⚕️</span>
                <div>
                  <h3 className="font-bold text-gray-800">Dr. Priya Sharma</h3>
                  <p className="text-xs text-gray-500">General Medicine • 12yr exp</p>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-sm text-emerald-700 font-medium">Estimated arrival: 15 mins</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 w-full max-w-xs">
              <button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Phone size={18} /> Call Doctor
              </button>
              <button
                onClick={reset}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl active:scale-95 transition-all"
              >
                Back to SOS
              </button>
            </div>
          </div>
        )}

        {showHistory && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">SOS History</h2>
              <button onClick={() => setShowHistory(false)} className="text-sm text-emerald-600 font-medium">
                Back
              </button>
            </div>
            {sosHistory.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">No SOS history</p>
            ) : (
              <div className="space-y-3">
                {sosHistory.map(sos => (
                  <div key={sos.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        sos.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                        sos.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {sos.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(sos.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{sos.symptoms}</p>
                    <p className="text-xs text-gray-500 mt-1">📍 {sos.village}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
