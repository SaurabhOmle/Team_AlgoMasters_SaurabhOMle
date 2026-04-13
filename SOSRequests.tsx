import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getSOSRequests, updateSOSRequest, addSOSRequest, generateId } from '../../utils/storage';
import { SOSRequest } from '../../data/mockData';
import { AlertTriangle, Check, Clock, MapPin, Phone, User, RefreshCw } from 'lucide-react';

export default function SOSRequests() {
  const [requests, setRequests] = useState<SOSRequest[]>([]);
  const [accepted, setAccepted] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const all = getSOSRequests();
    setRequests(all);
  };

  const acceptRequest = (id: string) => {
    updateSOSRequest(id, { status: 'accepted', doctorId: 'd1' });
    setAccepted(id);
    setTimeout(() => {
      loadRequests();
      setAccepted(null);
    }, 2000);
  };

  const simulateNewSOS = () => {
    const names = ['Sita Devi', 'Geeta Kumari', 'Mohan Lal', 'Lakshmi Bai'];
    const villages = ['Sundarpur', 'Mangalgarh', 'Chandanpur', 'Rampur'];
    const symptoms = [
      'Severe chest pain and difficulty breathing',
      'High fever with convulsions',
      'Heavy bleeding after injury',
      'Severe allergic reaction',
      'Unconscious patient found',
    ];

    addSOSRequest({
      id: generateId(),
      patientId: `p${Math.floor(Math.random() * 5) + 1}`,
      patientName: names[Math.floor(Math.random() * names.length)],
      village: villages[Math.floor(Math.random() * villages.length)],
      symptoms: symptoms[Math.floor(Math.random() * symptoms.length)],
      timestamp: new Date().toISOString(),
      status: 'pending',
    });
    loadRequests();
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar title="SOS Requests" role="doctor" />
      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Simulate button */}
        <button
          onClick={simulateNewSOS}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 mb-5 flex items-center justify-center gap-2 active:scale-95 transition-all animate-fade-in"
        >
          <RefreshCw size={16} /> Simulate New SOS Request
        </button>

        {/* Pending */}
        <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
          <AlertTriangle size={16} />
          Pending Requests ({pendingRequests.length})
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-6">
            <p className="text-gray-400 text-sm">No pending SOS requests</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all ${
                  accepted === req.id ? 'border-emerald-400 bg-emerald-50' : 'border-red-200 animate-fade-in'
                }`}
              >
                {accepted === req.id ? (
                  <div className="text-center py-4 animate-fade-in">
                    <Check size={32} className="text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-emerald-700">Connected to Patient!</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-red-600 uppercase">EMERGENCY</span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(req.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{req.patientName}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={10} /> {req.village}
                        </p>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-xl p-3 mb-3">
                      <p className="text-sm text-red-700">{req.symptoms}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => acceptRequest(req.id)}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Check size={16} /> Accept
                      </button>
                      <button className="bg-white border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                        <Phone size={16} /> Call First
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Accepted */}
        {acceptedRequests.length > 0 && (
          <>
            <h3 className="font-bold text-emerald-700 mb-3 flex items-center gap-2">
              <Check size={16} />
              Accepted ({acceptedRequests.length})
            </h3>
            <div className="space-y-2">
              {acceptedRequests.slice(0, 5).map(req => (
                <div key={req.id} className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex items-center gap-3">
                  <Check size={16} className="text-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{req.patientName}</p>
                    <p className="text-xs text-gray-500">{req.village} • {new Date(req.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
