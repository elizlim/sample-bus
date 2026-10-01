import React, { useState } from 'react';
import { BusStop } from '../data/transitData';

interface RadarMapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStopCode: string;
  onSelectStop: (code: string) => void;
  currentService: string;
}

export const RadarMapDrawer: React.FC<RadarMapDrawerProps> = ({
  isOpen,
  onClose,
  selectedStopCode,
  onSelectStop,
  currentService
}) => {
  const [mapLayer, setMapLayer] = useState<'hybrid' | 'transit'>('hybrid');
  const [activePin, setActivePin] = useState<string | null>(null);

  if (!isOpen) return null;

  const pins = [
    { code: '01112', name: 'Opp Bugis Stn Exit C', x: 42, y: 52, road: 'Victoria St' },
    { code: '01139', name: 'Bugis Stn / Parkview Sq', x: 58, y: 38, road: 'North Bridge Rd' },
    { code: '01059', name: 'Bugis Stn Exit B', x: 38, y: 34, road: 'Victoria St' },
    { code: '01541', name: 'Bugis Stn Exit D', x: 26, y: 62, road: 'Rochor Rd' },
  ];

  return (
    <div className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle p-4 sm:p-6 space-y-3 transition-all animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">radar</span>
          <h3 className="text-sm sm:text-base font-bold text-text-primary font-headline">
            Surrounding Stops Radar (Bugis Precinct)
          </h3>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-live-emerald-bg text-tertiary uppercase">
            Live Telemetry
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-card-subtle p-0.5 rounded-lg text-xs font-semibold text-text-secondary">
            <button
              onClick={() => setMapLayer('hybrid')}
              className={`px-2 py-1 rounded-md transition ${mapLayer === 'hybrid' ? 'bg-white shadow text-primary' : 'hover:text-text-primary'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapLayer('transit')}
              className={`px-2 py-1 rounded-md transition ${mapLayer === 'transit' ? 'bg-white shadow text-primary' : 'hover:text-text-primary'}`}
            >
              Transit Schema
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-md hover:bg-surface-card-subtle transition"
            type="button"
          >
            <span className="material-symbols-outlined text-base">close</span>
            <span>Close Radar</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Visual */}
      <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden shadow-inner border border-border-strong/30 select-none">
        {/* Background Image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition duration-500 ${mapLayer === 'transit' ? 'brightness-90 contrast-125 saturate-150' : ''}`}
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCIp3oSRbN9IBTSgVo2_-WKt8hOyjQi937olfa3QcQ2PcDj57KEu0gtRwO9s0bExZvhvdjDfnQZMFW3jNbXX9NXzTqtCX7YAIzsJ6X-3_nuRN1LHm9nbxooAz2VP_m4nhb2A5MTRkEKlJqEJbCu82LYRxsilS_IOzCsh5_pQQALn8M_gk3gg8NzVv0WfZK2PQGpUK5Xjh7w_gBqzlC38b3sCZafTmVkRIXrtX9oxXzxdd4J4TfP1SonuQ')`
          }}
        />

        {/* Dynamic Overlay Grid & Radar Pulse */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />

        {/* 350m Geofence Radar Pulse Rings */}
        <div className="absolute left-[42%] top-[52%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-primary/40 bg-primary/5 pointer-events-none animate-ping opacity-25" />
        <div className="absolute left-[42%] top-[52%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-dashed border-emerald-400/50 pointer-events-none" />

        {/* Bus In-Transit Marker */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 animate-bounce"
          style={{ left: '46%', top: '48%' }}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded bg-orange-action text-white text-[10px] font-extrabold shadow-lg flex items-center gap-1 whitespace-nowrap ring-2 ring-white">
              <span className="material-symbols-outlined text-[12px]">directions_bus</span>
              <span>Bus {currentService} (~250m)</span>
            </div>
            <div className="w-2.5 h-2.5 bg-orange-action rotate-45 -mt-1 ring-1 ring-white"></div>
          </div>
        </div>

        {/* Stop Pins on Map */}
        {pins.map((pin) => {
          const isSelected = selectedStopCode === pin.code;
          return (
            <div
              key={pin.code}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onClick={() => {
                onSelectStop(pin.code);
                setActivePin(pin.code);
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Pin Head */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition transform group-hover:scale-110 ${
                    isSelected
                      ? 'bg-live-emerald text-white ring-4 ring-live-emerald-bg'
                      : 'bg-primary text-white ring-2 ring-white/90 hover:bg-primary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {isSelected ? 'location_on' : 'directions_bus'}
                  </span>
                </div>

                {/* Pin Tooltip */}
                <div className={`mt-1 px-2 py-0.5 rounded shadow text-[10px] font-semibold whitespace-nowrap transition ${
                  isSelected ? 'bg-emerald-950 text-emerald-200 border border-emerald-400' : 'bg-slate-900/90 text-white group-hover:bg-slate-950'
                }`}>
                  {pin.name} ({pin.code})
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom overlay status */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col sm:flex-row sm:items-center justify-between text-white text-xs gap-2">
          <div>
            <span className="font-bold text-orange-400">Victoria St & Middle Rd Junction</span> • Showing real-time positions of SBS transit vehicles within 500m radius.
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-live-emerald"></span> Current Stop
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Nearby Stops
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-action"></span> Active Bus
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
