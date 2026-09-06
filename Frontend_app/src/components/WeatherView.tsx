import React from 'react';
import { CloudSun, Droplets, Wind, Thermometer, CloudRain, Info } from 'lucide-react';

export const WeatherView: React.FC = () => {
  const forecast = [
    { day: 'Today', temp: '33.6°C', rain: '51% rain', condition: 'Scattered Showers', icon: '🌦️' },
    { day: 'Tomorrow', temp: '35.3°C', rain: '35% rain', condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Day 3', temp: '36.3°C', rain: '0% rain', condition: 'Clear & Sunny', icon: '☀️' },
  ];

  return (
    <div id="weather-view-container" className="max-w-3xl mx-auto space-y-6">
      {/* Header with Demo Badge */}
      <div className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌦️</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332]">
              Faisalabad Weather
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5C715C] mt-1">
            Current agrometeorological conditions & short-range forecast
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]">
          Demo Data
        </span>
      </div>

      {/* Current Conditions Card */}
      <div id="current-weather-card" className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5C715C] block mb-4">
          Current Conditions
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold text-[#1B4332] tracking-tight">
              27°C
            </span>
            <span className="text-sm font-medium text-[#2D6A4F] bg-[#EAF2EA] px-2.5 py-1 rounded-lg border border-[#D8E4D8]">
              Mild & Humid
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
            <div className="p-3 bg-[#F7FAF7] rounded-xl border border-[#D8E4D8] text-center">
              <Droplets className="w-4 h-4 text-[#2D6A4F] mx-auto mb-1" />
              <span className="text-[10px] text-[#5C715C] block">Humidity</span>
              <span className="text-xs font-bold text-[#1B4332]">85%</span>
            </div>

            <div className="p-3 bg-[#F7FAF7] rounded-xl border border-[#D8E4D8] text-center">
              <Wind className="w-4 h-4 text-[#2D6A4F] mx-auto mb-1" />
              <span className="text-[10px] text-[#5C715C] block">Wind</span>
              <span className="text-xs font-bold text-[#1B4332]">4.8 km/h</span>
            </div>

            <div className="p-3 bg-[#F7FAF7] rounded-xl border border-[#D8E4D8] text-center">
              <CloudRain className="w-4 h-4 text-[#2D6A4F] mx-auto mb-1" />
              <span className="text-[10px] text-[#5C715C] block">Rain Prob.</span>
              <span className="text-xs font-bold text-[#1B4332]">51%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div id="weather-forecast-card" className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs">
        <h3 className="text-sm font-bold text-[#1B4332] uppercase tracking-wider mb-4">
          3-Day Forecast
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {forecast.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F7FAF7] border border-[#D8E4D8] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-[#1B4332] text-sm">{item.day}</span>
                <span className="text-xl">{item.icon}</span>
              </div>

              <div>
                <div className="text-xl font-extrabold text-[#1B4332]">
                  {item.temp}
                </div>
                <div className="text-xs font-semibold text-[#2D6A4F] mt-1">
                  {item.rain}
                </div>
                <div className="text-[11px] text-[#5C715C] mt-0.5">
                  {item.condition}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Note */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#F0F4F0] border border-[#D8E4D8] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
          <p className="text-xs text-[#1B4332] leading-relaxed">
            <strong>Farming Advisory:</strong> 51% rain expected today. Delay pesticide spraying or irrigation until skies clear to avoid chemical runoff and water-logging.
          </p>
        </div>
      </div>
    </div>
  );
};
