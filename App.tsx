import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import RoleSelect from './pages/RoleSelect';
import PatientHome from './pages/patient/Home';
import SymptomChecker from './pages/patient/SymptomChecker';
import DoctorConnect from './pages/patient/DoctorConnect';
import PrescriptionExplainer from './pages/patient/PrescriptionExplainer';
import EmergencySOS from './pages/patient/EmergencySOS';
import HealthRecords from './pages/patient/HealthRecords';
import HealthVideos from './pages/patient/HealthVideos';
import DoctorDashboard from './pages/doctor/Dashboard';
import SOSRequests from './pages/doctor/SOSRequests';
import PatientHistory from './pages/doctor/PatientHistory';
import DoctorProfile from './pages/doctor/DoctorProfile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Role Selection */}
          <Route path="/" element={<RoleSelect />} />

          {/* Patient Routes */}
          <Route path="/patient" element={<PatientHome />} />
          <Route path="/patient/symptoms" element={<SymptomChecker />} />
          <Route path="/patient/doctors" element={<DoctorConnect />} />
          <Route path="/patient/prescription" element={<PrescriptionExplainer />} />
          <Route path="/patient/sos" element={<EmergencySOS />} />
          <Route path="/patient/records" element={<HealthRecords />} />
          <Route path="/patient/videos" element={<HealthVideos />} />

          {/* Doctor Routes */}
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/sos" element={<SOSRequests />} />
          <Route path="/doctor/patients" element={<PatientHistory />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
