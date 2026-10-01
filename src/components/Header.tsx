import React, { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  onOpenRoutePlanner: () => void;
  onOpenFavorites: () => void;
  onOpenAlerts: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onLocateMe,
  isLocating,
  onOpenRoutePlanner,
  onOpenFavorites,
  onOpenAlerts,
  favoritesCount
}) => {
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md');

  const handleTextSize = (size: 'sm' | 'md' | 'lg') => {
    setTextSize(size);
    const scale = size === 'sm' ? '0.9' : size === 'lg' ? '1.12' : '1';
    document.documentElement.style.setProperty('--text-scale', scale);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-bright/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(106,26,122,0.06)] border-b border-border-subtle">
      {/* Top Advisory Bar */}
      <div className="bg-primary text-on-primary py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="material-symbols-outlined text-[16px] text-emerald-300 shrink-0">campaign</span>
            <span className="truncate">
              Service Announcement: Downtown Line frequency enhanced during peak hours. Additional trips scheduled for Service 147.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 bg-purple-deep px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-live-emerald animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-wider text-live-emerald uppercase">ALL SERVICES NORMAL</span>
            </div>

            <div className="flex items-center gap-1 text-on-primary">
              <span className="text-[11px] opacity-80">Text:</span>
              <button
                onClick={() => handleTextSize('sm')}
                className={`px-1.5 py-0.5 rounded text-xs transition ${textSize === 'sm' ? 'bg-purple-deep font-bold underline' : 'hover:bg-purple-deep/70'}`}
                type="button"
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => handleTextSize('md')}
                className={`px-1.5 py-0.5 rounded text-xs font-bold transition ${textSize === 'md' ? 'bg-purple-deep font-extrabold underline' : 'hover:bg-purple-deep/70'}`}
                type="button"
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => handleTextSize('lg')}
                className={`px-1.5 py-0.5 rounded text-xs font-bold transition ${textSize === 'lg' ? 'bg-purple-deep font-extrabold underline' : 'hover:bg-purple-deep/70'}`}
                type="button"
                title="Large text"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('live-arrivals')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="h-9 px-3 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold text-lg tracking-tight shadow-sm group-hover:bg-purple-deep transition">
              SBS<span className="ml-1 text-orange-vibrant">Transit</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-base leading-none text-primary">NextBus</span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">
                Real-Time Arrival
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('live-arrivals')}
              className={`px-3.5 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === 'live-arrivals'
                  ? 'bg-purple-light text-primary'
                  : 'text-text-secondary hover:bg-purple-light/50 hover:text-text-primary'
              }`}
            >
              Live Arrivals
            </button>
            <button
              onClick={onOpenRoutePlanner}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-purple-light hover:text-primary transition"
            >
              Route Planner
            </button>
            <button
              onClick={() => {
                setActiveTab('live-arrivals');
                const el = document.getElementById('nearby-radar-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-purple-light hover:text-primary transition"
            >
              Nearby Stops
            </button>
            <button
              onClick={onOpenFavorites}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-purple-light hover:text-primary transition flex items-center gap-1.5"
            >
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-action text-white text-[11px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenAlerts}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-purple-light hover:text-primary transition"
            >
              Service Alerts
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-action hover:bg-orange-vibrant text-white font-semibold text-xs sm:text-sm transition shadow-sm disabled:opacity-75"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] ${isLocating ? 'animate-spin' : ''}`}>
              {isLocating ? 'progress_activity' : 'my_location'}
            </span>
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Locate Me'}</span>
          </button>

          <button
            onClick={onOpenFavorites}
            className="w-8 h-8 rounded-full bg-primary hover:bg-purple-deep text-on-primary flex items-center justify-center transition shadow-sm relative"
            title="My Saved Favorites & Preferences"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-vibrant rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
