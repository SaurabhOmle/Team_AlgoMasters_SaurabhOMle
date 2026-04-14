import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type { AppSettings, Patient } from '../utils/storage';
import { getSettings, saveSettings, getPatients } from '../utils/storage';
import type { ConnectivityState } from '../utils/connectivity';
import { simulateConnectivity } from '../utils/connectivity';

// Translation system
const translations: Record<string, Record<string, string>> = {
  en: {
    appName: 'Vaid',
    appTagline: 'Doctor in Your Pocket',
    home: 'Home',
    symptoms: 'Check Symptoms',
    vault: 'Health Vault',
    doctor: 'Doctor',
    emergency: 'Emergency SOS',
    settings: 'Settings',
    speakSymptoms: 'Press mic and speak your symptoms',
    listening: 'Listening...',
    processing: 'Analyzing your symptoms...',
    typeSymptoms: 'Or type your symptoms here...',
    analyze: 'Analyze Symptoms',
    results: 'AI Analysis Results',
    urgency: 'Urgency Level',
    low: 'Low',
    medium: 'Medium',
    emergencyLevel: '🚨 Emergency',
    possibleConditions: 'Possible Conditions',
    nextSteps: 'Recommended Next Steps',
    homeRemedies: 'Home Remedies',
    doctorRecommendation: 'Doctor Recommendation',
    explain: 'Explain in Simple Words',
    patients: 'Patients',
    addPatient: 'Add Patient',
    qrCode: 'QR Code',
    syncStatus: 'Sync Status',
    synced: 'Synced',
    pending: 'Pending',
    offline: 'Offline',
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    phone: 'Phone',
    village: 'Village',
    bloodGroup: 'Blood Group',
    allergies: 'Allergies',
    save: 'Save',
    cancel: 'Cancel',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    quickActions: 'What would you like to do?',
    emergencyBtn: '🆘 SOS Emergency',
    emergencyDesc: 'One tap to get immediate help',
    connectDoctor: 'Connect with Doctor',
    connectDesc: 'Talk to a healthcare provider',
    checkSymptoms: 'Check Symptoms',
    checkDesc: 'Describe how you feel',
    healthVault: 'Health Vault',
    healthVaultDesc: 'Your medical records',
    networkStatus: 'Network Status',
    consultationMode: 'Consultation Mode',
    video: 'Video Call',
    audio: 'Audio Call',
    chat: 'Chat',
    doctorDashboard: 'Doctor Dashboard',
    patientSummary: 'Patient Summary',
    prescriptions: 'Prescriptions',
    generatePrescription: 'Generate Prescription',
    todayPatients: "Today's Patients",
    sosActivated: 'SOS ACTIVATED',
    sosHelp: 'Sending your location and health data...',
    sosGuidance: 'Emergency Guidance',
    sosStep1: '1. Stay calm and sit down',
    sosStep2: '2. Loosen tight clothing',
    sosStep3: '3. Call 108 for ambulance',
    sosStep4: '4. Inform a family member',
    sosStep5: '5. Keep your medicines nearby',
    cancelSOS: 'Cancel SOS',
    language: 'Language',
    english: 'English',
    hindi: 'हिन्दी',
    marathi: 'मराठी',
    fontSize: 'Text Size',
    offlineToggle: 'Simulate Offline Mode',
    about: 'About Vaid',
    aboutDesc: 'A telemedicine platform designed for rural and low-connectivity environments. Works offline with AI-powered symptom analysis in local languages.',
    records: 'Health Records',
    viewRecords: 'View Records',
    diagnosis: 'Diagnosis',
    prescription: 'Prescription',
    date: 'Date',
    notes: 'Notes',
    noRecords: 'No records yet',
    back: 'Back',
    search: 'Search patients...',
    medicine: 'Medicine',
    dosage: 'Dosage',
    frequency: 'Frequency',
    duration: 'Duration',
    advice: 'Advice',
    followUp: 'Follow Up',
    newPrescription: 'New Prescription',
    patientDetails: 'Patient Details',
    deletePatient: 'Delete Patient',
    confirm: 'Confirm',
    edit: 'Edit',
    confidence: 'confidence',
    welcome: 'Welcome to Vaid',
    welcomeSub: 'Your health companion that works even without internet',
    getStarted: 'Get Started',
    greeting: 'Hello! I am your health assistant.',
    greetingSub: 'How can I help you today?',
  },
  hi: {
    appName: 'Vaid',
    appTagline: 'आपकी जेब में डॉक्टर',
    home: 'होम',
    symptoms: 'लक्षण जांचें',
    vault: 'स्वास्थ्य वॉल्ट',
    doctor: 'डॉक्टर',
    emergency: 'आपातकालीन SOS',
    settings: 'सेटिंग्स',
    speakSymptoms: 'माइक दबाएं और अपने लक्षण बोलें',
    listening: 'सुन रहा हूं...',
    processing: 'आपके लक्षणों का विश्लेषण कर रहा हूं...',
    typeSymptoms: 'या अपने लक्षण यहां लिखें...',
    analyze: 'लक्षणों का विश्लेषण करें',
    results: 'AI विश्लेषण परिणाम',
    urgency: 'तात्कालिकता स्तर',
    low: 'कम',
    medium: 'मध्यम',
    emergencyLevel: '🚨 आपातकालीन',
    possibleConditions: 'संभावित स्थितियां',
    nextSteps: 'अनुशंसित अगले कदम',
    homeRemedies: 'घरेलू उपचार',
    doctorRecommendation: 'डॉक्टर की सिफारिश',
    explain: 'सरल शब्दों में समझाएं',
    patients: 'मरीज',
    addPatient: 'मरीज जोड़ें',
    qrCode: 'QR कोड',
    syncStatus: 'सिंक स्थिति',
    synced: 'सिंक हो गया',
    pending: 'लंबित',
    offline: 'ऑफलाइन',
    name: 'नाम',
    age: 'उम्र',
    gender: 'लिंग',
    phone: 'फोन',
    village: 'गांव',
    bloodGroup: 'ब्लड ग्रुप',
    allergies: 'एलर्जी',
    save: 'सेव',
    cancel: 'रद्द करें',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    quickActions: 'आप क्या करना चाहेंगे?',
    emergencyBtn: '🆘 SOS आपातकालीन',
    emergencyDesc: 'तुरंत मदद पाने के लिए एक टैप',
    connectDoctor: 'डॉक्टर से बात करें',
    connectDesc: 'स्वास्थ्य सेवा प्रदाता से बात करें',
    checkSymptoms: 'लक्षण जांचें',
    checkDesc: 'बताएं आप कैसा महसूस कर रहे हैं',
    healthVault: 'स्वास्थ्य वॉल्ट',
    healthVaultDesc: 'आपके चिकित्सा रिकॉर्ड',
    networkStatus: 'नेटवर्क स्थिति',
    consultationMode: 'परामर्श मोड',
    video: 'वीडियो कॉल',
    audio: 'ऑडियो कॉल',
    chat: 'चैट',
    doctorDashboard: 'डॉक्टर डैशबोर्ड',
    patientSummary: 'मरीज सारांश',
    prescriptions: 'पर्चे',
    generatePrescription: 'पर्चा बनाएं',
    todayPatients: 'आज के मरीज',
    sosActivated: 'SOS सक्रिय',
    sosHelp: 'आपका स्थान और स्वास्थ्य डेटा भेज रहा हूं...',
    sosGuidance: 'आपातकालीन मार्गदर्शन',
    sosStep1: '1. शांत रहें और बैठ जाएं',
    sosStep2: '2. कसे हुए कपड़े ढीले करें',
    sosStep3: '3. एम्बुलेंस के लिए 108 पर कॉल करें',
    sosStep4: '4. परिवार के सदस्य को सूचित करें',
    sosStep5: '5. अपनी दवाइयां पास रखें',
    cancelSOS: 'SOS रद्द करें',
    language: 'भाषा',
    english: 'English',
    hindi: 'हिन्दी',
    marathi: 'मराठी',
    fontSize: 'टेक्स्ट साइज',
    offlineToggle: 'ऑफलाइन मोड सिमुलेट करें',
    about: 'Vaid के बारे में',
    aboutDesc: 'ग्रामीण और कम कनेक्टिविटी वाले क्षेत्रों के लिए टेलीमेडिसिन प्लेटफॉर्म। स्थानीय भाषाओं में AI-संचालित लक्षण विश्लेषण के साथ ऑफलाइन काम करता है।',
    records: 'स्वास्थ्य रिकॉर्ड',
    viewRecords: 'रिकॉर्ड देखें',
    diagnosis: 'निदान',
    prescription: 'पर्चा',
    date: 'तारीख',
    notes: 'नोट्स',
    noRecords: 'अभी तक कोई रिकॉर्ड नहीं',
    back: 'वापस',
    search: 'मरीज खोजें...',
    medicine: 'दवा',
    dosage: 'खुराक',
    frequency: 'आवृत्ति',
    duration: 'अवधि',
    advice: 'सलाह',
    followUp: 'फॉलो अप',
    newPrescription: 'नया पर्चा',
    patientDetails: 'मरीज विवरण',
    deletePatient: 'मरीज हटाएं',
    confirm: 'पुष्टि करें',
    edit: 'संपादित करें',
    confidence: 'विश्वास',
    welcome: 'Vaid में आपका स्वागत है',
    welcomeSub: 'आपका स्वास्थ्य साथी जो बिना इंटरनेट के भी काम करता है',
    getStarted: 'शुरू करें',
    greeting: 'नमस्ते! मैं आपका स्वास्थ्य सहायक हूं।',
    greetingSub: 'आज मैं आपकी कैसे मदद कर सकता हूं?',
  },
  mr: {
    appName: 'Vaid',
    appTagline: 'तुमच्या खिशात डॉक्टर',
    home: 'होम',
    symptoms: 'लक्षणे तपासा',
    vault: 'आरोग्य वॉल्ट',
    doctor: 'डॉक्टर',
    emergency: 'आपत्कालीन SOS',
    settings: 'सेटिंग्ज',
    speakSymptoms: 'माइक दाबा आणि तुमची लक्षणे सांगा',
    listening: 'ऐकत आहे...',
    processing: 'तुमची लक्षणे विश्लेषित करत आहे...',
    typeSymptoms: 'किंवा तुमची लक्षणे येथे लिहा...',
    analyze: 'लक्षणे विश्लेषित करा',
    results: 'AI विश्लेषण परिणाम',
    urgency: 'तात्काळता स्तर',
    low: 'कमी',
    medium: 'मध्यम',
    emergencyLevel: '🚨 आपत्कालीन',
    possibleConditions: 'संभाव्य स्थिती',
    nextSteps: 'शिफारस केलेली पुढील पावले',
    homeRemedies: 'घरगुती उपचार',
    doctorRecommendation: 'डॉक्टरांची शिफारस',
    explain: 'सोप्या शब्दांत सांगा',
    patients: 'रुग्ण',
    addPatient: 'रुग्ण जोडा',
    qrCode: 'QR कोड',
    syncStatus: 'सिंक स्थिती',
    synced: 'सिंक झाले',
    pending: 'प्रलंबित',
    offline: 'ऑफलाइन',
    name: 'नाव',
    age: 'वय',
    gender: 'लिंग',
    phone: 'फोन',
    village: 'गाव',
    bloodGroup: 'ब्लड ग्रुप',
    allergies: 'अॅलर्जी',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    male: 'पुरुष',
    female: 'स्त्री',
    other: 'इतर',
    quickActions: 'तुम्ही काय करू इच्छिता?',
    emergencyBtn: '🆘 SOS आपत्कालीन',
    emergencyDesc: 'तात्काळ मदत मिळवण्यासाठी एक टॅप',
    connectDoctor: 'डॉक्टरांशी बोला',
    connectDesc: 'आरोग्य सेवा प्रदात्याशी बोला',
    checkSymptoms: 'लक्षणे तपासा',
    checkDesc: 'सांगा तुम्ही कसे वाटत आहात',
    healthVault: 'आरोग्य वॉल्ट',
    healthVaultDesc: 'तुमचे वैद्यकीय रेकॉर्ड',
    networkStatus: 'नेटवर्क स्थिती',
    consultationMode: 'सल्लामसलत मोड',
    video: 'व्हिडिओ कॉल',
    audio: 'ऑडिओ कॉल',
    chat: 'चॅट',
    doctorDashboard: 'डॉक्टर डॅशबोर्ड',
    patientSummary: 'रुग्ण सारांश',
    prescriptions: 'प्रिस्क्रिप्शन',
    generatePrescription: 'प्रिस्क्रिप्शन तयार करा',
    todayPatients: 'आजचे रुग्ण',
    sosActivated: 'SOS सक्रिय',
    sosHelp: 'तुमचे स्थान आणि आरोग्य डेटा पाठवत आहे...',
    sosGuidance: 'आपत्कालीन मार्गदर्शन',
    sosStep1: '1. शांत राहा आणि बसा',
    sosStep2: '2. घट्ट कपडे सैले करा',
    sosStep3: '3. रोगी वाहनासाठी 108 वर कॉल करा',
    sosStep4: '4. कुटुंबातील सदस्याला कळवा',
    sosStep5: '5. तुमची औषधे जवळ ठेवा',
    cancelSOS: 'SOS रद्द करा',
    language: 'भाषा',
    english: 'English',
    hindi: 'हिन्दी',
    marathi: 'मराठी',
    fontSize: 'टेक्स्ट आकार',
    offlineToggle: 'ऑफलाइन मोड सिम्युलेट करा',
    about: 'Vaid बद्दल',
    aboutDesc: 'ग्रामीण आणि कमी कनेक्टिव्हिटी असलेल्या भागांसाठी टेलीमेडिसिन प्लॅटफॉर्म. स्थानिक भाषांमध्ये AI-चालित लक्षण विश्लेषणासह ऑफलाइन काम करते.',
    records: 'आरोग्य रेकॉर्ड',
    viewRecords: 'रेकॉर्ड पहा',
    diagnosis: 'निदान',
    prescription: 'प्रिस्क्रिप्शन',
    date: 'तारीख',
    notes: 'नोट्स',
    noRecords: 'अद्याप रेकॉर्ड नाहीत',
    back: 'मागे',
    search: 'रुग्ण शोधा...',
    medicine: 'औषध',
    dosage: 'डोस',
    frequency: 'वारंवारता',
    duration: 'कालावधी',
    advice: 'सल्ला',
    followUp: 'फॉलो अप',
    newPrescription: 'नवीन प्रिस्क्रिप्शन',
    patientDetails: 'रुग्ण तपशील',
    deletePatient: 'रुग्ण हटवा',
    confirm: 'पुष्टी करा',
    edit: 'संपादन',
    confidence: 'विश्वास',
    welcome: 'Vaid मध्ये आपले स्वागत आहे',
    welcomeSub: 'तुमचा आरोग्य साथीदार जो इंटरनेटशिवायही काम करतो',
    getStarted: 'सुरू करूया',
    greeting: 'नमस्कार! मी तुमचा आरोग्य सहाय्यक आहे.',
    greetingSub: 'आज मी तुम्हाला कशी मदत करू शकतो?',
  },
};

