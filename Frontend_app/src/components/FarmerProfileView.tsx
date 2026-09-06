import React, { useState } from 'react';
import { User, MapPin, Layers, Droplets, Calendar, Edit3, Save, X, Check } from 'lucide-react';
import { FarmerProfile } from '../types';

interface FarmerProfileViewProps {
  farmer: FarmerProfile;
  onUpdateFarmer: (updated: FarmerProfile) => void;
  onBackToDashboard?: () => void;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  farmer,
  onUpdateFarmer,
  onBackToDashboard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FarmerProfile>(farmer);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFarmer(formData);
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div id="farmer-profile-container" className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center text-xl font-bold">
            {farmer.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332]">
              Farmer Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#5C715C]">
              Personal context used by Kisan Dost AI agents
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            id="edit-profile-btn"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAF2EA] text-[#2D6A4F] hover:bg-[#DDE8DD] font-medium text-xs transition-colors border border-[#D8E4D8] cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {showSavedToast && (
        <div className="p-3 bg-[#EAF2EA] border border-[#D8E4D8] text-[#1B4332] rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#2D6A4F]" />
          <span>Profile context updated successfully! Kisan Dost agents will now use this updated context.</span>
        </div>
      )}

      {/* Main Profile Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B4332] mb-1">
                Farmer Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D8E4D8] text-sm text-[#1B4332] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1B4332] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8E4D8] text-sm text-[#1B4332] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B4332] mb-1">
                  Farm Size (Acres)
                </label>
                <input
                  type="number"
                  value={formData.farmSizeAcres}
                  onChange={(e) => setFormData({ ...formData, farmSizeAcres: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8E4D8] text-sm text-[#1B4332] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B4332] mb-1">
                  Soil Type
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8E4D8] text-sm text-[#1B4332] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Clay">Clay</option>
                  <option value="Silt">Silt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B4332] mb-1">
                  Water Availability
                </label>
                <select
                  value={formData.waterAvailability}
                  onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8E4D8] text-sm text-[#1B4332] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white"
                >
                  <option value="Limited">Limited (Canal / Tube-well share)</option>
                  <option value="Adequate">Adequate (Permanent Canal/Bore)</option>
                  <option value="Rainfed (Barani)">Rainfed (Barani)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1B4332] mb-1">
                  Current Season
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8E4D8] text-sm text-[#1B4332] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white"
                >
                  <option value="Rabi">Rabi (Winter - Wheat, Chickpea, Mustard)</option>
                  <option value="Kharif">Kharif (Monsoon - Cotton, Rice, Maize, Sugarcane)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#D8E4D8]">
              <button
                type="button"
                onClick={() => {
                  setFormData(farmer);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#5C715C] hover:text-[#1B4332] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-profile-btn"
                type="submit"
                className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#245840] text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[11px] text-[#5C715C] font-medium block">Farmer Name</span>
                <span className="text-base font-bold text-[#1B4332] mt-0.5 block">{farmer.name}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[11px] text-[#5C715C] font-medium block">Location</span>
                <span className="text-base font-bold text-[#1B4332] mt-0.5 block">{farmer.location}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[11px] text-[#5C715C] font-medium block">Farm Size</span>
                <span className="text-base font-bold text-[#1B4332] mt-0.5 block">{farmer.farmSizeAcres} Acres</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[11px] text-[#5C715C] font-medium block">Soil Type</span>
                <span className="text-base font-bold text-[#1B4332] mt-0.5 block">{farmer.soilType}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[11px] text-[#5C715C] font-medium block">Season</span>
                <span className="text-base font-bold text-[#1B4332] mt-0.5 block">{farmer.season}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8]">
                <span className="text-[11px] text-[#5C715C] font-medium block">Water Availability</span>
                <span className="text-base font-bold text-[#1B4332] mt-0.5 block">{farmer.waterAvailability}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D8E4D8] text-[11px] text-[#5C715C] leading-relaxed">
              This context is automatically injected into the <strong>Triage Agent</strong> and <strong>Specialist Agents</strong> so recommendations (e.g. fertilizer quantity per acre, crop water compatibility) are tailored to Ahmad's exact land conditions.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
