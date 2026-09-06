import React from 'react';
import { 
  Home, 
  MessageSquareCode, 
  Sprout, 
  Bug, 
  CloudSun, 
  Coins, 
  Landmark, 
  User, 
  X,
  Sparkles
} from 'lucide-react';
import { NavTab, FarmerProfile } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  farmer: FarmerProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenEditProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  farmer,
  isOpenMobile,
  onCloseMobile,
  onOpenEditProfile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: Home, badge: '' },
    { id: 'ai-assistant' as NavTab, label: 'AI Assistant', icon: MessageSquareCode, badge: 'Agentic' },
    { id: 'crop-advisor' as NavTab, label: 'Crop Advisor', icon: Sprout, badge: '' },
    { id: 'pest-doctor' as NavTab, label: 'Pest Doctor', icon: Bug, badge: '' },
    { id: 'weather' as NavTab, label: 'Weather', icon: CloudSun, badge: '' },
    { id: 'market-finance' as NavTab, label: 'Market & Finance', icon: Coins, badge: '' },
    { id: 'government-support' as NavTab, label: 'Government Support', icon: Landmark, badge: '' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="kisan-dost-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#EAF2EA] border-r border-[#D8E4D8] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        } lg:static lg:z-auto`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#D8E4D8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center text-xl shadow-xs shadow-[#2D6A4F]/20">
                🌾
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B4332] tracking-tight flex items-center gap-1.5">
                  Kisan Dost
                </h1>
                <p className="text-xs font-semibold text-[#2D6A4F]">
                  AI Farming Assistant
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              id="sidebar-close-btn"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#4A5D4A] hover:text-[#1B4332] hover:bg-[#DDE8DD]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-[#2D6A4F] border border-[#D8E4D8] shadow-xs font-semibold'
                    : 'text-[#4A5D4A] hover:text-[#1B4332] hover:bg-[#DDE8DD]/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D6A4F]' : 'text-[#526652]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]' 
                        : 'bg-[#DDE8DD] text-[#2D6A4F]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Farmer Profile Footer */}
        <div className="p-3 border-t border-[#D8E4D8]">
          <div 
            id="sidebar-farmer-profile-card"
            onClick={onOpenEditProfile}
            className="p-3 rounded-xl bg-white border border-[#D8E4D8] hover:bg-[#F4F7F4] cursor-pointer transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                Farmer Profile
              </span>
              <span className="text-[10px] font-semibold text-[#2D6A4F] hover:underline">
                Edit
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center font-semibold text-xs">
                {farmer.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1B4332] truncate">
                  {farmer.name}
                </p>
                <p className="text-xs text-[#5C715C] truncate">
                  {farmer.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
