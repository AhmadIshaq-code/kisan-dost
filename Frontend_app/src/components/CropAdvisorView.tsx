import React from 'react';
import { Sprout, Droplets, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { FarmerProfile, NavTab } from '../types';

interface CropAdvisorViewProps {
  farmer: FarmerProfile;
  onAskKisanDost: (prompt: string) => void;
}

export const CropAdvisorView: React.FC<CropAdvisorViewProps> = ({
  farmer,
  onAskKisanDost,
}) => {
  const recommendations = [
    {
      id: 'rec-chickpea',
      name: 'Chickpea (Chana)',
      badge: 'Best Fit for Limited Water',
      isTop: true,
      soilMatch: 'High (Loamy)',
      waterReq: 'Low (1-2 irrigations)',
      yield: '20 maund/acre',
      profit: 'PKR 80,000 / acre',
      summary: 'Thrives in loamy soils with minimal water requirements. Highly profitable given recent mandi demand in Faisalabad.',
    },
    {
      id: 'rec-wheat',
      name: 'Wheat (Gandum)',
      badge: 'Staple Option',
      isTop: false,
      soilMatch: 'Excellent',
      waterReq: 'Medium (3-4 irrigations)',
      yield: '38 maund/acre',
      profit: 'PKR 65,000 / acre',
      summary: 'Reliable government minimum support price, but requires regular watering during tillering and flowering stages.',
    },
    {
      id: 'rec-mustard',
      name: 'Canola / Mustard (Raya)',
      badge: 'Alternative Oilseed',
      isTop: false,
      soilMatch: 'Moderate',
      waterReq: 'Low-Medium',
      yield: '18 maund/acre',
      profit: 'PKR 55,000 / acre',
      summary: 'Good rotation crop that helps break pest cycles and matures early before intense summer heat.',
    },
  ];

  return (
    <div id="crop-advisor-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#EAF2EA] border border-[#D8E4D8] flex items-center justify-center text-xl">
            🌱
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332]">
              Crop Advisor
            </h1>
            <p className="text-xs sm:text-sm text-[#5C715C]">
              Personalized crop suitability based on your land & water conditions
            </p>
          </div>
        </div>

        {/* Farmer Context Summary */}
        <div className="mt-4 p-3 rounded-xl bg-[#F0F4F0] border border-[#D8E4D8] flex flex-wrap items-center gap-4 text-xs text-[#1B4332]">
          <span><strong>Land:</strong> {farmer.farmSizeAcres} Acres</span>
          <span><strong>Location:</strong> {farmer.location}</span>
          <span><strong>Soil:</strong> {farmer.soilType}</span>
          <span><strong>Water:</strong> {farmer.waterAvailability}</span>
          <span><strong>Active Season:</strong> {farmer.season}</span>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {recommendations.map((crop) => (
          <div
            key={crop.id}
            id={crop.id}
            className={`bg-white rounded-2xl p-5 border transition-all ${
              crop.isTop
                ? 'border-[#2D6A4F] ring-1 ring-[#2D6A4F]/30 shadow-xs'
                : 'border-[#D8E4D8]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-[#1B4332]">{crop.name}</h3>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  crop.isTop
                    ? 'bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]'
                    : 'bg-[#F4F7F4] text-[#5C715C] border border-[#D8E4D8]'
                }`}>
                  {crop.badge}
                </span>
              </div>

              <button
                id={`ask-about-${crop.id}`}
                onClick={() => onAskKisanDost(`Mujhe ${crop.name} ke baare mein mazeed detail aur seed selection batayein`)}
                className="text-xs font-semibold text-[#2D6A4F] hover:text-[#1B4332] inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Ask Kisan Dost</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5C715C] leading-relaxed mb-4">
              {crop.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#D8E4D8] text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[10px] text-[#5C715C] block font-medium">Soil Match</span>
                <span className="font-semibold text-[#1B4332]">{crop.soilMatch}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[10px] text-[#5C715C] block font-medium">Water Need</span>
                <span className="font-semibold text-[#1B4332]">{crop.waterReq}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[10px] text-[#5C715C] block font-medium">Expected Yield</span>
                <span className="font-semibold text-[#1B4332]">{crop.yield}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF2EA] border border-[#D8E4D8]">
                <span className="text-[10px] text-[#2D6A4F] block font-medium">Est. Profit</span>
                <span className="font-bold text-[#2D6A4F]">{crop.profit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-[#8DA08D]">
        Demo Recommendation Dataset • Calibrated for Punjab Agro-ecological Zone
      </div>
    </div>
  );
};
