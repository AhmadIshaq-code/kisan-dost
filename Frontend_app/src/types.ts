export type NavTab = 
  | 'dashboard'
  | 'ai-assistant'
  | 'crop-advisor'
  | 'pest-doctor'
  | 'weather'
  | 'market-finance'
  | 'government-support'
  | 'farmer-profile';

export interface FarmerProfile {
  name: string;
  location: string;
  farmSizeAcres: number;
  soilType: string;
  season: string;
  waterAvailability: string;
}

export interface AgentStep {
  label: string;
  status: 'completed' | 'active' | 'pending';
  detail?: string;
  isDivider?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'ai';
  text: string;
  timestamp: string;
  agentToolTag?: string; // e.g. "Finance Agent → Fertilizer Calculator"
  recommendedCropCard?: {
    cropName: string;
    expectedYield: string;
    estimatedProfit: string;
    waterNeed: string;
  };
  agentTrace?: {
    triage: string;
    specialist: string;
    tool: string;
  };
  agentTrail?: string[];
  isStreaming?: boolean;
}
