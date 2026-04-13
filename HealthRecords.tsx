import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { getConsultations } from '../../utils/storage';
import { Consultation } from '../../data/mockData';
import { Calendar, Pill, ChevronRight, FileText, ArrowLeft } from 'lucide-react';

export default function HealthRecords() {
  const consultations = getConsultations();
  const [selected, setSelected] = useState<Consultation | null>(null);

  const riskBadge = (level: string) => {
    const styles = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-red-100 text-red-700',
    };
    return styles[level as keyof typeof styles] || styles.low;
  };

  if (selected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Navbar title="Consultation Details" />
        <div className="max-w-lg mx-auto px-4 py-5 animate-slide-up">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-700"
          >
            <ArrowLeft size={16} /> Back to records
          </button>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${riskBadge(selected.riskLevel)}`}>
                {selected.riskLevel.toUpperCase()} RISK
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> {selected.date}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{selected.doctorName}</h3>
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Symptoms</h4>
            <div className="flex flex-wrap gap-2">
              {selected.symptoms.map(s => (
                <span key={s} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-4">
            <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Doctor's Summary
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">{selected.summary}</p>
          </div>

          {/* Medicines */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
              <Pill size={14} className="text-emerald-600" /> Prescribed Medicines
            </h4>
            <div className="space-y-3">
              {selected.medicines.map((med, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="font-bold text-gray-800 text-sm">💊 {med.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{med.purpose}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">{med.dosage}</span>
                    <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">{med.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar title="Health Records" />
      <div className="max-w-lg mx-auto px-4 py-5">
        <p className="text-sm text-gray-500 mb-4">Your past consultations</p>

        {consultations.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p>No records yet</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {consultations.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                  c.riskLevel === 'high' ? 'bg-red-100' : c.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  {c.riskLevel === 'high' ? '🔴' : c.riskLevel === 'medium' ? '🟡' : '🟢'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{c.doctorName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{c.symptoms.join(', ')}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar size={10} /> {c.date} • {c.medicines.length} medicine{c.medicines.length > 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
