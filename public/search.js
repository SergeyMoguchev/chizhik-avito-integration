// /api/search.js - Vercel Serverless Function
const axios = require('axios');

// Границы регионов из chizhik.club
const REGION_BOUNDARIES = {
  moscow: { name: "Москва и область", bounds: [56.223, 28.319, 60.684, 33.680] },
  central: { name: "Центральная Россия", bounds: [52.491, 32.999, 66.229, 60.179] },
  krasnodar: { name: "Краснодарский край", bounds: [43.514, 38.382, 47.557, 40.008] },
  ural: { name: "Урал", bounds: [54.903, 60.003, 57.805, 66.221] },
  siberia: { name: "Сибирь", bounds: [54.483, 71.539, 56.974, 94.962] }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { region, filters, access_token } = req.body;

    if (!access_token) {
      return res.status(401).json({ 
        error: 'Access token required' 
      });
    }

    if (!region || !REGION_BOUNDARIES[region]) {
      return res.status(400).json({ 
        error: 'Invalid region specified' 
      });
    }

    // Получаем границы региона
    const regionData = REGION_BOUNDARIES[region];
    const [minLat, minLng, maxLat, maxLng] = regionData.bounds;

    // Пока что возвращаем моковые данные
    // В реальной версии здесь будет запрос к API Авито
    const mockResults = [
      {
        id: `${Date.now()}_1`,
        title: `Помещение под магазин в регионе ${regionData.name}`,
        price: Math.floor(Math.random() * 100000 + 80000),
        area: Math.floor(Math.random() * 100 + 60),
        location: `${regionData.name}, центр`,
        description: "Первый этаж, отдельный вход, высокая проходимость",
        phone: "+7 (xxx) xxx-xx-xx",
        region: region,
        coordinates: [
          minLat + Math.random() * (maxLat - minLat),
          minLng + Math.random() * (maxLng - minLng)
        ]
      }
    ];

    // Фильтрация по критериям Чижик
    const filteredResults = mockResults.filter(item => {
      if (filters.min_area && item.area < filters.min_area) return false;
      if (filters.max_area && item.area > filters.max_area) return false;
      if (filters.max_price && item.price > filters.max_price * item.area) return false;
      return true;
    });

    res.json({
      success: true,
      results: filteredResults,
      total_count: filteredResults.length,
      region: regionData.name,
      filters_applied: filters
    });

  } catch (error) {
    console.error('Search error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Search failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}