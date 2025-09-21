// /api/health.js - Vercel Serverless Function
export default function handler(req, res) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      avito_api: process.env.AVITO_CLIENT_ID ? 'configured' : 'missing',
      database: 'not_required',
      cache: 'not_required'
    },
    uptime: process.uptime ? Math.floor(process.uptime()) : 0
  };

  res.status(200).json(health);
}