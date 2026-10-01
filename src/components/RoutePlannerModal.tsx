import React, { useState } from 'react';

interface RoutePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackService: (serviceNo: string) => void;
}

export const RoutePlannerModal: React.FC<RoutePlannerModalProps> = ({
  isOpen,
  onClose,
  onTrackService,
}) => {
  const [origin, setOrigin] = useState('01112');
  const [destination, setDestination] = useState('clementi');

  if (!isOpen) return null;

  const sampleDestinations = [
    { id: 'clementi', name: 'Clementi Bus Interchange / MRT', service: '147', duration: '34 mins', transfers: 'Direct (Bus 147)', fare: '$1.86' },
    { id: 'orchard', name: 'Orchard Boulevard / MRT (Exit 1)', service: '7', duration: '18 mins', transfers: 'Direct (Bus 7 or 65)', fare: '$1.42' },
    { id: 'chinatown', name: 'Chinatown Complex / People\'s Park', service: '147', duration: '12 mins', transfers: 'Direct (Bus 147, 2 or 12)', fare: '$1.19' },
    { id: 'hougang', name: 'Hougang Central Interchange', service: '147', duration: '41 mins', transfers: 'Direct (Bus 147 Direction 2)', fare: '$1.98' },
    { id: 'changi', name: 'Changi Village Terminal', service: '2', duration: '52 mins', transfers: 'Direct (Bus 2 or 12)', fare: '$2.15' },
    { id: 'jurong', name: 'Jurong East Bus Interchange', service: '51', duration: '48 mins', transfers: 'Bus 51 or Bus 197', fare: '$2.08' },
  ];

  const currentRoute = sampleDestinations.find((d) => d.id === destination) || sampleDestinations[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-border-subtle relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-card-subtle text-text-muted hover:text-text-primary transition"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-orange-action text-2xl">alt_route</span>
          <h2 className="text-xl font-extrabold text-primary font-headline">SBS Transit Route Planner</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Find the fastest bus & rail connections across Singapore with live departure synchronization.
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
              From (Origin Stop)
            </label>
            <div className="relative">
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-11 pl-3 pr-8 rounded-xl bg-surface-card-subtle text-text-primary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="01112">01112 - Opp Bugis Stn Exit C</option>
                <option value="01139">01139 - Bugis Stn / Parkview Sq</option>
                <option value="01059">01059 - Bugis Stn Exit B</option>
                <option value="01541">01541 - Bugis Stn Exit D</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-text-muted pointer-events-none text-lg">
                expand_more
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
              To (Destination)
            </label>
            <div className="relative">
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-11 pl-3 pr-8 rounded-xl bg-surface-card-subtle text-text-primary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {sampleDestinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-text-muted pointer-events-none text-lg">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Journey Card */}
        <div className="bg-purple-light/50 border border-primary/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary text-on-primary uppercase">
              Fastest Recommendation
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-primary text-base font-headline">{currentRoute.duration}</span>
              <span className="text-text-muted">Fare: {currentRoute.fare}</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs">
                <span className="font-bold text-text-primary">Board at Opp Bugis Stn Exit C</span>
                <p className="text-text-secondary">Take Bus <strong className="text-primary font-bold text-sm">{currentRoute.service}</strong> towards {currentRoute.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-live-emerald-bg text-tertiary text-[11px] font-bold">
                    Next arrival: Imminent (Arr)
                  </span>
                  <button
                    onClick={() => {
                      onTrackService(currentRoute.service);
                      onClose();
                    }}
                    className="text-orange-action font-bold hover:underline flex items-center gap-0.5"
                  >
                    Track Live <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-live-emerald text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs">
                <span className="font-bold text-text-primary">Alight at {currentRoute.name}</span>
                <p className="text-text-secondary">Direct journey without vehicle transfers. Frequency: every 6-8 mins.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-card-subtle hover:bg-slate-200 text-text-secondary text-xs font-bold transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onTrackService(currentRoute.service);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-orange-action hover:bg-orange-vibrant text-white text-xs font-bold transition shadow-sm"
          >
            Track Service {currentRoute.service}
          </button>
        </div>
      </div>
    </div>
  );
};
