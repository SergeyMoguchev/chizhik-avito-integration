// api/search.js - Поиск во всех регионах присутствия сети Чижик
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
    const { region, filters, access_token, search_type } = req.body;

    if (!access_token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required. Use /api/auth first.'
      });
    }

    // Полная база всех регионов присутствия сети Чижик
    const ALL_CHIZHIK_REGIONS = {"moscow": {"name": "Московская область", "location_id": 621540, "priority": 1, "active_stores": 5, "federal_district": "Центральная Россия"}, "chelyabinsk": {"name": "Челябинская область", "location_id": 11225, "priority": 2, "active_stores": 5, "federal_district": "Урал"}, "saratov": {"name": "Саратовская область", "location_id": 10819, "priority": 3, "active_stores": 4, "federal_district": "Поволжье"}, "voronezh": {"name": "Воронежская область", "location_id": 10661, "priority": 4, "active_stores": 3, "federal_district": "Центральная Россия"}, "rostov": {"name": "Ростовская область", "location_id": 10800, "priority": 5, "active_stores": 2, "federal_district": "Юг России"}, "nizhny_novgorod": {"name": "Нижегородская область", "location_id": 10743, "priority": 6, "active_stores": 2, "federal_district": "Поволжье"}, "krasnodar": {"name": "Краснодарский край", "location_id": 10995, "priority": 7, "active_stores": 2, "federal_district": "Юг России"}, "kazan": {"name": "Республика Татарстан", "location_id": 10716, "priority": 8, "active_stores": 2, "federal_district": "Поволжье"}, "yaroslavl": {"name": "Ярославская область", "location_id": 10687, "priority": 9, "active_stores": 1, "federal_district": "Центральная Россия"}, "kaliningrad": {"name": "Калининградская область", "location_id": 22, "priority": 10, "active_stores": 1, "federal_district": "Северо-Запад"}, "ivanovo": {"name": "Ивановская область", "location_id": 10665, "priority": 11, "active_stores": 1, "federal_district": "Центральная Россия"}, "perm": {"name": "Пермский край", "location_id": 10779, "priority": 12, "active_stores": 1, "federal_district": "Урал"}, "stavropol": {"name": "Ставропольский край", "location_id": 11069, "priority": 13, "active_stores": 1, "federal_district": "Юг России"}, "adygea": {"name": "Республика Адыгея", "location_id": 10649, "priority": 14, "active_stores": 1, "federal_district": "Юг России"}, "ekaterinburg": {"name": "Свердловская область", "location_id": 11162, "priority": 15, "active_stores": 1, "federal_district": "Урал"}, "volgograd": {"name": "Волгоградская область", "location_id": 10660, "priority": 16, "active_stores": 1, "federal_district": "Поволжье"}, "ufa": {"name": "Республика Башкортостан", "location_id": 10650, "priority": 17, "active_stores": 1, "federal_district": "Поволжье"}, "penza": {"name": "Пензенская область", "location_id": 10776, "priority": 18, "active_stores": 1, "federal_district": "Поволжье"}, "kemerovo": {"name": "Кемеровская область", "location_id": 10716, "priority": 19, "active_stores": 1, "federal_district": "Сибирь"}};

    if (!region || !ALL_CHIZHIK_REGIONS[region]) {
      return res.status(400).json({
        success: false,
        error: 'Region not in Chizhik network. Available regions: ' + Object.keys(ALL_CHIZHIK_REGIONS).join(', '),
        available_regions: Object.keys(ALL_CHIZHIK_REGIONS)
      });
    }

    const regionData = ALL_CHIZHIK_REGIONS[region];

    // Генерация результатов с учетом приоритета и насыщенности региона
    const baseResultCount = regionData.priority <= 5 ? 
      Math.floor(Math.random() * 3) + 2 :  // Приоритетные: 2-4 результата
      Math.floor(Math.random() * 2) + 1;   // Остальные: 1-2 результата

    const networkResults = Array.from({length: baseResultCount}, (_, i) => {
      const area = Math.floor(Math.random() * 50) + 390; // 390-440 кв.м
      const pricePerSqm = Math.floor(Math.random() * 1000) + 1400; // 1400-2400 руб/кв.м
      const totalPrice = area * pricePerSqm;

      // Более высокий скор для приоритетных регионов
      const baseScore = regionData.priority <= 5 ? 85 : 75;
      const chizhikScore = Math.floor(Math.random() * 15) + baseScore;

      // Потенциал расширения зависит от приоритета
      const expansionPotential = regionData.priority <= 3 ? "высокий" :
                                regionData.priority <= 10 ? "средний" : "базовый";

      return {
        id: Date.now() + i,
        title: `Помещение ${area} кв.м в ${regionData.name} (приоритет ${regionData.priority})`,
        description: `Объект для расширения сети Чижик в регионе с ${regionData.active_stores} действующими магазинами. Федеральный округ: ${regionData.federal_district}`,
        price: {
          value: totalPrice,
          currency: "RUB"
        },
        location: {
          name: regionData.name,
          region_code: regionData.location_id,
          priority: regionData.priority,
          existing_stores: regionData.active_stores,
          federal_district: regionData.federal_district
        },
        params: {
          area: area,
          floor: "1",
          entrance: Math.random() > 0.2 ? "separate" : "shared", // 80% отдельный
          loading_zone: Math.random() > 0.15, // 85% с зоной разгрузки
          utilities: "full",
          electricity: Math.floor(Math.random() * 25) + 40, // 40-65 кВт
          single_level: Math.random() > 0.25, // 75% одноуровневые
          lease_term_available: Math.floor(Math.random() * 8) + 7, // 7-15 лет
          parking: Math.random() > 0.4 // 60% с парковкой
        },
        url: `https://www.avito.ru/item/${Date.now() + i}`,
        images: {
          main: `https://avatars.mds.yandex.net/get-avito/chizhik-${regionData.federal_district.toLowerCase().replace(/\s+/g, '_')}-${Math.floor(Math.random() * 10)}.jpg`
        },
        seller: {
          name: "Собственник коммерческой недвижимости",
          phone: "+7 (xxx) xxx-xx-xx",
          type: Math.random() > 0.6 ? "company" : "individual",
          verified: Math.random() > 0.3, // 70% верифицированы
          rating: Math.floor(Math.random() * 2) + 4 // 4-5 звезд
        },
        created_at: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        chizhik_compliance: {
          area_suitable: area >= 390 && area <= 420,
          single_level: Math.random() > 0.25,
          loading_zone: Math.random() > 0.15,
          utilities_complete: true,
          lease_term_ok: true,
          score: chizhikScore,
          expansion_potential: expansionPotential,
          regional_priority: regionData.priority
        }
      };
    });

    // Применяем фильтры
    const filteredResults = networkResults.filter(item => {
      const area = item.params?.area || 0;
      const pricePerSqm = item.price.value / area;

      if (filters?.min_area && area < filters.min_area) return false;
      if (filters?.max_area && area > filters.max_area) return false;
      if (filters?.max_price_per_sqm && pricePerSqm > filters.max_price_per_sqm) return false;

      // Специальные фильтры для сети
      if (filters?.chizhik_requirements?.single_level && !item.params.single_level) return false;
      if (filters?.chizhik_requirements?.loading_zone && !item.params.loading_zone) return false;

      return true;
    });

    return res.json({
      success: true,
      results: filteredResults,
      total_count: filteredResults.length,
      region: regionData.name,
      region_priority: regionData.priority,
      existing_stores: regionData.active_stores,
      federal_district: regionData.federal_district,
      filters_applied: filters || {},
      search_params: {
        location_id: regionData.location_id,
        category: "commercial_real_estate",
        type: "rent",
        search_type: search_type || "chizhik_complete_network",
        complete_network_coverage: true
      },
      network_info: {
        total_regions: Object.keys(ALL_CHIZHIK_REGIONS).length,
        search_region_priority: regionData.priority,
        expansion_potential: regionData.priority <= 3 ? "Высокий" : 
                            regionData.priority <= 10 ? "Средний" : "Базовый",
        current_presence: `${regionData.active_stores} магазинов в регионе`,
        federal_district: regionData.federal_district,
        priority_ranking: `${regionData.priority} место из ${Object.keys(ALL_CHIZHIK_REGIONS).length}`
      },
      chizhik_requirements: {
        min_area: 390,
        max_area: 420,
        trading_area: "250-280",
        utilities: "water, sewerage, heating",
        electricity: "40-50 kW",
        lease_term: "7+ years preferred",
        single_level_preferred: true,
        loading_zone_required: true
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