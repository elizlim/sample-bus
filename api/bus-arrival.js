/**
 * LTA DataMall v3 BusArrival API Proxy Handler
 * Compatible with Vercel Serverless Functions (/api/bus-arrival) and local Express.
 *
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139&ServiceNo=15
 * Headers: AccountKey: <process.env.LTA_ACCOUNT_KEY>, accept: application/json
 */

export default async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract query params supporting both Express (req.query) and URL parsing
  let busStopCode = '';
  let serviceNo = '';

  if (req.query) {
    busStopCode = req.query.BusStopCode || req.query.busStopCode || '';
    serviceNo = req.query.ServiceNo || req.query.serviceNo || '';
  }

  if (!busStopCode && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      busStopCode = parsedUrl.searchParams.get('BusStopCode') || parsedUrl.searchParams.get('busStopCode') || '';
      serviceNo = parsedUrl.searchParams.get('ServiceNo') || parsedUrl.searchParams.get('serviceNo') || '';
    } catch {
      // ignore
    }
  }

  if (!busStopCode) {
    return res.status(400).json({
      error: 'Missing required query parameter: BusStopCode',
      usage: '/api/bus-arrival?BusStopCode=83139&ServiceNo=15'
    });
  }

  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY;

  // If LTA_ACCOUNT_KEY is configured in Vercel or .env, query official LTA DataMall
  if (ltaAccountKey && ltaAccountKey !== 'YOUR_LTA_ACCOUNT_KEY') {
    try {
      const ltaUrl = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
      ltaUrl.searchParams.set('BusStopCode', busStopCode);
      if (serviceNo) {
        ltaUrl.searchParams.set('ServiceNo', serviceNo);
      }

      const response = await fetch(ltaUrl.toString(), {
        headers: {
          AccountKey: ltaAccountKey,
          accept: 'application/json'
        },
        signal: AbortSignal.timeout(8000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `LTA DataMall responded with HTTP ${response.status}`,
          details: errorText,
          BusStopCode: busStopCode,
          Services: []
        });
      }

      const data = await response.json();

      // Return live LTA DataMall response with a 15-second cache header
      res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=5');
      return res.status(200).json(data);
    } catch (err) {
      console.error('LTA API fetch failed:', err);
      return res.status(502).json({
        error: 'Failed to fetch from LTA DataMall v3',
        message: err.message,
        fallbackNotice: 'Returning simulated fallback response',
        ...generateFallbackResponse(busStopCode, serviceNo)
      });
    }
  }

  // Fallback when LTA_ACCOUNT_KEY is not yet added in Vercel
  res.setHeader('Cache-Control', 'no-cache');
  const fallback = generateFallbackResponse(busStopCode, serviceNo);
  return res.status(200).json({
    ...fallback,
    _notice: 'LTA_ACCOUNT_KEY is not configured in Vercel environment variables. Showing simulated LTA DataMall v3 format. Add LTA_ACCOUNT_KEY in Vercel project settings to enable live production data.'
  });
}

/**
 * Generates realistic LTA DataMall v3 schema response for seamless fallback
 */
function generateFallbackResponse(busStopCode, serviceNo) {
  const now = Date.now();
  const makeArrival = (offsetMinutes, load = 'SEA', type = 'DD', feature = 'WAB') => {
    const arrivalDate = new Date(now + offsetMinutes * 60 * 1000);
    return {
      OriginCode: '10009',
      DestinationCode: '45009',
      EstimatedArrival: arrivalDate.toISOString(),
      Monitored: 1,
      Latitude: '1.30050',
      Longitude: '103.85600',
      VisitNumber: '1',
      Load: load,      // SEA = Seats Avail, SDA = Standing Avail, LSD = Limited Standing
      Feature: feature, // WAB = Wheelchair Accessible
      Type: type       // SD = Single Deck, DD = Double Deck, BD = Bendy
    };
  };

  const defaultServices = [
    {
      ServiceNo: '147',
      Operator: 'SBST',
      NextBus: makeArrival(0.5, 'SEA', 'DD'),
      NextBus2: makeArrival(8, 'SDA', 'SD'),
      NextBus3: makeArrival(18, 'LSD', 'DD')
    },
    {
      ServiceNo: '2',
      Operator: 'SBST',
      NextBus: makeArrival(4, 'SEA', 'SD'),
      NextBus2: makeArrival(14, 'SDA', 'DD'),
      NextBus3: makeArrival(26, 'SEA', 'DD')
    },
    {
      ServiceNo: '12',
      Operator: 'SBST',
      NextBus: makeArrival(7, 'SDA', 'DD'),
      NextBus2: makeArrival(19, 'LSD', 'DD'),
      NextBus3: makeArrival(29, 'SEA', 'SD')
    },
    {
      ServiceNo: '7',
      Operator: 'SBST',
      NextBus: makeArrival(1, 'SEA', 'DD'),
      NextBus2: makeArrival(9, 'SEA', 'DD'),
      NextBus3: makeArrival(19, 'SDA', 'SD')
    },
    {
      ServiceNo: '190',
      Operator: 'SMRT',
      NextBus: makeArrival(1, 'SEA', 'DD'),
      NextBus2: makeArrival(10, 'SDA', 'DD'),
      NextBus3: makeArrival(20, 'LSD', 'DD')
    }
  ];

  let filtered = defaultServices;
  if (serviceNo) {
    const matched = defaultServices.find((s) => s.ServiceNo === serviceNo);
    filtered = matched ? [matched] : [
      {
        ServiceNo: serviceNo,
        Operator: 'SBST',
        NextBus: makeArrival(2, 'SEA', 'DD'),
        NextBus2: makeArrival(11, 'SDA', 'DD'),
        NextBus3: makeArrival(22, 'SEA', 'SD')
      }
    ];
  }

  return {
    odata_metadata: 'https://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv3',
    BusStopCode: busStopCode,
    Services: filtered
  };
}
