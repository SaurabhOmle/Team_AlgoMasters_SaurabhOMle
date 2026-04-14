import type { DiagnosisResult } from './storage';

// Symptom keyword mapping for rule-based diagnosis
interface SymptomRule {
  keywords: string[];
  condition: string;
  urgency: 'low' | 'medium' | 'emergency';
  explanation: string;
  simpleExplanation: string;
  nextSteps: string[];
  homeRemedies: string[];
  doctorRecommendation: string;
}

const symptomRules: SymptomRule[] = [
  {
    keywords: ['chest pain', 'breathing difficulty', 'shortness of breath', 'sweating', 'heart', 'dil', 'chhati', 'saans'],
    condition: 'Cardiac Issue / Angina',
    urgency: 'emergency',
    explanation: 'Chest pain with breathing difficulty may indicate reduced blood flow to the heart (angina) or a heart attack.',
    simpleExplanation: 'Your heart is not getting enough blood. This is very serious and you need to see a doctor immediately.',
    nextSteps: [
      'Call emergency services immediately (108)',
      'Take prescribed heart medicine if available',
      'Sit in a comfortable position',
      'Do not walk or exert yourself',
      'Loosen tight clothing',
    ],
    homeRemedies: ['Keep calm and breathe slowly', 'Chew an aspirin if not allergic', 'Wait for medical help'],
    doctorRecommendation: 'EMERGENCY: Visit nearest hospital immediately. Do not delay.',
  },
  {
    keywords: ['fever', 'temperature', 'buchhar', 'bukhar', 'tap', 'jvar'],
    condition: 'Fever / Viral Infection',
    urgency: 'low',
    explanation: 'Elevated body temperature indicates an infection, commonly viral. Most fevers resolve within 3-5 days.',
    simpleExplanation: 'You have a fever. This usually means your body is fighting an infection. It will likely get better in a few days.',
    nextSteps: [
      'Rest at home',
      'Drink plenty of warm fluids',
      'Monitor temperature every 4 hours',
      'Consult doctor if fever lasts more than 3 days',
    ],
    homeRemedies: [
      'Drink tulsi (holy basil) tea',
      'Apply cold compress on forehead',
      'Drink warm water with honey and ginger',
      'Take complete rest',
    ],
    doctorRecommendation: 'Visit doctor if fever exceeds 103°F or lasts more than 3 days.',
  },
  {
    keywords: ['headache', 'sir dard', 'sar', 'migraine', 'head pain', 'dizziness', 'chakkar'],
    condition: 'Headache / Migraine / Hypertension',
    urgency: 'medium',
    explanation: 'Headaches can be caused by stress, migraines, high blood pressure, or other factors. Persistent or severe headaches need evaluation.',
    simpleExplanation: 'You have a headache. This can be from stress, tension, or high blood pressure. If it is very severe, you should see a doctor.',
    nextSteps: [
      'Rest in a quiet, dark room',
      'Check blood pressure if possible',
      'Stay hydrated',
      'Take paracetamol for pain relief',
      'Consult doctor if headache persists',
    ],
    homeRemedies: [
      'Apply cold or warm compress on forehead',
      'Drink ginger tea',
      'Massage temples gently',
      'Practice deep breathing',
    ],
    doctorRecommendation: 'Consult doctor if headache is severe, persistent, or accompanied by vision changes.',
  },
  {
    keywords: ['cough', 'khansi', 'cold', 'sardi', 'sore throat', 'gala', 'runny nose', 'flu', 'zukam'],
    condition: 'Upper Respiratory Infection / Cold',
    urgency: 'low',
    explanation: 'Cough and cold symptoms are usually caused by viral infections of the upper respiratory tract.',
    simpleExplanation: 'You have a common cold or cough. This usually gets better on its own in about a week.',
    nextSteps: [
      'Rest and stay warm',
      'Drink warm fluids',
      'Use steam inhalation for congestion',
      'Consult doctor if cough lasts more than 2 weeks',
    ],
    homeRemedies: [
      'Drink warm turmeric milk (haldi doodh)',
      'Steam inhalation with eucalyptus',
      'Honey and ginger for cough',
      'Salt water gargle for sore throat',
    ],
    doctorRecommendation: 'See doctor if you have high fever, breathing difficulty, or coughing blood.',
  },
  {
    keywords: ['stomach pain', 'pet dard', 'stomach', 'nausea', 'jala', 'vomiting', 'ulti', 'diarrhea', 'dast', 'acidity', 'gas'],
    condition: 'Gastrointestinal Issue',
    urgency: 'low',
    explanation: 'Stomach pain can be caused by indigestion, gas, food poisoning, or gastrointestinal infections.',
    simpleExplanation: 'You have a stomach problem. This is usually from eating something wrong or a minor infection.',
    nextSteps: [
      'Drink plenty of water (ORS solution)',
      'Eat light, easily digestible food',
      'Avoid spicy and oily food',
      'Rest',
    ],
    homeRemedies: [
      'Drink ajwain (carom seeds) water',
      'Eat plain curd rice',
      'Drink warm lemon water',
      'Apply warm compress on stomach',
    ],
    doctorRecommendation: 'Visit doctor if pain is severe, there is blood in stool, or symptoms persist more than 2 days.',
  },
  {
    keywords: ['diabetes', 'sugar', 'sharbat', 'thirst', 'bhuk', 'weight loss', 'wound not healing'],
    condition: 'Diabetes Related Symptoms',
    urgency: 'medium',
    explanation: 'Increased thirst, hunger, and weight loss can indicate uncontrolled diabetes.',
    simpleExplanation: 'Your blood sugar might be high. This means your body is having trouble using the energy from food.',
    nextSteps: [
      'Check blood sugar levels',
      'Take prescribed diabetes medicine regularly',
      'Follow a balanced diet',
      'Exercise regularly',
      'Get regular check-ups',
    ],
    homeRemedies: [
      'Drink bitter gourd (karela) juice',
      'Eat fenugreek (methi) seeds soaked overnight',
      'Regular walking exercise',
      'Monitor sugar intake',
    ],
    doctorRecommendation: 'Consult doctor for blood sugar management. Regular monitoring is essential.',
  },
  {
    keywords: ['joint pain', 'ghutna', 'arthritis', 'back pain', 'kamar dard', 'knee', 'moodi', 'swelling', 'sujan'],
    condition: 'Musculoskeletal / Joint Issue',
    urgency: 'low',
    explanation: 'Joint or body pain can be from arthritis, overexertion, or age-related wear and tear.',
    simpleExplanation: 'You have body or joint pain. This is common and can be from physical work or age.',
    nextSteps: [
      'Rest the affected area',
      'Apply warm or cold compress',
      'Gentle stretching exercises',
      'Take pain relief if needed',
    ],
    homeRemedies: [
      'Apply warm mustard oil massage',
      'Turmeric paste on affected area',
      'Gentle exercise and walking',
      'Epsom salt warm water soak',
    ],
    doctorRecommendation: 'Visit doctor if pain is severe, joints are swollen, or movement is limited.',
  },
  {
    keywords: ['skin', 'chamdi', 'rash', 'itching', 'khujli', 'wound', 'ghaa', 'infection', 'daagdhar'],
    condition: 'Skin Condition',
    urgency: 'low',
    explanation: 'Skin issues can range from allergies and infections to chronic conditions.',
    simpleExplanation: 'You have a skin problem. This could be an allergy, infection, or irritation.',
    nextSteps: [
      'Keep the area clean and dry',
      'Avoid scratching',
      'Apply prescribed cream/ointment',
      'Note any new products or foods that may have caused it',
    ],
    homeRemedies: [
      'Apply aloe vera gel',
      'Neem leaf paste for itching',
      'Coconut oil for dry skin',
      'Keep area clean with mild soap',
    ],
    doctorRecommendation: 'See doctor if rash spreads, has pus, or does not improve in a week.',
  },
  {
    keywords: ['eye', 'aankh', 'vision', 'blurred', 'red eye', 'watering', 'ansu'],
    condition: 'Eye Issue',
    urgency: 'medium',
    explanation: 'Eye problems can range from infections (conjunctivitis) to vision changes needing evaluation.',
    simpleExplanation: 'You have an eye problem. This could be an infection or you may need glasses.',
    nextSteps: [
      'Do not rub eyes',
      'Clean with clean water',
      'Wear sunglasses if sensitive to light',
      'Consult eye specialist',
    ],
    homeRemedies: [
      'Splash clean cold water on eyes',
      'Rose water drops',
      'Cucumber slices on closed eyes',
      'Rest eyes from screens',
    ],
    doctorRecommendation: 'Visit eye doctor immediately if vision suddenly decreases or eye is painful.',
  },
  {
    keywords: ['anxiety', 'tension', 'depression', 'sleep', 'neend', 'nervous', 'darr', 'fear'],
    condition: 'Mental Health Concern',
    urgency: 'medium',
    explanation: 'Mental health symptoms like anxiety, sleep issues, and stress need attention and support.',
    simpleExplanation: 'You seem to be going through a difficult time emotionally. This is common and help is available.',
    nextSteps: [
      'Talk to someone you trust',
      'Practice deep breathing exercises',
      'Maintain regular sleep schedule',
      'Consult a counselor or doctor',
    ],
    homeRemedies: [
      'Practice 5 minutes of deep breathing',
      'Drink warm milk before sleeping',
      'Regular walk in fresh air',
      'Listen to calming music',
    ],
    doctorRecommendation: 'Please consult a doctor or counselor. Mental health is as important as physical health.',
  },
];

