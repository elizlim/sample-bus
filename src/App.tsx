import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RadarMapDrawer } from './components/RadarMapDrawer';
import { AiPilotModal } from './components/AiPilotModal';
import { RoutePlannerModal } from './components/RoutePlannerModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ServiceAlertsModal } from './components/ServiceAlertsModal';
import { AdvisoryDetailModal } from './components/AdvisoryDetailModal';
import {
  BUS_STOPS,
  BUS_SERVICES,
  SERVICE_ADVISORIES,
  POPULAR_BUGIS_SERVICES,
  ServiceAdvisory
} from './data/transitData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'live-arrivals' | 'route-planner' | 'nearby-stops' | 'favorites' | 'alerts'>('live-arrivals');
  const [searchMode, setSearchMode] = useState<'service' | 'stop'>('service');
  const [serviceQuery, setServiceQuery] = useState('147');
  const [selectedStopCode, setSelectedStopCode] = useState('01112');
  const [selectedDirection, setSelectedDirection] = useState<'dir1' | 'dir2'>('dir1');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['01112']);
  const [isLocating, setIsLocating] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('--:--:--');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAiPilotOpen, setIsAiPilotOpen] = useState(false);
  const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [selectedAdvisory, setSelectedAdvisory] = useState<ServiceAdvisory | null>(null);

  // Auto-refresh countdown (30s)
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [serviceQuery]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString('en-SG', { hour12: false }));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setToastMessage('Live arrival telemetry updated from LTA DataMall');
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleManualRefresh = () => {
    setRefreshCountdown(30);
    triggerRefresh();
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setSelectedStopCode('01112');
          setToastMessage('GPS Position Locked: Bugis Precinct (Accuracy: ±6m)');
          setTimeout(() => setToastMessage(null), 3000);
        },
        () => {
          // Fallback simulation to Bugis
          setTimeout(() => {
            setIsLocating(false);
            setSelectedStopCode('01112');
            setToastMessage('GPS Synced: Victoria St / Bugis (Nearby 4 stops active)');
            setTimeout(() => setToastMessage(null), 3000);
          }, 600);
        }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        setSelectedStopCode('01112');
        setToastMessage('GPS Synced to Bugis Anchor');
        setTimeout(() => setToastMessage(null), 3000);
      }, 500);
    }
  };

  const toggleFavorite = (code: string) => {
    setFavorites((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const currentStop = BUS_STOPS[selectedStopCode] || BUS_STOPS['01112'];
  const activeServiceData = BUS_SERVICES[serviceQuery.trim().toUpperCase()] || {
    serviceNo: serviceQuery || '147',
    operator: 'SBS Transit',
    primaryStopCode: selectedStopCode,
    direction1: {
      destination: 'To Destination Terminal',
      via: 'via Islandwide SBS Route',
      arrivals: [
        { time: 'Arr', minutesLeft: 0, status: 'Imminent', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3200A' },
        { time: '10', minutesLeft: 10, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3400B' },
        { time: '21', minutesLeft: 21, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6000C' },
      ],
      trajectory: [
        { code: '01211', name: 'Opp Blk 461', road: 'Victoria St', passed: true },
        { code: currentStop.code, name: currentStop.name, road: currentStop.road, isCurrent: true, hasBus: true, busDistance: `Bus ${serviceQuery} (~300m)` },
        { code: '01012', name: 'Hotel Grand Pacific', road: 'Victoria St', isNext: true },
        { code: '01019', name: 'Bras Basah Cplx', road: 'Victoria St' }
      ]
    },
    direction2: {
      destination: 'To Opposite Terminal',
      via: 'via Return Route',
      arrivals: [
        { time: '6', minutesLeft: 6, status: 'Approaching', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3999Z' },
        { time: '17', minutesLeft: 17, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3888Y' },
        { time: '28', minutesLeft: 28, status: 'Normal', deck: 'Single', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS6777X' },
      ],
      trajectory: [
        { code: currentStop.code, name: currentStop.name, road: currentStop.road, isCurrent: true, hasBus: true, busDistance: `Bus ${serviceQuery} (~500m)` }
      ]
    }
  };

  const activeDirection = selectedDirection === 'dir1' ? activeServiceData.direction1 : activeServiceData.direction2;
  const isCurrentStopFavorited = favorites.includes(currentStop.code);

  const handleTrackService = (svc: string) => {
    setServiceQuery(svc);
    setSearchMode('service');
    // If that service has a known stop, or check if current stop serves it
    const svcDetail = BUS_SERVICES[svc.trim().toUpperCase()];
    if (svcDetail) {
      // Keep or update stop
      if (!currentStop.services.some((s) => s.serviceNo === svc)) {
        setSelectedStopCode(svcDetail.primaryStopCode);
      }
    }
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface font-body text-body-md text-on-surface min-h-screen flex flex-col selection:bg-purple-light selection:text-primary">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-live-emerald text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'route-planner') setIsRoutePlannerOpen(true);
          else if (tab === 'favorites') setIsFavoritesOpen(true);
          else if (tab === 'alerts') setIsAlertsOpen(true);
          else setActiveTab('live-arrivals');
        }}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        onOpenRoutePlanner={() => setIsRoutePlannerOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        favoritesCount={favorites.length}
      />

      <main className="w-full pt-24 bg-surface min-h-[calc(100vh-240px)] flex-1">
        <div className="flex flex-col w-full">
          {/* Top Ticker / Advisory Banner */}
          <div className="w-full bg-purple-light py-2 px-4 border-b border-border-subtle">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm text-primary font-medium">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold bg-primary text-on-primary uppercase tracking-wide shrink-0">
                  Pilot
                </span>
                <span className="truncate font-semibold">
                  SBS Transit Trials AI for More Reliable Bus Arrivals
                </span>
                <span className="hidden md:inline text-text-secondary">
                  • Dynamic headway control active along Downtown corridors
                </span>
              </div>
              <button
                onClick={() => setIsAiPilotOpen(true)}
                className="shrink-0 text-orange-action font-semibold hover:underline flex items-center gap-1 ml-3 cursor-pointer"
                type="button"
              >
                Read details <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Main Container */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Location Radar Status Bar */}
            <div className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-live-emerald-bg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-live-emerald text-2xl animate-pulse">
                    my_location
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-bold text-text-primary font-headline">
                      GPS Geolocation Active
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-live-emerald-bg text-tertiary">
                      <span className="w-1.5 h-1.5 rounded-full bg-live-emerald animate-ping"></span>
                      Live Sync
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                    Current Anchor: <strong className="text-on-surface">{currentStop.name} (Stop {currentStop.code})</strong> • 4 nearest stops within 350m
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                {/* Circular 30s Countdown timer */}
                <div className="flex items-center gap-2 bg-surface-card-subtle px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary border border-border-subtle">
                  <svg className="w-4 h-4 transform -rotate-90">
                    <circle
                      className="text-border-strong opacity-30"
                      cx="8"
                      cy="8"
                      fill="none"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      className="text-orange-action transition-all duration-1000"
                      cx="8"
                      cy="8"
                      fill="none"
                      r="6"
                      stroke="currentColor"
                      strokeDasharray="37.7"
                      strokeDashoffset={37.7 - (refreshCountdown / 30) * 37.7}
                      strokeWidth="2"
                    />
                  </svg>
                  <span>
                    Auto in <strong className="text-primary font-bold">{refreshCountdown}</strong>s
                  </span>
                </div>

                <button
                  onClick={handleManualRefresh}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-light text-primary hover:bg-primary hover:text-on-primary transition text-xs font-semibold shadow-xs"
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined text-[16px] transition-transform duration-500 ${
                      isRefreshing ? 'rotate-180' : ''
                    }`}
                  >
                    refresh
                  </span>
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => setSearchMode('stop')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-highest transition text-xs font-semibold"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_location</span>
                  <span className="hidden sm:inline">Change Stop</span>
                </button>
              </div>
            </div>

            {/* Search & Service Filter Hero Card */}
            <div className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
              {/* Search Mode Tabs */}
              <div className="flex border-b border-border-subtle bg-surface-card-subtle">
                <button
                  onClick={() => setSearchMode('service')}
                  className={`flex-1 sm:flex-initial px-6 py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition ${
                    searchMode === 'service'
                      ? 'bg-primary text-on-primary shadow-inner'
                      : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">directions_bus</span>
                  Search by Service No.
                </button>

                <button
                  onClick={() => setSearchMode('stop')}
                  className={`flex-1 sm:flex-initial px-6 py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition ${
                    searchMode === 'stop'
                      ? 'bg-primary text-on-primary shadow-inner'
                      : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">pin_drop</span>
                  Search by Bus Stop No.
                </button>
              </div>

              <div className="p-5 sm:p-7 space-y-5">
                {searchMode === 'service' ? (
                  /* Service No Form */
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5"
                        htmlFor="bus-service-input"
                      >
                        Service Number
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-primary text-2xl pointer-events-none">
                          search
                        </span>
                        <input
                          id="bus-service-input"
                          className="w-full h-12 pl-12 pr-28 rounded-xl bg-surface-card-subtle text-text-primary text-base font-semibold placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                          placeholder="Enter Bus Service No. (e.g. 2, 7, 12, 14, 65, 147, 190)..."
                          type="text"
                          value={serviceQuery}
                          onChange={(e) => setServiceQuery(e.target.value)}
                        />
                        <button
                          onClick={() => handleTrackService(serviceQuery)}
                          className="absolute right-1.5 h-9 px-4 rounded-lg bg-orange-action hover:bg-orange-vibrant text-on-secondary font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1 cursor-pointer"
                          type="button"
                        >
                          <span>Track</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Service Chips */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-text-muted font-medium">Popular near Bugis:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {POPULAR_BUGIS_SERVICES.map((s) => {
                          const isActive = serviceQuery.trim().toUpperCase() === s;
                          return (
                            <button
                              key={s}
                              onClick={() => handleTrackService(s)}
                              className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                                isActive
                                  ? 'bg-primary text-on-primary ring-2 ring-primary/20 shadow-xs'
                                  : 'bg-purple-light text-primary hover:bg-primary hover:text-on-primary'
                              }`}
                              type="button"
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Bus Stop Selector */
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5"
                        htmlFor="stop-select-input"
                      >
                        Select Bus Stop
                      </label>
                      <div className="relative">
                        <select
                          id="stop-select-input"
                          value={selectedStopCode}
                          onChange={(e) => {
                            const code = e.target.value;
                            setSelectedStopCode(code);
                            // default to first service at that stop
                            const st = BUS_STOPS[code];
                            if (st && st.services.length > 0) {
                              setServiceQuery(st.services[0].serviceNo);
                            }
                          }}
                          className="w-full h-12 pl-4 pr-10 rounded-xl bg-surface-card-subtle text-text-primary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary appearance-none shadow-inner"
                        >
                          {Object.values(BUS_STOPS).map((st) => (
                            <option key={st.code} value={st.code}>
                              {st.code} - {st.name} ({st.road}) [{st.distanceMeters}m]
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-3.5 text-text-muted pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Service Focus Presentation */}
            <div className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle p-5 sm:p-7 space-y-6">
              {/* Stop Discovery Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-16 sm:h-16 sm:w-20 rounded-xl bg-primary text-on-primary flex flex-col items-center justify-center shrink-0 shadow-sm">
                    <span className="text-[10px] tracking-wider font-bold opacity-80 uppercase leading-none">
                      Bus
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none mt-0.5 font-headline">
                      {activeServiceData.serviceNo}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-bold text-text-primary font-headline">
                        {currentStop.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-card-subtle text-text-secondary text-xs font-mono font-semibold">
                        {currentStop.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-orange-surface text-secondary text-xs font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">directions_walk</span>
                        {currentStop.distanceMeters}m away (~{currentStop.walkingTimeMin} min walk)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary mt-1">
                      {currentStop.road} • {activeDirection.destination} ({activeDirection.via})
                    </p>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 self-start lg:self-center">
                  <button
                    onClick={() => toggleFavorite(currentStop.code)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isCurrentStopFavorited
                        ? 'bg-orange-surface text-secondary font-bold'
                        : 'bg-surface-card-subtle hover:bg-purple-light text-text-secondary hover:text-primary'
                    }`}
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isCurrentStopFavorited ? 'text-secondary font-bold' : ''
                      }`}
                    >
                      {isCurrentStopFavorited ? 'star' : 'star_border'}
                    </span>
                    <span>{isCurrentStopFavorited ? 'Saved Stop' : 'Favorite Stop'}</span>
                  </button>

                  <button
                    onClick={() => setIsMapOpen((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isMapOpen
                        ? 'bg-purple-light text-primary font-bold'
                        : 'bg-surface-card-subtle hover:bg-purple-light text-text-secondary hover:text-primary'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">map</span>
                    <span>{isMapOpen ? 'Hide Radar' : 'View Radar'}</span>
                  </button>
                </div>
              </div>

              {/* Route Direction Switcher */}
              <div className="bg-surface-card-subtle p-1.5 rounded-xl flex flex-col sm:flex-row gap-1">
                <button
                  onClick={() => setSelectedDirection('dir1')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    selectedDirection === 'dir1'
                      ? 'bg-surface-card text-primary font-bold shadow-sm'
                      : 'text-text-secondary hover:text-on-surface font-semibold'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">east</span>
                  <span>Direction 1: {activeServiceData.direction1.destination} ({activeServiceData.direction1.via})</span>
                </button>

                <button
                  onClick={() => setSelectedDirection('dir2')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    selectedDirection === 'dir2'
                      ? 'bg-surface-card text-primary font-bold shadow-sm'
                      : 'text-text-secondary hover:text-on-surface font-semibold'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">west</span>
                  <span>Direction 2: {activeServiceData.direction2.destination} ({activeServiceData.direction2.via})</span>
                </button>
              </div>

              {/* Real-time 3 Arrivals Cluster */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1st Bus Card */}
                {activeDirection.arrivals[0] && (
                  <div className="relative bg-surface-bright rounded-xl p-4.5 border border-live-emerald/40 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-text-secondary flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-live-emerald animate-ping"></span>
                        Next Bus (1st)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-live-emerald-bg text-tertiary uppercase">
                        {activeDirection.arrivals[0].status}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 my-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-live-emerald tracking-tight font-headline">
                        {activeDirection.arrivals[0].time}
                      </span>
                      <span className="text-xs text-text-muted font-medium">at platform</span>
                    </div>

                    <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-surface-container font-semibold text-text-secondary text-[11px]"
                          title={`${activeDirection.arrivals[0].deck} Deck Bus`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {activeDirection.arrivals[0].deck === 'Double' ? 'directions_bus' : 'airport_shuttle'}
                          </span>
                          {activeDirection.arrivals[0].deck}
                        </span>

                        {activeDirection.arrivals[0].isWAB && (
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container text-text-secondary"
                            title="Wheelchair Accessible"
                          >
                            <span className="material-symbols-outlined text-[15px]">accessible</span>
                          </span>
                        )}
                      </div>

                      {/* Capacity Pill */}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-capacity-seats-bg text-tertiary flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-capacity-seats"></span>
                        {activeDirection.arrivals[0].load}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2nd Bus Card */}
                {activeDirection.arrivals[1] && (
                  <div className="bg-surface-card rounded-xl p-4.5 border border-border-subtle shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3">
                      <span className="text-xs uppercase font-bold tracking-wider text-text-secondary">
                        Following Bus (2nd)
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        Plate: {activeDirection.arrivals[1].plate}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 my-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight font-headline">
                        {activeDirection.arrivals[1].time}
                      </span>
                      <span className="text-sm font-semibold text-text-secondary">mins</span>
                    </div>

                    <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-surface-container font-semibold text-text-secondary text-[11px]"
                          title={`${activeDirection.arrivals[1].deck} Deck Bus`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {activeDirection.arrivals[1].deck === 'Double' ? 'directions_bus' : 'airport_shuttle'}
                          </span>
                          {activeDirection.arrivals[1].deck}
                        </span>

                        {activeDirection.arrivals[1].isWAB && (
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container text-text-secondary"
                            title="Wheelchair Accessible"
                          >
                            <span className="material-symbols-outlined text-[15px]">accessible</span>
                          </span>
                        )}
                      </div>

                      {/* Capacity Pill */}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-capacity-standing-bg text-secondary flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-capacity-standing"></span>
                        {activeDirection.arrivals[1].load}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3rd Bus Card */}
                {activeDirection.arrivals[2] && (
                  <div className="bg-surface-card rounded-xl p-4.5 border border-border-subtle shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3">
                      <span className="text-xs uppercase font-bold tracking-wider text-text-secondary">
                        Next Following (3rd)
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        Plate: {activeDirection.arrivals[2].plate}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 my-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight font-headline">
                        {activeDirection.arrivals[2].time}
                      </span>
                      <span className="text-sm font-semibold text-text-secondary">mins</span>
                    </div>

                    <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-surface-container font-semibold text-text-secondary text-[11px]"
                          title={`${activeDirection.arrivals[2].deck} Deck Bus`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {activeDirection.arrivals[2].deck === 'Double' ? 'directions_bus' : 'airport_shuttle'}
                          </span>
                          {activeDirection.arrivals[2].deck}
                        </span>

                        {activeDirection.arrivals[2].isWAB && (
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container text-text-secondary"
                            title="Wheelchair Accessible"
                          >
                            <span className="material-symbols-outlined text-[15px]">accessible</span>
                          </span>
                        )}
                      </div>

                      {/* Capacity Pill */}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-capacity-limited-bg text-error flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-capacity-limited"></span>
                        {activeDirection.arrivals[2].load}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Route Trajectory Step Progress */}
              <div className="bg-surface-card-subtle rounded-xl p-4 sm:p-5 space-y-3 border border-border-subtle">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 font-headline">
                    <span className="material-symbols-outlined text-primary text-[17px]">timeline</span>
                    Route Trajectory (Approaching Bugis Corridor)
                  </span>
                  <span className="text-text-muted font-medium">Real-time GPS telemetry from LTA DataMall</span>
                </div>

                {/* Horizontal Transit Stepper */}
                <div className="relative pt-6 pb-2 overflow-x-auto">
                  <div className="min-w-[580px] flex items-center justify-between relative px-4">
                    {/* Connecting Line */}
                    <div className="absolute left-6 right-6 top-3 h-1 bg-border-strong -translate-y-1/2 z-0"></div>
                    <div className="absolute left-6 w-[45%] top-3 h-1 bg-primary -translate-y-1/2 z-0"></div>

                    {/* Stop 1 (Passed) */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="text-[11px] font-bold text-text-primary mt-2">Opp Blk 461</span>
                      <span className="text-[10px] text-text-muted font-mono">01211</span>
                    </div>

                    {/* Bus in Transit Marker */}
                    <div className="absolute left-[38%] top-[-4px] -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
                      <div className="px-2 py-0.5 rounded bg-orange-action text-on-secondary text-[10px] font-extrabold shadow flex items-center gap-1 whitespace-nowrap">
                        <span className="material-symbols-outlined text-[12px]">directions_bus</span>
                        Bus {activeServiceData.serviceNo} (~250m)
                      </div>
                      <div className="w-2 h-2 bg-orange-action rotate-45 -mt-1"></div>
                    </div>

                    {/* Stop 2 (CURRENT ANCHOR) */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-7 h-7 rounded-full bg-live-emerald ring-4 ring-live-emerald-bg text-on-primary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-primary mt-1.5">
                        {currentStop.name}
                      </span>
                      <span className="text-[10px] text-text-secondary font-mono font-bold">
                        {currentStop.code} • Current
                      </span>
                    </div>

                    {/* Stop 3 (Next) */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-5 h-5 rounded-full bg-surface-card border-2 border-primary flex items-center justify-center"></div>
                      <span className="text-[11px] font-medium text-text-secondary mt-2.5">
                        Hotel Grand Pacific
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">01012</span>
                    </div>

                    {/* Stop 4 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-5 h-5 rounded-full bg-surface-card border-2 border-border-strong flex items-center justify-center"></div>
                      <span className="text-[11px] font-medium text-text-secondary mt-2.5">
                        Bras Basah Cplx
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">01019</span>
                    </div>

                    {/* Stop 5 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-5 h-5 rounded-full bg-surface-card border-2 border-border-strong flex items-center justify-center"></div>
                      <span className="text-[11px] font-medium text-text-secondary mt-2.5">
                        Cath of Good Shepherd
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">04151</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Map Drawer (Togglable) */}
            <RadarMapDrawer
              isOpen={isMapOpen}
              onClose={() => setIsMapOpen(false)}
              selectedStopCode={selectedStopCode}
              onSelectStop={(code) => {
                setSelectedStopCode(code);
                const st = BUS_STOPS[code];
                if (st && st.services.length > 0) {
                  setServiceQuery(st.services[0].serviceNo);
                }
              }}
              currentService={activeServiceData.serviceNo}
            />

            {/* 4 Nearby Bus Stops Radar List */}
            <div id="nearby-radar-section" className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary font-headline">
                    Nearby Bus Stops Radar
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Displaying live countdowns across all services at stops nearest to your GPS position
                  </p>
                </div>

                {/* Legend Indicator Pills */}
                <div className="hidden md:flex items-center gap-3 text-[11px] font-medium text-text-secondary bg-surface-card px-3 py-1.5 rounded-xl border border-border-subtle shadow-xs">
                  <span className="font-bold text-text-primary">Capacity:</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-capacity-seats"></span> Seats
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-capacity-standing"></span> Standing
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-capacity-limited"></span> Limited
                  </span>
                </div>
              </div>

              {/* Stop Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* STOP CARD 1: Opp Bugis Stn Exit C */}
                <div
                  className={`bg-surface-card rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4 border ${
                    selectedStopCode === '01112' ? 'border-l-4 border-l-primary border-primary/30' : 'border-border-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-text-primary font-headline">
                          Opp Bugis Stn Exit C
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-card-subtle font-mono text-xs font-semibold text-text-secondary">
                          01112
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">Victoria Street • 85m away (~1 min walk)</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStopCode('01112');
                        setServiceQuery('147');
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-light hover:bg-primary text-primary hover:text-on-primary text-xs font-bold transition cursor-pointer"
                      type="button"
                    >
                      Select
                    </button>
                  </div>

                  {/* Services Matrix at this stop */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {BUS_STOPS['01112'].services.map((svc) => (
                      <div
                        key={svc.serviceNo}
                        onClick={() => {
                          setSelectedStopCode('01112');
                          handleTrackService(svc.serviceNo);
                        }}
                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition ${
                          serviceQuery === svc.serviceNo && selectedStopCode === '01112'
                            ? 'bg-purple-light border border-primary/30 ring-1 ring-primary/20'
                            : 'bg-surface-card-subtle hover:bg-slate-200/70'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-primary text-sm">{svc.serviceNo}</span>
                          <span className="block text-[10px] text-text-muted">{svc.destination}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-extrabold flex items-center justify-end gap-1 ${
                              svc.loadType === 'seats'
                                ? 'text-live-emerald'
                                : svc.loadType === 'standing'
                                ? 'text-text-primary'
                                : 'text-text-primary'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                svc.loadType === 'seats'
                                  ? 'bg-capacity-seats'
                                  : svc.loadType === 'standing'
                                  ? 'bg-capacity-standing'
                                  : 'bg-capacity-limited'
                              }`}
                            ></span>
                            {svc.nextArrival}
                          </span>
                          <span className="text-[10px] text-text-secondary font-mono">{svc.following}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STOP CARD 2: Bugis Stn / Parkview Sq */}
                <div
                  className={`bg-surface-card rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4 border ${
                    selectedStopCode === '01139' ? 'border-l-4 border-l-primary border-primary/30' : 'border-border-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-text-primary font-headline">
                          Bugis Stn / Parkview Sq
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-card-subtle font-mono text-xs font-semibold text-text-secondary">
                          01139
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">North Bridge Road • 140m away (~2 mins walk)</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStopCode('01139');
                        setServiceQuery('7');
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-card-subtle hover:bg-primary text-on-surface hover:text-on-primary text-xs font-bold transition cursor-pointer"
                      type="button"
                    >
                      Select
                    </button>
                  </div>

                  {/* Services Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {BUS_STOPS['01139'].services.map((svc) => (
                      <div
                        key={svc.serviceNo}
                        onClick={() => {
                          setSelectedStopCode('01139');
                          handleTrackService(svc.serviceNo);
                        }}
                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition ${
                          serviceQuery === svc.serviceNo && selectedStopCode === '01139'
                            ? 'bg-purple-light border border-primary/30 ring-1 ring-primary/20'
                            : 'bg-surface-card-subtle hover:bg-slate-200/70'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-primary text-sm">{svc.serviceNo}</span>
                          <span className="block text-[10px] text-text-muted">{svc.destination}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-extrabold flex items-center justify-end gap-1 ${
                              svc.loadType === 'seats' ? 'text-live-emerald' : 'text-text-primary'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                svc.loadType === 'seats'
                                  ? 'bg-capacity-seats'
                                  : svc.loadType === 'standing'
                                  ? 'bg-capacity-standing'
                                  : 'bg-capacity-limited'
                              }`}
                            ></span>
                            {svc.nextArrival}
                          </span>
                          <span className="text-[10px] text-text-secondary font-mono">{svc.following}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STOP CARD 3: Bugis Stn Exit B */}
                <div
                  className={`bg-surface-card rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4 border ${
                    selectedStopCode === '01059' ? 'border-l-4 border-l-primary border-primary/30' : 'border-border-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-text-primary font-headline">
                          Bugis Stn Exit B
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-card-subtle font-mono text-xs font-semibold text-text-secondary">
                          01059
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">Victoria Street • 210m away (~3 mins walk)</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStopCode('01059');
                        setServiceQuery('190');
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-card-subtle hover:bg-primary text-on-surface hover:text-on-primary text-xs font-bold transition cursor-pointer"
                      type="button"
                    >
                      Select
                    </button>
                  </div>

                  {/* Services Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {BUS_STOPS['01059'].services.map((svc) => (
                      <div
                        key={svc.serviceNo}
                        onClick={() => {
                          setSelectedStopCode('01059');
                          handleTrackService(svc.serviceNo);
                        }}
                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition ${
                          serviceQuery === svc.serviceNo && selectedStopCode === '01059'
                            ? 'bg-purple-light border border-primary/30 ring-1 ring-primary/20'
                            : 'bg-surface-card-subtle hover:bg-slate-200/70'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-primary text-sm">{svc.serviceNo}</span>
                          <span className="block text-[10px] text-text-muted">{svc.destination}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-extrabold flex items-center justify-end gap-1 ${
                              svc.loadType === 'seats' ? 'text-live-emerald' : 'text-text-primary'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                svc.loadType === 'seats'
                                  ? 'bg-capacity-seats'
                                  : svc.loadType === 'standing'
                                  ? 'bg-capacity-standing'
                                  : 'bg-capacity-limited'
                              }`}
                            ></span>
                            {svc.nextArrival}
                          </span>
                          <span className="text-[10px] text-text-secondary font-mono">{svc.following}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STOP CARD 4: Bugis Stn Exit D */}
                <div
                  className={`bg-surface-card rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4 border ${
                    selectedStopCode === '01541' ? 'border-l-4 border-l-primary border-primary/30' : 'border-border-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-text-primary font-headline">
                          Bugis Stn Exit D
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-card-subtle font-mono text-xs font-semibold text-text-secondary">
                          01541
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">Rochor Road • 320m away (~4 mins walk)</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStopCode('01541');
                        setServiceQuery('851');
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-card-subtle hover:bg-primary text-on-surface hover:text-on-primary text-xs font-bold transition cursor-pointer"
                      type="button"
                    >
                      Select
                    </button>
                  </div>

                  {/* Services Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {BUS_STOPS['01541'].services.map((svc) => (
                      <div
                        key={svc.serviceNo}
                        onClick={() => {
                          setSelectedStopCode('01541');
                          handleTrackService(svc.serviceNo);
                        }}
                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition ${
                          serviceQuery === svc.serviceNo && selectedStopCode === '01541'
                            ? 'bg-purple-light border border-primary/30 ring-1 ring-primary/20'
                            : 'bg-surface-card-subtle hover:bg-slate-200/70'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-primary text-sm">{svc.serviceNo}</span>
                          <span className="block text-[10px] text-text-muted">{svc.destination}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-extrabold flex items-center justify-end gap-1 ${
                              svc.loadType === 'seats' ? 'text-live-emerald' : 'text-text-primary'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                svc.loadType === 'seats'
                                  ? 'bg-capacity-seats'
                                  : svc.loadType === 'standing'
                                  ? 'bg-capacity-standing'
                                  : 'bg-capacity-limited'
                              }`}
                            ></span>
                            {svc.nextArrival}
                          </span>
                          <span className="text-[10px] text-text-secondary font-mono">{svc.following}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Official Transit Advisory & What's New Feed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {/* Announcement Tile */}
              <div className="md:col-span-2 bg-surface-card rounded-2xl p-5 border border-border-subtle shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-action text-xl">campaign</span>
                    <h3 className="text-base font-bold text-text-primary font-headline">
                      Service Advisories &amp; What&apos;s New
                    </h3>
                  </div>
                  <span className="text-xs text-text-muted">Source: SBS Transit Operations Control</span>
                </div>

                <div className="space-y-3">
                  {SERVICE_ADVISORIES.slice(0, 2).map((adv) => (
                    <div
                      key={adv.id}
                      className="p-3.5 rounded-xl bg-surface-bright flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-border-subtle/50 hover:border-primary/20 transition"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-text-primary">
                          {adv.title}
                        </p>
                        <span className="text-xs text-text-muted">
                          Effective: {adv.effectiveDate} • {adv.area}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedAdvisory(adv)}
                        className="shrink-0 text-xs font-bold text-primary hover:text-orange-action flex items-center gap-1 cursor-pointer"
                        type="button"
                      >
                        Read More →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Accessibility & Fleet Card */}
              <div className="bg-surface-card rounded-2xl p-5 border border-border-subtle shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">
                      accessible_forward
                    </span>
                    <h4 className="text-base font-bold text-text-primary font-headline">
                      Fleet Accessibility
                    </h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    100% of SBS Transit scheduled trunk services (including Services 2, 7, 12, 14, and 147) are operated with Wheelchair Accessible Buses (WAB) with automated ramps.
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-2.5 py-1 rounded-md bg-purple-light text-primary text-xs font-bold">
                      WAB Certified
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-live-emerald-bg text-tertiary text-xs font-bold">
                      Euro VI Compliant
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle mt-4 flex items-center justify-between text-xs text-text-muted">
                  <span>Data timestamp:</span>
                  <span className="font-mono font-bold text-text-primary">{currentTimeStr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-10 border-t border-border-subtle mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border-subtle">
            <div className="md:col-span-1 space-y-3">
              <div className="h-8 w-28 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold text-base shadow-sm">
                SBS<span className="ml-1 text-orange-vibrant">Transit</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Singapore&apos;s leading public transport operator connecting communities via bus and rail networks with punctual, comfortable journeys.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3 font-headline">Transit Services</h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li>
                  <button
                    onClick={() => {
                      setSearchMode('service');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Bus Service Directory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsAlertsOpen(true)}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Downtown &amp; NEL Lines
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsRoutePlannerOpen(true)}
                    className="hover:text-primary transition-colors text-left"
                  >
                    First &amp; Last Train Timings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('nearby-radar-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Wheelchair Accessible Buses
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3 font-headline">Commuter Support</h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li>
                  <span className="block font-semibold text-on-surface">TransitLink / SBS Hotline</span>
                  <span className="text-sm text-primary font-bold">1800-287-2727</span>
                </li>
                <li className="pt-1">
                  <span className="block font-semibold text-on-surface">Feedback &amp; Lost Property</span>
                  <span>customercare@sbstransit.com.sg</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3 font-headline">Official Open Data</h4>
              <div className="bg-surface-card p-3.5 rounded-xl border border-border-subtle shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-secondary text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  LTA DataMall Compliant
                </div>
                <p className="text-[11px] text-text-muted leading-snug">
                  Dynamic bus arrival estimates and real-time passenger occupancy powered by Land Transport Authority Open Data API.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <div>© 2025–2026 SBS Transit Ltd. All rights reserved. Co. Reg. No. 199206653M</div>
            <div className="flex items-center gap-6">
              <span className="hover:text-primary transition-colors cursor-pointer">Terms of Use</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Cyber Security</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AiPilotModal
        isOpen={isAiPilotOpen}
        onClose={() => setIsAiPilotOpen(false)}
      />

      <RoutePlannerModal
        isOpen={isRoutePlannerOpen}
        onClose={() => setIsRoutePlannerOpen(false)}
        onTrackService={handleTrackService}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onSelectStop={(code) => setSelectedStopCode(code)}
        onSelectService={handleTrackService}
      />

      <ServiceAlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectAdvisory={(adv) => setSelectedAdvisory(adv)}
      />

      <AdvisoryDetailModal
        advisory={selectedAdvisory}
        onClose={() => setSelectedAdvisory(null)}
        onTrackService={handleTrackService}
      />
    </div>
  );
}
