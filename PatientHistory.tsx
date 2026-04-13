import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { getConsultations } from '../../utils/storage';
import { patients, Consultation } from '../../data/mockData';
import { User, Calendar, Pill, FileText, ChevronRight, ArrowLeft, Search, MapPin, Phone } from 'lucide-react';

export default function PatientHistory() {
  const consultations = getConsultations();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patientConsultations = consultations.filter(c => c.patientId === selectedPatient);

  if (selectedConsultation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar title="Consultation Detail" role="doctor" />
        <div className="max-w-lg mx-auto px-4 py-5 animate-slide-up">
          <button
            onClick={() => setSelectedConsultation(null)}
            className="flex items-center gap-1 text-sm text-gray-500 mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                selectedConsultation.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                selectedConsultation.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {selectedConsultation.riskLevel.toUpperCase()} RISK
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> {selectedConsultation.date}
              </span>
            </div>
            <h3 className="font-bold text-gray-800">{selectedConsultation.patientName}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Symptoms</h4>
            <div className="flex flex-wrap gap-2">
              {selectedConsultation.symptoms.map(s => (
                <span key={s} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-4">
            <h4 className="font-bold text-blue-800 mb-2 text-sm flex items-center gap-2">
              <FileText size={14} /> Summary
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">{selectedConsultation.summary}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <Pill size={14} className="text-emerald-600" /> Prescriptions
            </h4>
            <div className="space-y-2">
              {selectedConsultation.medicines.map((med, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="font-bold text-gray-800 text-sm">💊 {med.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{med.purpose}</p>
                  <p className="text-xs text-emerald-600 mt-1">{med.dosage} • {med.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPatient) {
    const patient = patients.find(p => p.id === selectedPatient);
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar title="Patient Details" role="doctor" />
        <div className="max-w-lg mx-auto px-4 py-5 animate-fade-in">
          <button
            onClick={() => setSelectedPatient(null)}
            className="flex items-center gap-1 text-sm text-gray-500 mb-4"
          >
            <ArrowLeft size={16} /> Back to patients
          </button>

          {patient && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.age} yrs • {patient.gender}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin size={10} /> {patient.village}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone size={10} /> {patient.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h3 className="font-bold text-gray-800 mb-3">Consultation History ({patientConsultations.length})</h3>

          {patientConsultations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">
              No consultations found
            </div>
          ) : (
            <div className="space-y-2">
              {patientConsultations.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConsultation(c)}
                  className="w-full bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-left flex items-center gap-3 hover:shadow-md transition-shadow"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                    c.riskLevel === 'high' ? 'bg-red-100' : c.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                  }`}>
                    {c.riskLevel === 'high' ? '🔴' : c.riskLevel === 'medium' ? '🟡' : '🟢'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{c.symptoms.join(', ')}</p>
                    <p className="text-xs text-gray-400">{c.date} • {c.medicines.length} meds</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar title="Patient History" role="doctor" />
      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Search */}
        <div className="relative mb-4 animate-fade-in">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search patients..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          />
        </div>

        {/* Patient List */}
        <div className="space-y-2 animate-fade-in">
          {filteredPatients.map(patient => {
            const patientCons = consultations.filter(c => c.patientId === patient.id);
            return (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm">{patient.name}</h3>
                  <p className="text-xs text-gray-500">{patient.age} yrs • {patient.gender} • {patient.village}</p>
                  {patientCons.length > 0 && (
                    <p className="text-xs text-blue-500 mt-1">{patientCons.length} consultation(s)</p>
                  )}
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
