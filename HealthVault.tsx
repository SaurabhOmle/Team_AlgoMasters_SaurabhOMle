import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, QrCode, Trash2, ChevronRight, User, Heart, AlertCircle, Search, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../contexts/AppContext';
import type { Patient, HealthRecord } from '../utils/storage';
import { savePatient, deletePatient as deletePatientUtil, generateId, exportPatientQRData, getPendingSyncCount } from '../utils/storage';

export default function HealthVault() {
  const { state, dispatch, t, refreshPatients } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showQR, setShowQR] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pendingSync = getPendingSyncCount();

  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'male' as 'male' | 'female' | 'other',
    phone: '', village: '', bloodGroup: '', allergies: '', conditions: '',
  });

  const filteredPatients = state.patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = () => {
    if (!formData.name || !formData.age) return;
    const patient: Patient = {
      id: generateId(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      phone: formData.phone,
      village: formData.village,
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
      conditions: formData.conditions.split(',').map(c => c.trim()).filter(Boolean),
      lastVisit: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      records: [],
    };
    savePatient(patient);
    refreshPatients();
    setFormData({ name: '', age: '', gender: 'male', phone: '', village: '', bloodGroup: '', allergies: '', conditions: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    deletePatientUtil(id);
    refreshPatients();
    setSelectedPatient(null);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass sticky top-0 z-10">
        <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'home' })} className="p-2 rounded-xl hover:bg-surface-3 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold font-display">{t('vault')}</h1>
        <div className="ml-auto flex items-center gap-2">
          {pendingSync > 0 && (
            <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
              {pendingSync} {t('pending')}
            </span>
          )}
          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            ✓ {t('synced')}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mt-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text placeholder-text-muted/50"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Add Patient Button */}
      <div className="px-4 mt-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
        >
          <Plus size={18} /> {t('addPatient')}
        </motion.button>
      </div>

      {/* Patient List */}
      <div className="px-4 mt-3 space-y-2">
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => setSelectedPatient(patient)}
              className="w-full p-4 rounded-2xl glass border border-surface-4 hover:border-primary/30 transition-all text-left card-hover"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text truncate">{patient.name}</h4>
                    <ChevronRight size={16} className="text-text-muted flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-text-muted">{patient.age} yrs</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted">{patient.village}</span>
                    {patient.bloodGroup && (
                      <span className="text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                        {patient.bloodGroup}
                      </span>
                    )}
                  </div>
                  {patient.records.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getUrgencyBadge(patient.records[patient.records.length - 1].urgency)}`}>
                        {patient.records[patient.records.length - 1].urgency}
                      </span>
                      <span className="text-[10px] text-text-muted">{patient.records.length} {t('records')}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </motion.div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-text-muted/30" />
            <p className="text-text-muted mt-3 text-sm">{t('noRecords')}</p>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-2 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold font-display">{t('addPatient')}</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 rounded-xl hover:bg-surface-3">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1">{t('name')} *</label>
                  <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-muted block mb-1">{t('age')} *</label>
                    <input type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))}
                      className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1">{t('gender')}</label>
                    <select value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value as any }))}
                      className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text bg-surface-2">
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                      <option value="other">{t('other')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">{t('phone')}</label>
                  <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text" />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">{t('village')}</label>
                  <input value={formData.village} onChange={e => setFormData(p => ({ ...p, village: e.target.value }))}
                    className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text" />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">{t('bloodGroup')}</label>
                  <select value={formData.bloodGroup} onChange={e => setFormData(p => ({ ...p, bloodGroup: e.target.value }))}
                    className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text bg-surface-2">
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">{t('allergies')} (comma separated)</label>
                  <input value={formData.allergies} onChange={e => setFormData(p => ({ ...p, allergies: e.target.value }))}
                    placeholder="e.g. Penicillin, Aspirin"
                    className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text" />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">{t('conditions')} (comma separated)</label>
                  <input value={formData.conditions} onChange={e => setFormData(p => ({ ...p, conditions: e.target.value }))}
                    placeholder="e.g. Diabetes, Hypertension"
                    className="w-full p-3 rounded-xl glass border border-surface-4 focus:border-primary/50 focus:outline-none text-sm text-text" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 rounded-xl glass border border-surface-4 text-text-muted hover:text-text transition-colors text-sm">
                  {t('cancel')}
                </button>
                <button onClick={handleAddPatient} disabled={!formData.name || !formData.age}
                  className="flex-1 py-3 rounded-xl bg-primary text-surface font-semibold hover:bg-primary-dark transition-colors text-sm disabled:opacity-30">
                  {t('save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Details Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-2 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              {/* Patient Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text">{selectedPatient.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-text-muted">{selectedPatient.age} yrs</span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted">{selectedPatient.village}</span>
                      {selectedPatient.bloodGroup && (
                        <span className="text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded ml-1">
                          {selectedPatient.bloodGroup}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setShowQR(selectedPatient); }} className="p-2 rounded-xl hover:bg-surface-3 text-primary">
                    <QrCode size={20} />
                  </button>
                  <button onClick={() => handleDelete(selectedPatient.id)} className="p-2 rounded-xl hover:bg-red-500/10 text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Allergies & Conditions */}
              {(selectedPatient.allergies.length > 0 || selectedPatient.conditions.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPatient.allergies.map((a, i) => (
                    <span key={i} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full border border-red-500/20 flex items-center gap-1">
                      <AlertCircle size={10} /> {a}
                    </span>
                  ))}
                  {selectedPatient.conditions.map((c, i) => (
                    <span key={i} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/20 flex items-center gap-1">
                      <Heart size={10} /> {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Health Records */}
              <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">{t('records')}</h4>
              <div className="space-y-2">
                {selectedPatient.records.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-text-muted">{t('noRecords')}</p>
                  </div>
                ) : (
                  selectedPatient.records.map((record: HealthRecord) => (
                    <div key={record.id} className="p-3 rounded-xl glass border border-surface-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-muted">{record.date}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getUrgencyBadge(record.urgency)}`}>
                          {record.urgency}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-text">{record.diagnosis}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {record.symptoms.map((s, i) => (
                          <span key={i} className="text-[10px] bg-surface-4 text-text-muted px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-primary mt-2">💊 {record.prescription}</p>
                      {record.notes && <p className="text-xs text-text-muted mt-1">📝 {record.notes}</p>}
                      <p className="text-xs text-text-muted mt-1">👨‍⚕️ {record.doctor}</p>
                    </div>
                  ))
                )}
              </div>

              <button onClick={() => setSelectedPatient(null)}
                className="w-full mt-4 py-3 rounded-xl glass border border-surface-4 text-text-muted hover:text-text transition-colors text-sm">
                {t('back')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQR(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface-2 rounded-3xl p-8 text-center max-w-xs w-full"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <QrCode size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-1">{showQR.name}</h3>
              <p className="text-xs text-text-muted mb-4">{t('qrCode')} — Scan to retrieve records</p>
              <div className="bg-white p-4 rounded-2xl inline-block">
                <QRCodeSVG
                  value={exportPatientQRData(showQR)}
                  size={180}
                  bgColor="#FFFFFF"
                  fgColor="#0A0E27"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[10px] text-text-muted mt-4">
                {t('name')}: {showQR.name} • {t('age')}: {showQR.age} • {t('bloodGroup')}: {showQR.bloodGroup || 'N/A'}
              </p>
              <button onClick={() => setShowQR(null)}
                className="mt-4 px-6 py-2 rounded-xl glass border border-surface-4 text-text-muted hover:text-text transition-colors text-sm">
                {t('back')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
