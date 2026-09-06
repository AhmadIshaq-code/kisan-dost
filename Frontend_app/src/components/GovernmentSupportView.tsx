import React from 'react';
import { Landmark, AlertTriangle, CheckCircle, FileText, PhoneCall, ExternalLink } from 'lucide-react';

export const GovernmentSupportView: React.FC = () => {
  return (
    <div id="gov-support-container" className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF2EA] border border-[#D8E4D8] flex items-center justify-center text-xl">
            🏛️
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332]">
              Government Support
            </h1>
            <p className="text-xs sm:text-sm text-[#5C715C]">
              Agricultural subsidies, relief schemes, and Kisan Card facilities
            </p>
          </div>
        </div>
      </div>

      {/* Subsidy Card */}
      <div id="subsidy-info-card" className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#D8E4D8] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#1B4332]">
              Subsidy & Government Support
            </h2>
            <p className="text-xs text-[#5C715C]">
              Provincial Agriculture Department Schemes
            </p>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]">
            Active Notice
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
            <span className="text-[10px] text-[#5C715C] uppercase font-semibold block">Program</span>
            <span className="text-sm font-bold text-[#1B4332] mt-0.5 block">Subsidized Fertilizer Support</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
            <span className="text-[10px] text-[#5C715C] uppercase font-semibold block">Province</span>
            <span className="text-sm font-bold text-[#1B4332] mt-0.5 block">Punjab</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
            <span className="text-[10px] text-[#5C715C] uppercase font-semibold block">Support Type</span>
            <span className="text-sm font-bold text-[#1B4332] mt-0.5 block">Fertilizer Subsidy</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
            <span className="text-[10px] text-[#5C715C] uppercase font-semibold block">Benefit</span>
            <span className="text-sm font-bold text-[#1B4332] mt-0.5 block">Fertilizer-related subsidy</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F0F4F0] border border-[#D8E4D8]">
          <span className="text-xs font-bold text-[#1B4332] block mb-1">
            Eligibility Requirements:
          </span>
          <p className="text-xs sm:text-sm text-[#4A5D4A] leading-relaxed">
            Eligible farmers under active government subsidy programs. Verified land records via Punjab Land Records Authority (PLRA) or registered Kisan Card holders.
          </p>
        </div>

        {/* Mandatory Safety Warning Banner */}
        <div id="subsidy-warning-banner" className="p-4 rounded-xl bg-[#FFFDF7] border border-[#E8DFC8] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#996F2F] shrink-0 mt-0.5" />
          <div className="text-xs text-[#7A5826] leading-relaxed">
            <span className="font-bold block mb-0.5">
              ⚠️ Important Notice:
            </span>
            Demo information — verify the current government scheme, eligibility and benefit before applying. Schemes, quota limits, and application deadlines are subject to provincial department notifications.
          </div>
        </div>
      </div>
    </div>
  );
};
