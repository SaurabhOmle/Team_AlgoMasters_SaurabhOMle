import { useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, Users, Wifi, WifiOff } from 'lucide-react';

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="animate-fade-in text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl shadow-emerald-200 mb-5">
          <Heart size={36} className="text-white" fill="white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          SwasthyaLink
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">
          Offline-First Rural Telemedicine
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full">
          <WifiOff size={14} />
          <span>Works Offline</span>
          <span className="text-gray-300">|</span>
          <Wifi size={14} />
          <span>Works Online</span>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4 animate-slide-up">
        <p className="text-center text-gray-600 font-semibold text-sm mb-2">I am a...</p>

        <button
          onClick={() => navigate('/patient')}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Users size={28} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">Patient</h2>
            <p className="text-emerald-100 text-sm">Check symptoms, consult doctors</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/doctor')}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Stethoscope size={28} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">Doctor</h2>
            <p className="text-blue-100 text-sm">Manage patients, respond to SOS</p>
          </div>
        </button>
      </div>

      <p className="text-gray-400 text-xs mt-10 text-center">
        🏥 Connecting Rural India to Healthcare
      </p>
    </div>
  );
}
