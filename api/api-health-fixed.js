// api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    services: {
      avito_api: process.env.AVITO_CLIENT_ID ? 'configured' : 'missing'
    }
  });
}