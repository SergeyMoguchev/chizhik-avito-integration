// api/auth.js - Avito API OAuth2 Authentication
export default async function handler(req, res) {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { AVITO_CLIENT_ID, AVITO_CLIENT_SECRET } = process.env;

    if (!AVITO_CLIENT_ID || !AVITO_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'API credentials not configured',
        details: 'AVITO_CLIENT_ID and AVITO_CLIENT_SECRET required'
      });
    }

    // Авито API OAuth2 endpoint
    const tokenUrl = 'https://api.avito.ru/token';

    // Подготавливаем данные для application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', AVITO_CLIENT_ID);
    formData.append('client_secret', AVITO_CLIENT_SECRET);
    formData.append('scope', 'public_profile,items:read,items:write');

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Chizhik-Integration/1.0'
      },
      body: formData.toString(),
      timeout: 15000
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Avito API auth error:', response.status, errorText);

      return res.status(response.status).json({
        success: false,
        error: 'Avito API authentication failed',
        status: response.status,
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      });
    }

    const data = await response.json();

    return res.json({
      success: true,
      access_token: data.access_token,
      token_type: data.token_type || 'Bearer',
      expires_in: data.expires_in || 3600,
      scope: data.scope,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Auth endpoint error:', error);

    return res.status(500).json({
      success: false,
      error: 'Authentication request failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}