import { ArrivalInfo } from '../data/transitData';

export interface LtaRawBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
}

export interface LtaRawService {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaRawBus;
  NextBus2?: LtaRawBus;
  NextBus3?: LtaRawBus;
}

export interface LtaBusArrivalResponse {
  BusStopCode: string;
  Services: LtaRawService[];
  _notice?: string;
  error?: string;
}

export function parseLtaBusArrival(bus?: LtaRawBus, defaultPlate = 'SBS3482D'): ArrivalInfo | null {
  if (!bus || !bus.EstimatedArrival) return null;

  const arrivalDate = new Date(bus.EstimatedArrival);
  const now = new Date();
  const diffMs = arrivalDate.getTime() - now.getTime();
  const minutesLeft = Math.max(0, Math.round(diffMs / 60000));

  const time = minutesLeft <= 1 ? 'Arr' : `${minutesLeft}`;
  const status = minutesLeft <= 1 ? 'Imminent' : minutesLeft <= 5 ? 'Approaching' : 'Normal';

  const loadType = bus.Load === 'SEA' ? 'seats' : bus.Load === 'SDA' ? 'standing' : 'limited';
  const load =
    bus.Load === 'SEA' ? 'Seats Avail' : bus.Load === 'SDA' ? 'Standing Avail' : 'Limited Standing';

  const deck = bus.Type === 'SD' ? 'Single' : 'Double';
  const isWAB = bus.Feature === 'WAB';

  return {
    time,
    minutesLeft,
    status,
    deck,
    isWAB,
    load,
    loadType,
    plate: defaultPlate
  };
}

/**
 * Fetch bus arrival information from the project's /api/bus-arrival endpoint.
 * This proxies directly to LTA DataMall v3:
 * https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=...&ServiceNo=...
 */
export async function fetchLtaBusArrival(
  busStopCode: string,
  serviceNo?: string
): Promise<LtaBusArrivalResponse | null> {
  try {
    const url = new URL('/api/bus-arrival', window.location.origin);
    url.searchParams.set('BusStopCode', busStopCode);
    if (serviceNo) {
      url.searchParams.set('ServiceNo', serviceNo);
    }

    const res = await fetch(url.toString(), {
      headers: {
        accept: 'application/json'
      }
    });

    if (!res.ok) {
      console.warn(`LTA API endpoint responded with status ${res.status}`);
      return null;
    }

    const data: LtaBusArrivalResponse = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching from /api/bus-arrival:', err);
    return null;
  }
}

/**
 * Monitor health status of the API and LTA DataMall key
 */
export async function checkApiHealth(): Promise<{
  ok: boolean;
  ltaAccountKeyConfigured?: boolean;
  timestamp?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return {
      ok: true,
      ltaAccountKeyConfigured: data.ltaDataMall?.accountKeyConfigured,
      timestamp: data.timestamp
    };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
