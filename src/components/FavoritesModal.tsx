import React from 'react';
import { BUS_STOPS } from '../data/transitData';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onToggleFavorite: (stopCode: string) => void;
  onSelectStop: (stopCode: string) => void;
  onSelectService: (serviceNo: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onSelectStop,
  onSelectService,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-card rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-border-subtle relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-card-subtle text-text-muted hover:text-text-primary transition"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-amber-500 text-2xl">star</span>
          <h2 className="text-xl font-extrabold text-primary font-headline">My Starred Stops & Routes</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Quickly jump to your frequently used bus stops and services for rapid glance arrival checks.
        </p>

        {favorites.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <span className="material-symbols-outlined text-4xl text-text-muted">bookmark_border</span>
            <p className="text-sm font-semibold text-text-secondary">No favorites saved yet</p>
            <p className="text-xs text-text-muted max-w-xs mx-auto">
              Tap the &quot;Favorite Stop&quot; star icon on any bus stop to bookmark it here for quick access.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {favorites.map((stopCode) => {
              const stop = BUS_STOPS[stopCode];
              if (!stop) return null;

              return (
                <div
                  key={stopCode}
                  className="p-4 rounded-xl border border-border-subtle bg-surface-card-subtle hover:bg-white hover:shadow-sm transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary text-sm sm:text-base">
                          {stop.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white font-mono text-xs font-semibold text-text-secondary border border-border-subtle">
                          {stop.code}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{stop.road}</p>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(stopCode)}
                      className="p-1 text-amber-500 hover:text-red-500 transition"
                      title="Remove from favorites"
                    >
                      <span className="material-symbols-outlined text-lg">star</span>
                    </button>
                  </div>

                  {/* Services preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {stop.services.map((svc) => (
                      <button
                        key={svc.serviceNo}
                        onClick={() => {
                          onSelectStop(stopCode);
                          onSelectService(svc.serviceNo);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-white hover:bg-purple-light border border-border-subtle text-xs font-bold text-primary flex items-center gap-1 transition"
                      >
                        <span>{svc.serviceNo}</span>
                        <span className="text-[10px] text-live-emerald font-semibold">{svc.nextArrival}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border-subtle/60 flex justify-end">
                    <button
                      onClick={() => {
                        onSelectStop(stopCode);
                        onClose();
                      }}
                      className="text-xs font-bold text-primary hover:text-orange-action flex items-center gap-1"
                    >
                      View Live Board <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
