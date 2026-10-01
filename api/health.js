/**
 * Health check endpoint for monitoring API and LTA DataMall connectivity.
 * Compatible with Vercel Serverless Functions and local Express middleware.
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ltaKey = process.env.LTA_ACCOUNT_KEY || '';
  const isKeyConfigured = Boolean(ltaKey && ltaKey !== 'YOUR_LTA_ACCOUNT_KEY');

  const healthData = {
    status: 'ok',
    service: 'SBS Transit NextBus API Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: process.env.VERCEL ? 'vercel' : (process.env.NODE_ENV || 'development'),
    ltaDataMall: {
      accountKeyConfigured: isKeyConfigured,
      targetEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      status: isKeyConfigured ? 'ready' : 'key_missing (add LTA_ACCOUNT_KEY in Vercel environment variables)'
    },
    availableRoutes: [
      {
        path: '/api/health',
        description: 'Health and readiness probe'
      },
      {
        path: '/api/bus-arrival',
        description: 'LTA v3 real-time bus arrivals by BusStopCode and optional ServiceNo',
        example: '/api/bus-arrival?BusStopCode=83139&ServiceNo=15'
      }
    ]
  };

  // Optional live probe if testLta=true and key is set
  const url = req.url ? new URL(req.url, 'http://localhost') : null;
  const shouldTestLta = url?.searchParams?.get('testLta') === 'true';

  if (shouldTestLta && isKeyConfigured) {
    try {
      const probeRes = await fetch('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139', {
        headers: {
          AccountKey: ltaKey,
          accept: 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });
      healthData.ltaDataMall.liveProbe = {
        httpStatus: probeRes.status,
        ok: probeRes.ok
      };
    } catch (err) {
      healthData.ltaDataMall.liveProbe = {
        error: err.message,
        ok: false
      };
    }
  }

  return res.status(200).json(healthData);
}
