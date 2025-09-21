// api/search.js - Avito Items Search API
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
    const { region, filters, access_token } = req.body;

    if (!access_token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required. Use /api/auth first.'
      });
    }

    // Границы регионов для поиска Чижик
    const REGION_BOUNDARIES = {
      moscow: { 
        name: "Москва и область", 
        location_id: 621540, // ID Москвы в Авито
        bounds: [55.142, 36.803, 56.021, 38.967]
      },
      spb: { 
        name: "Санкт-Петербург", 
        location_id: 653240,
        bounds: [59.651, 29.430, 60.165, 30.708]
      },
      ekaterinburg: { 
        name: "Екатеринбург", 
        location_id: 634350,
        bounds: [56.650, 60.316, 56.946, 60.728]
      }
    };

    if (!region || !REGION_BOUNDARIES[region]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid region. Available: moscow, spb, ekaterinburg'
      });
    }

    const regionData = REGION_BOUNDARIES[region];

    // Пример поиска через Avito API (базовая версия)
    // В реальной версии здесь будет запрос к https://api.avito.ru/items/search

    // Моковые данные соответствующие структуре Avito API
    const mockResults = [
      {
        id: Date.now(),
        title: `Помещение под магазин в районе ${regionData.name}`,
        description: "Первый этаж, отдельный вход, высокая проходимость",
        price: {
          value: Math.floor(Math.random() * 50000 + 80000),
          currency: "RUB"
        },
        location: {
          name: regionData.name,
          latitude: regionData.bounds[0] + Math.random() * (regionData.bounds[2] - regionData.bounds[0]),
          longitude: regionData.bounds[1] + Math.random() * (regionData.bounds[3] - regionData.bounds[1])
        },
        params: {
          area: Math.floor(Math.random() * 100 + 60),
          floor: "1",
          entrance: "separate"
        },
        url: `https://avito.ru/item/${Date.now()}`,
        images: {
          main: `https://avatars.mds.yandex.net/get-avito/sample${Math.floor(Math.random() * 10)}.jpg`
        },
        seller: {
          name: "Владелец помещения",
          phone: "+7 (xxx) xxx-xx-xx"
        },
        created_at: new Date().toISOString(),
        is_active: true
      }
    ];

    // Применяем фильтры Чижик
    const filteredResults = mockResults.filter(item => {
      const area = item.params?.area || 0;
      const pricePerSqm = item.price.value / area;

      if (filters?.min_area && area < filters.min_area) return false;
      if (filters?.max_area && area > filters.max_area) return false;
      if (filters?.max_price_per_sqm && pricePerSqm > filters.max_price_per_sqm) return false;

      return true;
    });

    return res.json({
      success: true,
      results: filteredResults,
      total_count: filteredResults.length,
      region: regionData.name,
      filters_applied: filters || {},
      search_params: {
        location_id: regionData.location_id,
        category: "commercial_real_estate",
        type: "rent"
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search endpoint error:', error);

    return res.status(500).json({
      success: false,
      error: 'Search request failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}