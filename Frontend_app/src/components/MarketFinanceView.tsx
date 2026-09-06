import React from 'react';
import { Coins, TrendingUp, DollarSign, ArrowUpRight, Scale } from 'lucide-react';

export const MarketFinanceView: React.FC = () => {
  const mandiRates = [
    { crop: 'Wheat (Gandum)', price: 'PKR 3,200', unit: 'per maund (40 kg)', trend: '+1.2%' },
    { crop: 'Chickpea (Chana)', price: 'PKR 7,500', unit: 'per maund (40 kg)', trend: '+3.5%' },
    { crop: 'Maize (Makai)', price: 'PKR 2,800', unit: 'per maund (40 kg)', trend: '-0.5%' },
  ];

  return (
    <div id="market-finance-container" className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF2EA] border border-[#D8E4D8] flex items-center justify-center text-xl">
            💰
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332]">
              Market & Finance
            </h1>
            <p className="text-xs sm:text-sm text-[#5C715C]">
              Current mandi rates and crop profitability breakdowns
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Mandi Prices */}
      <div id="mandi-prices-section" className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8E4D8] pb-3">
          <div>
            <h3 className="font-bold text-[#1B4332] text-base">
              Mandi Prices
            </h3>
            <p className="text-xs text-[#5C715C]">
              Faisalabad Grain Mandi
            </p>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]">
            Demo Dataset
          </span>
        </div>

        <div className="divide-y divide-[#EAF2EA]">
          {mandiRates.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#1B4332] text-sm block">
                  {item.crop}
                </span>
                <span className="text-[11px] text-[#5C715C]">
                  {item.unit}
                </span>
              </div>

              <div className="text-right">
                <span className="font-bold text-[#1B4332] text-base block">
                  {item.price}
                </span>
                <span className="text-[11px] font-semibold text-[#2D6A4F] inline-flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {item.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Farm Profit */}
      <div id="farm-profit-section" className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8E4D8] pb-3">
          <div>
            <h3 className="font-bold text-[#1B4332] text-base">
              Farm Profit Projection
            </h3>
            <p className="text-xs text-[#5C715C]">
              Calculated for Ahmad's land holding
            </p>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]">
            Demo Calculation
          </span>
        </div>

        {/* Breakdown Card */}
        <div className="bg-[#F7FAF7] rounded-xl p-5 border border-[#D8E4D8] space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs border-b border-[#D8E4D8] pb-3">
            <div>
              <span className="text-[#5C715C] block text-[11px]">Crop</span>
              <span className="font-bold text-[#1B4332] text-sm">Chickpea</span>
            </div>
            <div>
              <span className="text-[#5C715C] block text-[11px]">Farm Size</span>
              <span className="font-bold text-[#1B4332] text-sm">5 Acres</span>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between items-center text-[#4A5D4A]">
              <span>Total Revenue (Est. 100 maund @ PKR 7,500)</span>
              <span className="font-semibold text-[#1B4332]">PKR 750,000</span>
            </div>

            <div className="flex justify-between items-center text-[#4A5D4A]">
              <span>Total Cost (Seeds, DAP, Urea, Land Prep, Harvest)</span>
              <span className="font-semibold text-[#1B4332]">PKR 350,000</span>
            </div>

            <div className="pt-3 border-t border-[#D8E4D8] flex justify-between items-center text-sm">
              <span className="font-bold text-[#1B4332]">Estimated Net Profit</span>
              <span className="font-extrabold text-[#2D6A4F] text-base">PKR 400,000</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#8DA08D] italic text-center">
          Note: Final earnings depend on actual mandi spot rates, harvest weather, and grading.
        </p>
      </div>
    </div>
  );
};
