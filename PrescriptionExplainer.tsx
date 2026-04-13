import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { mockPrescription } from '../../data/mockData';
import { Upload, FileImage, Pill, Clock, Info, CheckCircle } from 'lucide-react';

export default function PrescriptionExplainer() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 2500);
  };

  const reset = () => {
    setUploaded(false);
    setAnalyzing(false);
    setResult(false);
  };

  const purposeColors: Record<string, string> = {
    'Reduces fever and relieves mild to moderate pain': 'bg-orange-50 text-orange-700 border-orange-200',
    'Relieves allergy symptoms like sneezing and runny nose': 'bg-blue-50 text-blue-700 border-blue-200',
    'Antibiotic to fight bacterial infection': 'bg-red-50 text-red-700 border-red-200',
    'Prevents dehydration and restores electrolytes': 'bg-teal-50 text-teal-700 border-teal-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar title="Prescription Explainer" />
      <div className="max-w-lg mx-auto px-4 py-5">
        {!uploaded && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <span className="text-5xl">💊</span>
              <h2 className="text-lg font-bold text-gray-800 mt-3">Understand Your Prescription</h2>
              <p className="text-sm text-gray-500 mt-1">Upload your prescription and we'll explain each medicine in simple language</p>
            </div>

            <button
              onClick={handleUpload}
              className="w-full border-2 border-dashed border-emerald-300 rounded-2xl p-10 flex flex-col items-center gap-4 bg-emerald-50/50 hover:bg-emerald-50 transition-colors active:scale-[0.98]"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Upload size={32} className="text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="font-bold text-emerald-700">Upload Prescription</p>
                <p className="text-xs text-gray-500 mt-1">Take a photo or choose from gallery</p>
              </div>
            </button>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Your prescription image is processed locally on your device. No data is sent to any server. Works completely offline.
              </p>
            </div>
          </div>
        )}

        {analyzing && (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <FileImage size={36} className="text-emerald-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Analyzing Prescription...</h3>
            <p className="text-sm text-gray-500 mt-1">AI is reading your prescription</p>
            <div className="mt-4 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-[pulse_1s_ease-in-out_infinite] w-3/4" />
            </div>
          </div>
        )}

        {result && (
          <div className="animate-slide-up">
            {/* Success Header */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center mb-5">
              <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-emerald-800">Prescription Analyzed!</h3>
              <p className="text-xs text-emerald-600 mt-1">
                {mockPrescription.doctorName} • {mockPrescription.date}
              </p>
            </div>

            {/* Diagnosis */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Diagnosis</p>
              <p className="text-sm text-gray-800 font-medium mt-1">{mockPrescription.diagnosis}</p>
            </div>

            {/* Medicines */}
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Pill size={18} className="text-emerald-600" />
              Medicines Prescribed ({mockPrescription.medicines.length})
            </h3>

            <div className="space-y-3">
              {mockPrescription.medicines.map((med, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💊</span>
                    <h4 className="font-bold text-gray-800">{med.name}</h4>
                  </div>
                  <div className={`rounded-lg px-3 py-2 text-xs font-medium border mb-3 ${purposeColors[med.purpose] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    ℹ️ {med.purpose}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Dosage</p>
                      <p className="text-xs text-gray-700 font-medium mt-0.5">{med.dosage}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                        <Clock size={10} /> Duration
                      </p>
                      <p className="text-xs text-gray-700 font-medium mt-0.5">{med.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              className="w-full mt-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              Upload Another Prescription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
