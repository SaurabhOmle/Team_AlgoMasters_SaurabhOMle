import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getSOSRequests, getConsultations } from '../../utils/storage';
import { Users, Star, AlertTriangle, ClipboardList, User, Activity, TrendingUp, Bell } from 'lucide-react';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const sosRequests = getSOSRequests().filter(r => r.status === 'pending');
  const consultations = getConsultations();

  const stats = [
    { icon: Users, label: 'Total Patients', value: '1,240', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
    { icon: Star, label: 'Rating', value: '4.8 ⭐', color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-200' },
    { icon: Activity, label: 'This Month', value: '87', color: 'from-emerald-500 to-green-600', shadow: 'shadow-green-200' },
    { icon: TrendingUp, label: 'Success Rate', value: '96%', color: 'from-purple-500 to-indigo-600', shadow: 'shadow-purple-200' },
  ];

  const menuItems = [
    {
      icon: AlertTriangle,
      label: 'SOS Requests',
      desc: `${sosRequests.length} pending`,
      path: '/doctor/sos',
      color: 'from-red-500 to-red-600',
      badge: sosRequests.length,
    },
    {
      icon: ClipboardList,
      label: 'Patient History',
      desc: `${consultations.length} records`,
      path: '/doctor/patients',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: User,
      label: 'My Profile',
      desc: 'View & edit profile',
      path: '/doctor/profile',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar title="Doctor Dashboard" showBack={false} role="doctor" />
      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Welcome */}
        <div className="animate-fade-in bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-5 text-white mb-6 shadow-lg shadow-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Good morning 👋</p>
              <h2 className="text-2xl font-bold mt-1">Dr. Priya Sharma</h2>
              <p className="text-blue-200 text-sm mt-1">General Medicine</p>
            </div>
            <div className="text-5xl">👩‍⚕️</div>
          </div>
          {sosRequests.length > 0 && (
            <button
              onClick={() => navigate('/doctor/sos')}
              className="mt-3 w-full bg-red-500/30 border border-red-300/50 text-white rounded-xl px-4 py-2.5 flex items-center justify-between hover:bg-red-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bell size={16} className="animate-bounce" />
                <span className="text-sm font-medium">{sosRequests.length} new SOS request(s)</span>
              </div>
              <span className="text-xs bg-red-500 px-2 py-1 rounded-full font-bold">VIEW</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="animate-fade-in bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center ${stat.shadow} shadow-md mb-2`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <p className="text-xl font-extrabold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
        <div className="space-y-3 animate-fade-in">
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                <item.icon size={22} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800">{item.label}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <h3 className="font-bold text-gray-800 mt-6 mb-3">Recent Consultations</h3>
        <div className="space-y-2 animate-fade-in">
          {consultations.slice(0, 3).map(c => (
            <div key={c.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                c.riskLevel === 'high' ? 'bg-red-100' : c.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'
              }`}>
                {c.riskLevel === 'high' ? '🔴' : c.riskLevel === 'medium' ? '🟡' : '🟢'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{c.patientName}</p>
                <p className="text-xs text-gray-400">{c.date}</p>
              </div>
              <span className="text-xs text-gray-400">{c.symptoms.length} symptoms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
