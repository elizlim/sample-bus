import React from 'react';

interface AiPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiPilotModal: React.FC<AiPilotModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-card rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-border-subtle relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-card-subtle text-text-muted hover:text-text-primary transition"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-primary text-on-primary uppercase tracking-wide">
            Transit Innovation Pilot
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-live-emerald-bg text-tertiary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-live-emerald animate-ping"></span>
            Active Trial 2025–2026
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-primary font-headline leading-tight">
          SBS Transit Trials AI for More Reliable Bus Arrivals
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Dynamic headway control active along Downtown corridors & trunk services 147, 65, and 12
        </p>

        <div className="mt-5 space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <div className="bg-purple-light p-4 rounded-xl border border-primary/20 space-y-2">
            <h4 className="font-bold text-primary flex items-center gap-1.5 text-sm">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              How Dynamic Headway Control Works
            </h4>
            <p>
              SBS Transit's Operations Control Centre (OCC) utilizes real-time vehicle telematics, traffic junction priority signals, and passenger load telemetry to predict and eliminate bus bunching. By dynamically advising bus captains on speed moderation and green light holding, headways remain consistently spaced.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-surface-card-subtle p-3 rounded-xl">
              <span className="block text-2xl font-extrabold text-live-emerald font-headline">-38%</span>
              <span className="text-[11px] font-medium text-text-secondary">Bus Bunching Events</span>
            </div>
            <div className="bg-surface-card-subtle p-3 rounded-xl">
              <span className="block text-2xl font-extrabold text-primary font-headline">94.2%</span>
              <span className="text-[11px] font-medium text-text-secondary">On-Time Accuracy</span>
            </div>
            <div className="bg-surface-card-subtle p-3 rounded-xl">
              <span className="block text-2xl font-extrabold text-orange-action font-headline">3.2m</span>
              <span className="text-[11px] font-medium text-text-secondary">Avg Commuter Time Saved</span>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-3 space-y-2">
            <h5 className="font-bold text-text-primary text-xs uppercase tracking-wider">
              Pilot Corridors & Services
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {['147', '2', '7', '12', '65', '190', '851'].map((svc) => (
                <span key={svc} className="px-2.5 py-1 rounded-md bg-surface-card-subtle font-bold text-xs text-primary">
                  Service {svc}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-purple-deep text-on-primary text-xs sm:text-sm font-bold transition shadow-sm"
          >
            Got it, Return to Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
