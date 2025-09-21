// api/health.js - Health Check endpoint
export default function handler(req, res) {
  // Добавляем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    services: {
      avito_api: process.env.AVITO_CLIENT_ID ? 'configured' : 'missing',
      avito_secret: process.env.AVITO_CLIENT_SECRET ? 'configured' : 'missing'
    },
    uptime: Math.floor(process.uptime() || 0),
    server_time: Date.now()
  };

  return res.status(200).json(health);
}