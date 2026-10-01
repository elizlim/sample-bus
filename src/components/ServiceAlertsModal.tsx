import React from 'react';
import { SERVICE_ADVISORIES, ServiceAdvisory } from '../data/transitData';

interface ServiceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAdvisory: (advisory: ServiceAdvisory) => void;
}

export const ServiceAlertsModal: React.FC<ServiceAlertsModalProps> = ({
  isOpen,
  onClose,
  onSelectAdvisory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-border-subtle relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-card-subtle text-text-muted hover:text-text-primary transition"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-amber-500 text-2xl">warning</span>
          <h2 className="text-xl font-extrabold text-primary font-headline">Service Alerts &amp; Network Health</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Live status of SBS Transit rail lines, bus networks, and temporary diversion advisories.
        </p>

        {/* Rail lines health status */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-surface-card-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Downtown Line</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-live-emerald animate-pulse"></span>
              <span className="text-xs font-bold text-live-emerald">Normal Service</span>
            </div>
            <span className="text-[10px] text-text-muted block mt-0.5">2.2m headway peak</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-card-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-text-secondary uppercase">North East Line</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-live-emerald"></span>
              <span className="text-xs font-bold text-live-emerald">Normal Service</span>
            </div>
            <span className="text-[10px] text-text-muted block mt-0.5">3.0m headway</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-card-subtle border border-border-subtle col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Sengkang-Punggol LRT</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-live-emerald"></span>
              <span className="text-xs font-bold text-live-emerald">Normal Service</span>
            </div>
            <span className="text-[10px] text-text-muted block mt-0.5">Both loops active</span>
          </div>
        </div>

        {/* Advisories List */}
        <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-2">
          Active Bus Diversions &amp; Notices
        </h4>
        <div className="space-y-3">
          {SERVICE_ADVISORIES.map((adv) => (
            <div
              key={adv.id}
              className="p-4 rounded-xl border border-border-subtle bg-surface-card-subtle hover:bg-white hover:shadow-sm transition cursor-pointer"
              onClick={() => {
                onSelectAdvisory(adv);
                onClose();
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="font-bold text-text-primary text-sm hover:text-primary transition">
                    {adv.title}
                  </h5>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <span>Effective: {adv.effectiveDate}</span>
                    <span>•</span>
                    <span>{adv.area}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-text-muted text-base shrink-0">
                  chevron_right
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold transition hover:bg-purple-deep"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
