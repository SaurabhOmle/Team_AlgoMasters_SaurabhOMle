import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Search, Phone, FileText, AlertTriangle, PlayCircle, ClipboardList, Mic } from 'lucide-react';

const menuItems = [
  {
    icon: Search,
    label: 'Symptom Checker',
    desc: 'Check your symptoms',
    path: '/patient/symptoms',
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-orange-200',
    emoji: '🔍',
  },
  {
    icon: Phone,
    label: 'Talk to Doctor',
    desc: 'Video consultation',
    path: '/patient/doctors',
    color: 'from-blue-400 to-blue-600',
    shadow: 'shadow-blue-200',
    emoji: '📞',
  },
  {
    icon: FileText,
    label: 'Health Records',
    desc: 'Past consultations',
    path: '/patient/records',
    color: 'from-emerald-400 to-green-600',
    shadow: 'shadow-green-200',
    emoji: '📋',
  },
  {
    icon: AlertTriangle,
    label: 'Emergency SOS',
    desc: 'Get immediate help',
    path: '/patient/sos',
    color: 'from-red-500 to-red-600',
    shadow: 'shadow-red-200',
    emoji: '🚨',
  },
  {
    icon: PlayCircle,
    label: 'Health Videos',
    desc: 'Learn about health',
    path: '/patient/videos',
    color: 'from-purple-400 to-purple-600',
    shadow: 'shadow-purple-200',
    emoji: '🎬',
  },
  {
    icon: ClipboardList,
    label: 'Prescription',
    desc: 'Understand medicines',
    path: '/patient/prescription',
    color: 'from-teal-400 to-cyan-600',
    shadow: 'shadow-teal-200',
    emoji: '💊',
  },
];

export default function PatientHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar title="SwasthyaLink" showBack={false} />

      <div className="max-w-lg mx-auto px-4 py-5">
        {/* Welcome */}
        <div className="animate-fade-in bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white mb-6 shadow-lg shadow-emerald-200">
          <p className="text-emerald-100 text-sm">Welcome back 👋</p>
          <h2 className="text-2xl font-bold mt-1">Ramesh Yadav</h2>
          <p className="text-emerald-100 text-sm mt-1">📍 Sundarpur Village</p>
          <div className="mt-3 flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 text-sm">
            <Mic size={16} />
            <span>Tap to speak your symptoms</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="animate-fade-in delay-100 grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-emerald-600">3</p>
            <p className="text-xs text-gray-500 mt-1">Consultations</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-blue-600">2</p>
            <p className="text-xs text-gray-500 mt-1">Prescriptions</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-amber-600">1</p>
            <p className="text-xs text-gray-500 mt-1">SOS Used</p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`animate-fade-in delay-${(i + 2) * 100} bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 group`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center ${item.shadow} shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">{item.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* Offline Banner */}
        <div className="animate-fade-in mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl">📡</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Offline Mode Active</p>
            <p className="text-xs text-amber-600 mt-0.5">All features work without internet. Data syncs when connected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