// State types
interface AppState {
  currentPage: 'home' | 'symptoms' | 'vault' | 'doctor' | 'emergency' | 'settings';
  settings: AppSettings;
  connectivity: ConnectivityState;
  patients: Patient[];
  isListening: boolean;
  showWelcome: boolean;
}

type Action =
  | { type: 'SET_PAGE'; page: AppState['currentPage'] }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'UPDATE_CONNECTIVITY'; connectivity: ConnectivityState }
  | { type: 'SET_PATIENTS'; patients: Patient[] }
  | { type: 'SET_LISTENING'; isListening: boolean }
  | { type: 'DISMISS_WELCOME' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.settings };
      saveSettings(newSettings);
      return { ...state, settings: newSettings };
    case 'UPDATE_CONNECTIVITY':
      return { ...state, connectivity: action.connectivity };
    case 'SET_PATIENTS':
      return { ...state, patients: action.patients };
    case 'SET_LISTENING':
      return { ...state, isListening: action.isListening };
    case 'DISMISS_WELCOME':
      return { ...state, showWelcome: false };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  t: (key: string) => string;
  refreshPatients: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initialSettings = getSettings();
  const initialConnectivity = simulateConnectivity(initialSettings.offlineMode);

  const [state, dispatch] = useReducer(appReducer, {
    currentPage: 'home',
    settings: initialSettings,
    connectivity: initialConnectivity,
    patients: getPatients(),
    isListening: false,
    showWelcome: true,
  });

  const connectivityInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update connectivity periodically
  useEffect(() => {
    const updateConnectivity = () => {
      const conn = simulateConnectivity(state.settings.offlineMode);
      dispatch({ type: 'UPDATE_CONNECTIVITY', connectivity: conn });
    };

    updateConnectivity();
    connectivityInterval.current = setInterval(updateConnectivity, 8000);

    return () => {
      if (connectivityInterval.current) {
        clearInterval(connectivityInterval.current);
      }
    };
  }, [state.settings.offlineMode]);

  const t = useCallback((key: string): string => {
    return translations[state.settings.language]?.[key] || translations.en[key] || key;
  }, [state.settings.language]);

  const refreshPatients = useCallback(() => {
    dispatch({ type: 'SET_PATIENTS', patients: getPatients() });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, t, refreshPatients }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