function analyzeSymptoms(input: string): DiagnosisResult {
  const normalizedInput = input.toLowerCase();
  const matchedRules: { rule: SymptomRule; matchCount: number }[] = [];

  for (const rule of symptomRules) {
    let matchCount = 0;
    for (const keyword of rule.keywords) {
      if (normalizedInput.includes(keyword)) {
        matchCount++;
      }
    }
    if (matchCount > 0) {
      matchedRules.push({ rule, matchCount });
    }
  }

  // Sort by match count
  matchedRules.sort((a, b) => b.matchCount - a.matchCount);

  // If no matches found, return general assessment
  if (matchedRules.length === 0) {
    return {
      symptoms: [input],
      possibleConditions: [
        {
          name: 'General symptoms - Needs evaluation',
          confidence: 0.3,
          explanation: 'Based on the symptoms described, a general evaluation is recommended. More information may be needed for a specific diagnosis.',
          simpleExplanation: 'I could not identify a specific condition from your symptoms. A doctor should examine you to understand better.',
        },
      ],
      urgency: 'low',
      nextSteps: [
        'Monitor your symptoms',
        'Rest and stay hydrated',
        'Consult a doctor if symptoms worsen',
        'Use the Health Vault to track your symptoms',
      ],
      homeRemedies: [
        'Drink plenty of water',
        'Get adequate rest',
        'Eat nutritious food',
        'Keep a record of your symptoms',
      ],
      simpleExplanation: 'Your symptoms need a closer look by a doctor. In the meantime, rest and stay hydrated.',
      doctorRecommendation: 'Please consult a doctor for proper evaluation and diagnosis.',
    };
  }

  const topRule = matchedRules[0].rule;
  const conditions = matchedRules.slice(0, 3).map(({ rule, matchCount }) => ({
    name: rule.condition,
    confidence: Math.min(0.95, 0.4 + matchCount * 0.15),
    explanation: rule.explanation,
    simpleExplanation: rule.simpleExplanation,
  }));

  // Determine urgency (take the highest)
  const urgencyLevels: Record<string, number> = { low: 0, medium: 1, emergency: 2 };
  const highestUrgency = matchedRules.reduce((max, { rule }) => {
    return urgencyLevels[rule.urgency] > urgencyLevels[max] ? rule.urgency : max;
  }, 'low' as 'low' | 'medium' | 'emergency');

  // Merge all next steps and remedies
  const allNextSteps = [...new Set(matchedRules.flatMap(r => r.rule.nextSteps))];
  const allHomeRemedies = [...new Set(matchedRules.flatMap(r => r.rule.homeRemedies))];

  return {
    symptoms: topRule.keywords.filter(k => normalizedInput.includes(k)),
    possibleConditions: conditions,
    urgency: highestUrgency,
    nextSteps: allNextSteps.slice(0, 5),
    homeRemedies: allHomeRemedies.slice(0, 5),
    simpleExplanation: topRule.simpleExplanation,
    doctorRecommendation: topRule.doctorRecommendation,
  };
}

