// Patient and health record types

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  village: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  lastVisit: string;
  createdAt: string;
  records: HealthRecord[];
}

export interface HealthRecord {
  id: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  urgency: 'low' | 'medium' | 'emergency';
  prescription: string;
  doctor: string;
  notes: string;
}

export interface DiagnosisResult {
  symptoms: string[];
  possibleConditions: {
    name: string;
    confidence: number;
    explanation: string;
    simpleExplanation: string;
  }[];
  urgency: 'low' | 'medium' | 'emergency';
  nextSteps: string[];
  homeRemedies: string[];
  simpleExplanation: string;
  doctorRecommendation: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; frequency: string; duration: string }[];
  advice: string;
  followUp: string;
  doctorName: string;
}

const STORAGE_KEYS = {
  PATIENTS: 'vaid_patients',
  PRESCRIPTIONS: 'vaid_prescriptions',
  SETTINGS: 'vaid_settings',
  HEALTH_RECORDS: 'vaid_health_records',
  SYNC_QUEUE: 'vaid_sync_queue',
};

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Patient storage operations
export function getPatients(): Patient[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : getDefaultPatients();
  } catch {
    return getDefaultPatients();
  }
}

export function savePatient(patient: Patient): void {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === patient.id);
  if (index >= 0) {
    patients[index] = patient;
  } else {
    patients.push(patient);
  }
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  addToSyncQueue({ type: 'patient_save', data: patient, timestamp: new Date().toISOString() });
}

export function deletePatient(id: string): void {
  const patients = getPatients().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
}

// Prescription storage
export function getPrescriptions(): Prescription[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePrescription(prescription: Prescription): void {
  const prescriptions = getPrescriptions();
  prescriptions.push(prescription);
  localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  addToSyncQueue({ type: 'prescription_save', data: prescription, timestamp: new Date().toISOString() });
}

// Sync queue for offline-first
interface SyncItem {
  type: string;
  data: unknown;
  timestamp: string;
  synced?: boolean;
}

export function addToSyncQueue(item: SyncItem): void {
  try {
    const queue: SyncItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
    queue.push({ ...item, synced: false });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  } catch {
    // silently fail
  }
}

export function getSyncQueue(): SyncItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
  } catch {
    return [];
  }
}

export function clearSyncQueue(): void {
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, '[]');
}

export function getPendingSyncCount(): number {
  return getSyncQueue().filter(i => !i.synced).length;
}

// Settings
export interface AppSettings {
  language: 'en' | 'hi' | 'mr';
  offlineMode: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  notificationsEnabled: boolean;
}

export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function getDefaultSettings(): AppSettings {
  return {
    language: 'en',
    offlineMode: false,
    fontSize: 'large',
    notificationsEnabled: true,
  };
}

function getDefaultPatients(): Patient[] {
  return [
    {
      id: 'demo-1',
      name: 'Ramesh Patil',
      age: 45,
      gender: 'male',
      phone: '9876543210',
      village: 'Wadgaon',
      bloodGroup: 'B+',
      allergies: ['Penicillin'],
      conditions: ['Diabetes Type 2'],
      lastVisit: '2025-01-10',
      createdAt: '2024-06-15',
      records: [
        {
          id: 'rec-1',
          date: '2025-01-10',
          symptoms: ['headache', 'dizziness', 'blurred vision'],
          diagnosis: 'Hypertension - Elevated blood pressure',
          urgency: 'medium',
          prescription: 'Amlodipine 5mg once daily',
          doctor: 'Dr. Sharma',
          notes: 'Monitor BP weekly. Follow up in 2 weeks.',
        },
      ],
    },
    {
      id: 'demo-2',
      name: 'Sunita Deshmukh',
      age: 32,
      gender: 'female',
      phone: '9876543211',
      village: 'Shirur',
      bloodGroup: 'O+',
      allergies: [],
      conditions: [],
      lastVisit: '2025-01-08',
      createdAt: '2024-09-20',
      records: [
        {
          id: 'rec-2',
          date: '2025-01-08',
          symptoms: ['fever', 'body pain', 'cough'],
          diagnosis: 'Viral fever - Seasonal flu',
          urgency: 'low',
          prescription: 'Paracetamol 500mg thrice daily for 3 days',
          doctor: 'Dr. Sharma',
          notes: 'Rest and drink warm fluids.',
        },
      ],
    },
    {
      id: 'demo-3',
      name: 'Ananta Jadhav',
      age: 67,
      gender: 'male',
      phone: '9876543212',
      village: 'Loni',
      bloodGroup: 'AB-',
      allergies: ['Sulfa drugs', 'Aspirin'],
      conditions: ['Heart Disease', 'Arthritis'],
      lastVisit: '2025-01-12',
      createdAt: '2024-03-10',
      records: [
        {
          id: 'rec-3',
          date: '2025-01-12',
          symptoms: ['chest pain', 'breathing difficulty', 'sweating'],
          diagnosis: 'Angina - Reduced blood flow to heart',
          urgency: 'emergency',
          prescription: 'Nitroglycerin sublingual as needed',
          doctor: 'Dr. Patil',
          notes: 'URGENT: Needs cardiac evaluation. Do not exert.',
        },
      ],
    },
  ];
}

// Export patient data as QR-compatible string
export function exportPatientQRData(patient: Patient): string {
  return JSON.stringify({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    allergies: patient.allergies,
    conditions: patient.conditions,
    lastVisit: patient.lastVisit,
  });
}
