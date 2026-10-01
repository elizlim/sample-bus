import React from 'react';
import { ServiceAdvisory } from '../data/transitData';

interface AdvisoryDetailModalProps {
  advisory: ServiceAdvisory | null;
  onClose: () => void;
  onTrackService: (serviceNo: string) => void;
}

export const AdvisoryDetailModal: React.FC<AdvisoryDetailModalProps> = ({
  advisory,
  onClose,
  onTrackService,
}) => {
  if (!advisory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border-subtle relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-card-subtle text-text-muted hover:text-text-primary transition"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-orange-action text-2xl">campaign</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-light text-primary uppercase">
            SBS Transit Bulletin
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-text-primary font-headline leading-snug">
          {advisory.title}
        </h3>

        <div className="flex items-center gap-2 my-2 text-xs text-text-muted">
          <span>Effective: {advisory.effectiveDate}</span>
          <span>•</span>
          <span>{advisory.area}</span>
        </div>

        <div className="my-4 p-4 rounded-xl bg-surface-card-subtle text-xs sm:text-sm text-text-secondary leading-relaxed space-y-3">
          <p>{advisory.details}</p>
          <p>
            Commuters can verify alternate bus services and revised trip schedules via this NextBus tracker or reach our hotline at 1800-287-2727.
          </p>
        </div>

        {advisory.affectedServices && advisory.affectedServices.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
              Affected Bus Services
            </span>
            <div className="flex flex-wrap gap-2">
              {advisory.affectedServices.map((svc) => (
                <button
                  key={svc}
                  onClick={() => {
                    onTrackService(svc);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-purple-deep text-on-primary text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Bus {svc}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-surface-card-subtle hover:bg-slate-200 text-text-secondary text-xs font-bold transition"
          >
            Close Bulletin
          </button>
        </div>
      </div>
    </div>
  );
};
