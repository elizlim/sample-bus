import React, { useState, useEffect } from 'react';

interface ApiHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ isOpen, onClose, initialData }) => {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [busArrivalSample, setBusArrivalSample] = useState<any>(null);
  const [sampleLoading, setSampleLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health?testLta=true');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setData({ status: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const testBusArrival = async () => {
    setSampleLoading(true);
    try {
      const res = await fetch('/api/bus-arrival?BusStopCode=83139&ServiceNo=15');
      const json = await res.json();
      setBusArrivalSample(json);
    } catch (err: any) {
      setBusArrivalSample({ error: err.message });
    } finally {
      setSampleLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
      testBusArrival();
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
          <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
          <h2 className="text-xl font-extrabold text-primary font-headline">API Health &amp; Endpoints Monitor</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Monitor your deployed Serverless Functions in <code>/api</code> and Land Transport Authority (LTA) DataMall v3 integration status.
        </p>

        {/* Server & Key Status Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="p-3.5 rounded-xl bg-surface-card-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-text-secondary uppercase">API Gateway</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${data?.status === 'ok' ? 'bg-live-emerald animate-ping' : 'bg-red-500'}`}></span>
              <span className="text-sm font-bold text-text-primary uppercase">
                {loading ? 'Checking...' : data?.status === 'ok' ? 'ONLINE (200)' : 'UNREACHABLE'}
              </span>
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              Uptime: {data?.uptimeSeconds ? `${data.uptimeSeconds}s` : 'active'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-card-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-text-secondary uppercase">LTA_ACCOUNT_KEY</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${data?.ltaDataMall?.accountKeyConfigured ? 'bg-live-emerald' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-bold text-text-primary">
                {data?.ltaDataMall?.accountKeyConfigured ? 'Configured' : 'Missing in Env'}
              </span>
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              {data?.ltaDataMall?.accountKeyConfigured ? 'Real LTA API Active' : 'Simulated fallback active'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-card-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Refresh Rate</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-bold text-primary font-headline">20 Seconds</span>
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              LTA v3 standard
            </span>
          </div>
        </div>

        {/* How to configure Vercel key */}
        {!data?.ltaDataMall?.accountKeyConfigured && (
          <div className="bg-purple-light/70 border border-primary/20 p-4 rounded-xl text-xs space-y-1.5 mb-5">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>How to add your LTA_ACCOUNT_KEY in Vercel</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              1. Open your project on Vercel Dashboard → <strong>Settings</strong> → <strong>Environment Variables</strong>.<br />
              2. Add Key: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-primary">LTA_ACCOUNT_KEY</code> and paste your DataMall Account Key as the value.<br />
              3. Redeploy your app. The API proxy at <code>/api/bus-arrival</code> will immediately connect to official LTA production streams.
            </p>
          </div>
        )}

        {/* Endpoint live test */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Endpoint Response Preview (/api/bus-arrival?BusStopCode=83139&amp;ServiceNo=15)
            </span>
            <button
              onClick={testBusArrival}
              disabled={sampleLoading}
              className="text-xs font-bold text-primary hover:text-orange-action flex items-center gap-1 cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[15px] ${sampleLoading ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>Re-test Endpoint</span>
            </button>
          </div>

          <div className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto max-h-52 border border-slate-800">
            {sampleLoading ? (
              <span className="text-slate-400">Pinging endpoint...</span>
            ) : (
              <pre>{JSON.stringify(busArrivalSample, null, 2)}</pre>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center pt-2 border-t border-border-subtle">
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-surface-card-subtle hover:bg-slate-200 text-text-primary text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Check Health Again</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold transition hover:bg-purple-deep cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
