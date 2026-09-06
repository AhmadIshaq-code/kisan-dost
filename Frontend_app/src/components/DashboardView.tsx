import React from 'react';
import { 
  Sprout, 
  Bug, 
  CloudSun, 
  Coins, 
  FlaskConical, 
  Landmark, 
  MapPin, 
  Layers, 
  Droplets, 
  Calendar,
  ArrowRight,
  Bot
} from 'lucide-react';
import { FarmerProfile, NavTab } from '../types';

interface DashboardViewProps {
  farmer: FarmerProfile;
  onNavigate: (tab: NavTab) => void;
  onSelectActionPrompt: (promptText: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farmer,
  onNavigate,
  onSelectActionPrompt,
}) => {
  const actionCards = [
    {
      id: 'action-crop-rec',
      title: 'Crop Recommendation',
      emoji: '🌱',
      description: 'Find the best crop for your land',
      targetTab: 'ai-assistant' as NavTab,
      promptText: 'Mujhe Rabi mein crop recommend karo',
    },
    {
      id: 'action-pest-disease',
      title: 'Pest & Disease',
      emoji: '🐛',
      description: 'Identify crop problems',
      targetTab: 'pest-doctor' as NavTab,
      promptText: 'Mere plants par keetay hain, disease diagnose karein',
    },
    {
      id: 'action-weather',
      title: 'Weather',
      emoji: '🌦️',
      description: 'Check weather and forecast',
      targetTab: 'weather' as NavTab,
      promptText: 'Faisalabad ka mausam aur 3-day forecast batayein',
    },
    {
      id: 'action-market-prices',
      title: 'Market Prices',
      emoji: '💰',
      description: 'Check mandi prices',
      targetTab: 'market-finance' as NavTab,
      promptText: 'Faisalabad mandi mein taza tareen rates kya hain?',
    },
    {
      id: 'action-fertilizer',
      title: 'Fertilizer',
      emoji: '🧪',
      description: 'Calculate fertilizer needs',
      targetTab: 'ai-assistant' as NavTab,
      promptText: 'Is crop ko kitna fertilizer chahiye?',
    },
    {
      id: 'action-gov-support',
      title: 'Government Support',
      emoji: '🏛️',
      description: 'Find farmer subsidies and schemes',
      targetTab: 'government-support' as NavTab,
      promptText: 'Punjab hukumat ki fertilizer subsidy ki tafseelat kya hain?',
    },
  ];

  return (
    <div id="dashboard-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Top Greeting Header */}
      <div id="dashboard-header" className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] tracking-tight">
              Assalam-o-Alaikum, {farmer.name} 👋
            </h1>
            <p className="text-base text-[#5C715C] mt-1">
              How can Kisan Dost help you today?
            </p>
          </div>

          <button
            id="start-ai-chat-btn"
            onClick={() => onNavigate('ai-assistant')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2D6A4F] hover:bg-[#245840] text-white font-medium text-sm rounded-xl transition-colors shadow-xs shadow-[#2D6A4F]/20 w-full sm:w-auto cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Open AI Assistant</span>
          </button>
        </div>

        {/* Small Farmer Profile Summary Badges */}
        <div id="farmer-profile-summary" className="mt-6 pt-5 border-t border-[#D8E4D8]/80 flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F4F0] text-[#2D6A4F] border border-[#D8E4D8] text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>📍 {farmer.location}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F4F0] text-[#2D6A4F] border border-[#D8E4D8] text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>🌾 {farmer.farmSizeAcres} Acres</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F4F0] text-[#2D6A4F] border border-[#D8E4D8] text-xs font-semibold">
            <span>🪴 {farmer.soilType} Soil</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F4F0] text-[#2D6A4F] border border-[#D8E4D8] text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>💧 {farmer.waterAvailability} Water</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F4F0] text-[#2D6A4F] border border-[#D8E4D8] text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>🌱 {farmer.season} Season</span>
          </div>
        </div>
      </div>

      {/* Action Cards Section */}
      <div id="action-cards-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1B4332]">
            What do you need help with?
          </h2>
          <span className="text-xs text-[#5C715C] font-medium">
            Click any topic to get instant assistance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionCards.map((card) => (
            <div
              key={card.id}
              id={card.id}
              onClick={() => {
                if (card.targetTab === 'ai-assistant') {
                  onSelectActionPrompt(card.promptText);
                } else {
                  onNavigate(card.targetTab);
                }
              }}
              className="bg-white p-5 rounded-2xl border border-[#D8E4D8] hover:border-[#2D6A4F]/60 hover:shadow-md cursor-pointer transition-all duration-150 group flex flex-col justify-between text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F0F4F0] border border-[#D8E4D8]/60 flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform">
                  {card.emoji}
                </div>
                <h3 className="font-semibold text-[#1B4332] text-base group-hover:text-[#2D6A4F] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#5C715C] mt-1 leading-relaxed">
                  "{card.description}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAF2EA] flex items-center justify-between text-xs font-semibold text-[#2D6A4F]">
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Multi-Agent Showcase Banner */}
      <div 
        id="multi-agent-architecture-card"
        className="bg-[#1B4332] text-white rounded-2xl p-5 border border-[#163627] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A3D9A5] animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#A3D9A5]">
              Agentic AI Architecture
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white">
            Farmer → Triage Agent → Specialist Agents (Agronomy, Finance, Weather) → Tools
          </h4>
          <p className="text-xs text-[#D8E4D8] leading-relaxed">
            Kisan Dost accurately routes your farming queries to domain specialists using OpenAI Agents framework.
          </p>
        </div>

        <button
          id="test-agentic-flow-btn"
          onClick={() => onNavigate('ai-assistant')}
          className="whitespace-nowrap px-4 py-2 bg-[#2D6A4F] hover:bg-[#397d5f] text-white border border-[#3f8867] font-medium text-xs rounded-xl transition-colors self-start md:self-auto cursor-pointer"
        >
          View Live Demo Flow →
        </button>
      </div>
    </div>
  );
};
