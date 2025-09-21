// /api/auth.js - Vercel Serverless Function
const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { AVITO_CLIENT_ID, AVITO_CLIENT_SECRET } = process.env;

    if (!AVITO_CLIENT_ID || !AVITO_CLIENT_SECRET) {
      return res.status(500).json({ 
        error: 'API credentials not configured' 
      });
    }

    const response = await axios.post('https://api.avito.ru/token', {
      grant_type: 'client_credentials',
      client_id: AVITO_CLIENT_ID,
      client_secret: AVITO_CLIENT_SECRET,
      scope: 'public_profile,read,write'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000
    });

    res.json({
      success: true,
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
      token_type: response.data.token_type
    });

  } catch (error) {
    console.error('Auth error:', error.response?.data || error.message);

    res.status(400).json({
      success: false,
      error: error.response?.data?.error_description || 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}