// Simulate AI processing delay
export async function getDiagnosis(symptoms: string): Promise<DiagnosisResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  return analyzeSymptoms(symptoms);
}

// Simple medical term explainer
export function explainMedicalTerm(term: string): string {
  const terms: Record<string, string> = {
    'hypertension': 'High blood pressure — when the force of blood against your artery walls is too high.',
    'diabetes': 'A condition where your body cannot properly use sugar (glucose) from food for energy.',
    'angina': 'Chest pain that happens when your heart does not get enough oxygen-rich blood.',
    'infection': 'When harmful germs enter your body and make you sick.',
    'prescription': 'A doctor\'s written order for medicine.',
    'diagnosis': 'The doctor\'s opinion about what illness you have.',
    'antibiotic': 'Medicine that fights infections caused by bacteria.',
    'blood pressure': 'The force of blood pushing against the walls of your blood vessels.',
    'viral': 'An illness caused by a virus — like cold or flu.',
    'bacteria': 'Tiny living things that can cause infections in your body.',
    'virus': 'A very tiny germ that causes illnesses like cold, flu, and COVID.',
    'migraine': 'A very bad headache, usually on one side of the head, that may cause nausea.',
    'arthritis': 'A disease that causes pain and swelling in joints like knees and fingers.',
    'allergy': 'When your body reacts badly to something that is normally harmless.',
    'inflammation': 'Redness, swelling, and pain in a part of your body.',
    'cholesterol': 'A fatty substance in your blood — too much can block your blood vessels.',
    'anemia': 'When your blood does not have enough healthy red cells.',
    'dose': 'The amount of medicine you should take at one time.',
    'symptom': 'A sign that shows you might be sick — like fever, pain, or cough.',
    'chronic': 'An illness that lasts a long time or keeps coming back.',
    'acute': 'An illness that comes on suddenly and may be severe.',
    'condtion': 'A health problem or illness.',
  };

  const normalized = term.toLowerCase().trim();
  for (const [key, value] of Object.entries(terms)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  return `This is a medical term. Please ask your doctor to explain "${term}" in simple words during your visit.`;
}
