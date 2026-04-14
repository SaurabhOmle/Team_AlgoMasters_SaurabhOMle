import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, FileText, Pill, Clock, Plus, X, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Patient, Prescription } from '../utils/storage';
import { savePrescription, generateId } from '../utils/storage';

export default function DoctorDashboard() {
  const { state, dispatch, t } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    advice: '',
    followUp: '',
  });
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);

  const handleSavePrescription = () => {
    if (!selectedPatient || !prescriptionData.diagnosis) return;
    const prescription: Prescription = {
      id: generateId(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      date: new Date().toISOString().split('T')[0],
      diagnosis: prescriptionData.diagnosis,
      medicines: prescriptionData.medicines.filter(m => m.name),
      advice: prescriptionData.advice,
      followUp: prescriptionData.followUp,
      doctorName: 'Dr. Sharma',
    };
    savePrescription(prescription);
    setPrescriptionSaved(true);
    setTimeout(() => {
      setShowPrescription(false);
      setPrescriptionSaved(false);
      setPrescriptionData({
        diagnosis: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
        advice: '',
        followUp: '',
      });
    }, 1500);
  };

  const addMedicineRow = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '' }],
    }));
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    setPrescriptionData(prev => {
      const medicines = [...prev.medicines];
      medicines[index] = { ...medicines[index], [field]: value };
      return { ...prev, medicines };
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass sticky top-0 z-10">
        <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'home' })} className="p-2 rounded-xl hover:bg-surface-3 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold font-display">{t('doctorDashboard')}</h1>
          <p className="text-[10px] text-text-muted">Low bandwidth mode • Data saver on</p>
        </div>
        <div className="ml-auto">
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
            <span className="text-xs">👨‍⚕️</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 mt-3">
        {[
          { label: t('todayPatients'), value: state.patients.length, icon: '👥' },
          { label: t('prescriptions'), value: state.patients.reduce((acc, p) => acc + p.records.length, 0), icon: '📋' },
          { label: 'Emergency', value: state.patients.filter(p => p.records.some(r => r.urgency === 'emergency')).length, icon: '🚨' },
        ].map((stat, i) => (
          <div key={i} className="p-3 rounded-xl glass border border-surface-4 text-center">
            <span className="text-lg">{stat.icon}</span>
            <p className="text-xl font-bold text-text mt-1">{stat.value}</p>
            <p className="text-[10px] text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Patient Queue */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">{t('patientSummary')}</h3>
        <div className="space-y-2">
          {state.patients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-l-4 ${getUrgencyBadge(patient)} cursor-pointer card-hover`}
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center">
                    <User size={16} className="text-text-muted" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text">{patient.name}</h4>
                    <p className="text-[10px] text-text-muted">{patient.age} yrs • {patient.village} • {patient.bloodGroup || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  {patient.records.length > 0 && (
                    <>
                      <p className="text-[10px] text-text-muted">{patient.records[patient.records.length - 1].date}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${patient.records[patient.records.length - 1].urgency === 'emergency' ? 'bg-red-500/20 text-red-400' : patient.records[patient.records.length - 1].urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-primary/20 text-primary'}`}>
                        {patient.records[patient.records.length - 1].urgency}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {patient.allergies.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {patient.allergies.map((a, i) => (
                    <span key={i} className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
                      ⚠️ {a}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Patient Detail + Prescription Modal */}
      {selectedPatient && !showPrescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setSelectedPatient(null)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-surface-2 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-display">{selectedPatient.name}</h3>
              <button onClick={() => setSelectedPatient(null)} className="p-2 rounded-xl hover:bg-surface-3">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2 rounded-lg bg-surface-3 text-center">
                <p className="text-xs text-text-muted">{t('age')}</p>
                <p className="text-sm font-semibold">{selectedPatient.age}</p>
              </div>
              <div className="p-2 rounded-lg bg-surface-3 text-center">
                <p className="text-xs text-text-muted">{t('bloodGroup')}</p>
                <p className="text-sm font-semibold">{selectedPatient.bloodGroup || 'N/A'}</p>
              </div>
              <div className="p-2 rounded-lg bg-surface-3 text-center">
                <p className="text-xs text-text-muted">{t('village')}</p>
                <p className="text-sm font-semibold truncate">{selectedPatient.village}</p>
              </div>
            </div>

            {selectedPatient.records.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">Last Visit</h4>
                <div className="p-3 rounded-xl glass border border-surface-4">
                  <p className="text-sm font-medium text-text">{selectedPatient.records[0].diagnosis}</p>
                  <p className="text-xs text-primary mt-1">💊 {selectedPatient.records[0].prescription}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowPrescription(true)}
              className="w-full py-3 rounded-xl bg-primary text-surface font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <FileText size={18} /> {t('generatePrescription')}
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Prescription Form Modal */}
      {showPrescription && selectedPatient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-surface-2 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {prescriptionSaved ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
                >
                  <Check size={28} className="text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-text">Prescription Saved!</h3>
                <p className="text-sm text-text-muted mt-1"> synced to patient records</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold font-display">{t('newPrescription')}</h3>
                  <button onClick={() => setShowPrescription(false)} className="p-2 rounded-xl hover:bg-surface-3">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-xs text-text-muted mb-4">Patient: {selectedPatient.name}</p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-text-muted block mb-1">{t('diagnosis')} *</label>
                    <input
                      value={prescriptionData.diagnosis}
                      onChange={e => setPrescriptionData(p => ({ ...p, diagnosis: e.target.value }))}
                      className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text"
                      placeholder="Enter diagnosis"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1 flex items-center gap-1">
                      <Pill size={12} /> {t('medicine')}
                    </label>
                    {prescriptionData.medicines.map((med, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          value={med.name}
                          onChange={e => updateMedicine(i, 'name', e.target.value)}
                          placeholder="Medicine name"
                          className="p-2 rounded-lg glass border border-surface-4 focus:border-primary/50 focus:outline-none text-xs text-text"
                        />
                        <input
                          value={med.dosage}
                          onChange={e => updateMedicine(i, 'dosage', e.target.value)}
                          placeholder="Dosage (e.g. 500mg)"
                          className="p-2 rounded-lg glass border border-surface-4 focus:border-primary/50 focus:outline-none text-xs text-text"
                        />
                        <input
                          value={med.frequency}
                          onChange={e => updateMedicine(i, 'frequency', e.target.value)}
                          placeholder="Frequency (e.g. 2x daily)"
                          className="p-2 rounded-lg glass border border-surface-4 focus:border-primary/50 focus:outline-none text-xs text-text"
                        />
                        <input
                          value={med.duration}
                          onChange={e => updateMedicine(i, 'duration', e.target.value)}
                          placeholder="Duration (e.g. 7 days)"
                          className="p-2 rounded-lg glass border border-surface-4 focus:border-primary/50 focus:outline-none text-xs text-text"
                        />
                      </div>
                    ))}
                    <button onClick={addMedicineRow} className="text-xs text-primary flex items-center gap-1 mt-1">
                      <Plus size={12} /> Add another medicine
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1">{t('advice')}</label>
                    <textarea
                      value={prescriptionData.advice}
                      onChange={e => setPrescriptionData(p => ({ ...p, advice: e.target.value }))}
                      className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1 flex items-center gap-1">
                      <Clock size={12} /> {t('followUp')}
                    </label>
                    <input
                      value={prescriptionData.followUp}
                      onChange={e => setPrescriptionData(p => ({ ...p, followUp: e.target.value }))}
                      placeholder="e.g. After 1 week"
                      className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowPrescription(false)}
                    className="flex-1 py-3 rounded-xl glass border border-surface-4 text-text-muted text-sm">
                    {t('cancel')}
                  </button>
                  <button onClick={handleSavePrescription} disabled={!prescriptionData.diagnosis}
                    className="flex-1 py-3 rounded-xl bg-primary text-surface font-semibold text-sm disabled:opacity-30">
                    {t('save')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function getUrgencyBadge(patient: Patient): string {
  const maxUrgency = patient.records.length > 0 ? patient.records[0].urgency : 'low';
  switch (maxUrgency) {
    case 'emergency': return 'border-l-red-500 bg-red-500/5 glass';
    case 'medium': return 'border-l-yellow-500 bg-yellow-500/5 glass';
    default: return 'border-l-primary bg-primary/5 glass';
  }
}
