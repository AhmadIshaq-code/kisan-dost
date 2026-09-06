import { FarmerProfile, ChatMessage } from '../types';

export const INITIAL_FARMER_PROFILE: FarmerProfile = {
  name: 'Ahmad',
  location: 'Faisalabad, Punjab',
  farmSizeAcres: 5,
  soilType: 'Loamy',
  season: 'Rabi',
  waterAvailability: 'Limited',
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'farmer',
    text: 'Mujhe Rabi mein crop recommend karo',
    timestamp: '10:14 AM',
  },
  {
    id: 'msg-2',
    sender: 'ai',
    text: 'Rabi season ke liye aapke 5 acres, loamy soil aur limited water ko dekhte hue Chickpea ek suitable option hai. Wheat bhi ek option ho sakti hai.',
    timestamp: '10:14 AM',
    agentToolTag: 'Agronomy Agent → Crop Advisor Tool',
    recommendedCropCard: {
      cropName: 'Chickpea',
      expectedYield: '20 maund/acre',
      estimatedProfit: 'PKR 80,000/acre',
      waterNeed: 'Low',
    },
    agentTrace: {
      triage: 'Triage Agent',
      specialist: 'Agronomy Agent',
      tool: 'Crop Advisor Tool',
    },
  },
  {
    id: 'msg-3',
    sender: 'farmer',
    text: 'Is crop ko kitna fertilizer chahiye?',
    timestamp: '10:16 AM',
  },
  {
    id: 'msg-4',
    sender: 'ai',
    text: 'Aapke 5 acres ke liye approximate fertilizer requirement:\n\nDAP: 6.52 bags\nUrea: 1.80 bags',
    timestamp: '10:16 AM',
    agentToolTag: 'Finance Agent → Fertilizer Calculator',
    agentTrace: {
      triage: 'Triage Agent',
      specialist: 'Finance Agent',
      tool: 'Fertilizer Calculator',
    },
  },
];

export interface QuickPrompt {
  id: string;
  label: string;
  promptText: string;
  response: string;
  agentToolTag: string;
  specialist: string;
  tool: string;
  cropCard?: {
    cropName: string;
    expectedYield: string;
    estimatedProfit: string;
    waterNeed: string;
  };
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'qp-crop',
    label: '🌱 Recommend a crop',
    promptText: 'Mujhe mere khet ke liye behtareen Rabi crop recommend karein',
    response: 'Aapke 5 acres loamy soil aur limited water supply ke mutabiq Chickpea (Chana) sabse zyada munafa-bakhsh aur kam paani mangne wali fasal hai.',
    agentToolTag: 'Agronomy Agent → Crop Advisor Tool',
    specialist: 'Agronomy Agent',
    tool: 'Crop Advisor Tool',
    cropCard: {
      cropName: 'Chickpea',
      expectedYield: '20 maund/acre',
      estimatedProfit: 'PKR 80,000/acre',
      waterNeed: 'Low',
    },
  },
  {
    id: 'qp-fert',
    label: '🧪 Calculate fertilizer',
    promptText: 'Is crop ko kitna fertilizer chahiye?',
    response: 'Aapke 5 acres ke liye approximate fertilizer requirement:\n\nDAP: 6.52 bags\nUrea: 1.80 bags\n\n(Follow product label for application schedule)',
    agentToolTag: 'Finance Agent → Fertilizer Calculator',
    specialist: 'Finance Agent',
    tool: 'Fertilizer Calculator',
  },
  {
    id: 'qp-weather',
    label: '🌦️ Check weather',
    promptText: 'Faisalabad mein aglay 3 din mausam kaisa rahay ga?',
    response: 'Faisalabad Weather Summary:\nCurrent: 27°C, 85% Humidity, Rain probability: 51%.\nAgley do din mein halki barish ka imkan hai. Irrigation plan karte waqt barish ka khayal rakhein.',
    agentToolTag: 'Weather Agent → Meteorological Forecaster',
    specialist: 'Weather Agent',
    tool: 'Meteorological Forecaster',
  },
  {
    id: 'qp-mandi',
    label: '💰 Check mandi price',
    promptText: 'Faisalabad mandi mein taza tareen rates kya hain?',
    response: 'Faisalabad Mandi Rates (Demo Dataset):\n• Wheat: PKR 3,200 / maund\n• Chickpea: PKR 7,500 / maund\n• Maize: PKR 2,800 / maund',
    agentToolTag: 'Market Agent → Mandi Price Tool',
    specialist: 'Market Agent',
    tool: 'Mandi Price Tool',
  },
  {
    id: 'qp-disease',
    label: '🐛 Diagnose crop disease',
    promptText: 'Mere chickpea plants par keetay hain aur patte damage ho rahay hain',
    response: 'Diagnosed Issue: Pod Borer (Possible identification).\nRecommendation: Use an officially registered treatment according to the current product label and local agricultural guidance. Unverified dosage na lagayein.',
    agentToolTag: 'Pathology Agent → Pest Diagnosis Tool',
    specialist: 'Pathology Agent',
    tool: 'Pest Diagnosis Tool',
  },
  {
    id: 'qp-subsidy',
    label: '🏛️ Find subsidy',
    promptText: 'Punjab hukumat ki fertilizer subsidy ki tafseelat kya hain?',
    response: 'Punjab Government Subsidy Information:\nScheme: Subsidized Fertilizer Support\nEligibility: Registered farmers on Punjab Kisan Card portal.\nBenefit: Approved subsidy on DAP/Urea bags at verified dealer networks.\n\n⚠️ Demo information — verify with local agriculture office before applying.',
    agentToolTag: 'Policy Agent → Government Subsidy Registry',
    specialist: 'Policy Agent',
    tool: 'Government Subsidy Registry',
  },
];
