import React, { useState } from 'react';
import { Menu, Sprout, Bot, ShieldCheck } from 'lucide-react';
import { NavTab, FarmerProfile } from './types';
import { INITIAL_FARMER_PROFILE } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AiAssistantView } from './components/AiAssistantView';
import { CropAdvisorView } from './components/CropAdvisorView';
import { PestDoctorView } from './components/PestDoctorView';
import { WeatherView } from './components/WeatherView';
import { MarketFinanceView } from './components/MarketFinanceView';
import { GovernmentSupportView } from './components/GovernmentSupportView';
import { FarmerProfileView } from './components/FarmerProfileView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [farmer, setFarmer] = useState<FarmerProfile>(INITIAL_FARMER_PROFILE);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [initialPromptText, setInitialPromptText] = useState<string | undefined>(undefined);

  const handleNavigate = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectActionPrompt = (promptText: string) => {
    setInitialPromptText(promptText);
    setCurrentTab('ai-assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearInitialPrompt = () => {
    setInitialPromptText(undefined);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] text-[#1B4332] flex flex-col lg:flex-row antialiased">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        farmer={farmer}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenEditProfile={() => setCurrentTab('farmer-profile')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar for Mobile & Desktop context */}
        <header
          id="main-app-header"
          className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#D8E4D8] px-4 sm:px-8 py-3.5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#4A5D4A] hover:text-[#1B4332] hover:bg-[#EAF2EA] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="lg:hidden text-lg">🌾</span>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#2D6A4F] block">
                  Kisan Dost
                </span>
                <h2 className="text-sm font-semibold text-[#1B4332] capitalize">
                  {currentTab.replace('-', ' ')}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Agent Status Badge */}
            <div 
              id="header-agent-status"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8] text-xs font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              <span>Multi-Agent System Active</span>
            </div>

            {/* Farmer Profile Pill */}
            <button
              id="header-farmer-pill"
              onClick={() => handleNavigate('farmer-profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#EAF2EA] hover:bg-[#DDE8DD] border border-[#D8E4D8] transition-colors text-xs font-semibold text-[#1B4332]"
            >
              <div className="w-6 h-6 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-[10px] font-bold">
                {farmer.name.charAt(0)}
              </div>
              <span className="hidden sm:inline">{farmer.name}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main id="app-main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentTab === 'dashboard' && (
            <DashboardView
              farmer={farmer}
              onNavigate={handleNavigate}
              onSelectActionPrompt={handleSelectActionPrompt}
            />
          )}

          {currentTab === 'ai-assistant' && (
            <AiAssistantView
              farmer={farmer}
              initialPromptText={initialPromptText}
              onClearInitialPrompt={handleClearInitialPrompt}
            />
          )}

          {currentTab === 'crop-advisor' && (
            <CropAdvisorView
              farmer={farmer}
              onAskKisanDost={(prompt) => handleSelectActionPrompt(prompt)}
            />
          )}

          {currentTab === 'pest-doctor' && <PestDoctorView />}

          {currentTab === 'weather' && <WeatherView />}

          {currentTab === 'market-finance' && <MarketFinanceView />}

          {currentTab === 'government-support' && <GovernmentSupportView />}

          {currentTab === 'farmer-profile' && (
            <FarmerProfileView
              farmer={farmer}
              onUpdateFarmer={(updated) => setFarmer(updated)}
              onBackToDashboard={() => setCurrentTab('dashboard')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
