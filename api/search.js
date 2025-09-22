// api/search.js - ОКОНЧАТЕЛЬНО ИСПРАВЛЕННАЯ версия
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

    // API ключи Яндекс карт
    const YANDEX_API_KEYS = {
      javascript_geocoder: "a02e9c35-dadf-4b17-903a-4893c30c8b3e",
      tiles: "37d973f4-24d9-45f9-aef5-1745f7a13e1d"
    };

    // Полный список регионов с поддержкой "all_regions"
    const CHIZHIK_REGIONS = {
      // Специальный регион для "ВСЕ РЕГИОНЫ"
      "all_regions": {
        "name": "Все регионы России",
        "coords": [55.7558, 37.6176],
        "zoom": 3
      },
      // Центральная Россия
      "moscow": {
        "name": "Москва и Московская область", 
        "coords": [55.7558, 37.6176], 
        "avito_region": "moskva"
      },
      "voronezh": {
        "name": "Воронежская область", 
        "coords": [51.6720, 39.1843], 
        "avito_region": "voronezhskaya_oblast"
      },
      "yaroslavl": {
        "name": "Ярославская область", 
        "coords": [57.6261, 39.8845], 
        "avito_region": "yaroslavskaya_oblast"
      },
      "ivanovo": {
        "name": "Ивановская область", 
        "coords": [57.0000, 41.0000], 
        "avito_region": "ivanovskaya_oblast"
      },
      "vladimir": {
        "name": "Владимирская область", 
        "coords": [56.1366, 40.3966], 
        "avito_region": "vladimirskaya_oblast"
      },
      "tula": {
        "name": "Тульская область", 
        "coords": [54.1961, 37.6182], 
        "avito_region": "tulskaya_oblast"
      },
      "tver": {
        "name": "Тверская область", 
        "coords": [56.8587, 35.9176], 
        "avito_region": "tverskaya_oblast"
      },
      "ryazan": {
        "name": "Рязанская область", 
        "coords": [54.6269, 39.6916], 
        "avito_region": "ryazanskaya_oblast"
      },
      "kaluga": {
        "name": "Калужская область", 
        "coords": [54.5293, 36.2754], 
        "avito_region": "kaluzhskaya_oblast"
      },
      "belgorod": {
        "name": "Белгородская область", 
        "coords": [50.5950, 36.5870], 
        "avito_region": "belgorodskaya_oblast"
      },
      // Поволжье
      "saratov": {
        "name": "Саратовская область", 
        "coords": [51.5924, 46.0037], 
        "avito_region": "saratovskaya_oblast"
      },
      "nizhny_novgorod": {
        "name": "Нижегородская область", 
        "coords": [56.2965, 43.9361], 
        "avito_region": "nizhegorodskaya_oblast"
      },
      "kazan": {
        "name": "Республика Татарстан", 
        "coords": [55.8304, 49.0661], 
        "avito_region": "tatarstan"
      },
      "samara": {
        "name": "Самарская область", 
        "coords": [53.2001, 50.1500], 
        "avito_region": "samarskaya_oblast"
      },
      "volgograd": {
        "name": "Волгоградская область", 
        "coords": [48.7080, 44.5133], 
        "avito_region": "volgogradskaya_oblast"
      },
      "ufa": {
        "name": "Республика Башкортостан", 
        "coords": [54.7388, 55.9721], 
        "avito_region": "bashkortostan"
      },
      "penza": {
        "name": "Пензенская область", 
        "coords": [53.2007, 45.0000], 
        "avito_region": "penzenskaya_oblast"
      },
      "orenburg": {
        "name": "Оренбургская область", 
        "coords": [51.7727, 55.0988], 
        "avito_region": "orenburgskaya_oblast"
      },
      // Урал
      "chelyabinsk": {
        "name": "Челябинская область", 
        "coords": [55.1644, 61.4368], 
        "avito_region": "chelyabinskaya_oblast"
      },
      "ekaterinburg": {
        "name": "Свердловская область", 
        "coords": [56.8431, 60.6454], 
        "avito_region": "sverdlovskaya_oblast"
      },
      "perm": {
        "name": "Пермский край", 
        "coords": [58.0105, 56.2502], 
        "avito_region": "permskiy_kray"
      },
      "kurgan": {
        "name": "Курганская область", 
        "coords": [55.4500, 65.3333], 
        "avito_region": "kurganskaya_oblast"
      },
      // Юг России
      "rostov": {
        "name": "Ростовская область", 
        "coords": [47.2357, 39.7015], 
        "avito_region": "rostovskaya_oblast"
      },
      "krasnodar": {
        "name": "Краснодарский край", 
        "coords": [45.0448, 38.9760], 
        "avito_region": "krasnodarskiy_kray"
      },
      "stavropol": {
        "name": "Ставропольский край", 
        "coords": [45.0428, 41.9734], 
        "avito_region": "stavropolskiy_kray"
      },
      "astrakhan": {
        "name": "Астраханская область", 
        "coords": [46.3497, 48.0408], 
        "avito_region": "astrakhanskaya_oblast"
      },
      // Сибирь
      "novosibirsk": {
        "name": "Новосибирская область", 
        "coords": [55.0084, 82.9357], 
        "avito_region": "novosibirskaya_oblast"
      },
      "kemerovo": {
        "name": "Кемеровская область", 
        "coords": [55.3331, 86.0833], 
        "avito_region": "kemerovskaya_oblast"
      },
      "omsk": {
        "name": "Омская область", 
        "coords": [54.9885, 73.3242], 
        "avito_region": "omskaya_oblast"
      },
      "tomsk": {
        "name": "Томская область", 
        "coords": [56.5000, 84.9667], 
        "avito_region": "tomskaya_oblast"
      },
      // Северо-Запад
      "spb": {
        "name": "Санкт-Петербург и ЛО", 
        "coords": [59.9311, 30.3609], 
        "avito_region": "sankt-peterburg"
      },
      "kaliningrad": {
        "name": "Калининградская область", 
        "coords": [54.7065, 20.5110], 
        "avito_region": "kaliningradskaya_oblast"
      },
      "arkhangelsk": {
        "name": "Архангельская область", 
        "coords": [64.5401, 40.5433], 
        "avito_region": "arkhangelskaya_oblast"
      },
      "murmansk": {
        "name": "Мурманская область", 
        "coords": [68.9585, 33.0827], 
        "avito_region": "murmanskaya_oblast"
      }
    };

    if (!region || !CHIZHIK_REGIONS[region]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid region. Available regions: ' + Object.keys(CHIZHIK_REGIONS).join(', ')
      });
    }

    const regionData = CHIZHIK_REGIONS[region];

    console.log(`Searching in region: ${region} (${regionData.name})`);
    console.log('Search filters:', JSON.stringify(filters, null, 2));

    // ВАЖНО: Avito НЕ предоставляет публичное API для поиска!
    // Генерируем реалистичные демо-данные на основе фильтров
    const demoResults = generateRealisticResults(region, filters, regionData);

    return res.json({
      success: true,
      results: demoResults,
      total_count: demoResults.length,
      region: regionData.name,
      search_source: "realistic_demo", 
      info_message: "Демонстрационные данные на основе реальных критериев поиска",
      explanation: "Avito не предоставляет публичное API для поиска объявлений. Показываются реалистичные примеры.",
      suggestion: `Для реального поиска посетите: https://www.avito.ru/${regionData.avito_region}/kommercheskaya_nedvizhimost/prodam`,
      yandex_api_status: {
        javascript_geocoder_key: YANDEX_API_KEYS.javascript_geocoder,
        tiles_api_key: YANDEX_API_KEYS.tiles,
        maps_integration: "active"
      },
      filters_applied: filters || {},
      search_params: {
        region: region,
        search_type: search_type || "demo_search",
        avito_limitation: "No public search API available"
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

// Функция генерации реалистичных демо-данных
function generateRealisticResults(region, filters, regionData) {
  // База данных реалистичных объявлений
  const realisticListings = [
    {
      title: "Торговое помещение в центре города",
      base_price: 45000000,
      base_area: 420,
      description: "Отдельно стоящее здание, первый этаж, отдельный вход, парковка",
      seller_type: "Собственник",
      features: ["Отдельный вход", "Парковка", "Центр города", "Первый этаж"]
    },
    {
      title: "Коммерческое помещение в бизнес-центре",
      base_price: 38000000,
      base_area: 580,
      description: "Помещение в современном бизнес-центре, высокие потолки, кондиционер",
      seller_type: "Агентство",
      features: ["Бизнес-центр", "Кондиционер", "Высокие потолки", "Охрана"]
    },
    {
      title: "Производственно-складское помещение",
      base_price: 25000000,
      base_area: 750,
      description: "Склад с офисной частью, удобная логистика, разгрузочная зона",
      seller_type: "Собственник",
      features: ["Разгрузочная зона", "Склад", "Офисная часть", "Хорошая логистика"]
    },
    {
      title: "Помещение под магазин продуктов",
      base_price: 32000000,
      base_area: 450,
      description: "Готово под продуктовый магазин, все коммуникации, торговое оборудование",
      seller_type: "Агентство", 
      features: ["Под продукты", "Торговое оборудование", "Все коммуникации", "Готово к работе"]
    },
    {
      title: "Торговый павильон в спальном районе",
      base_price: 28000000,
      base_area: 390,
      description: "Угловое расположение, высокая проходимость, рядом остановка транспорта",
      seller_type: "Собственник",
      features: ["Угловое", "Высокая проходимость", "Остановка рядом", "Спальный район"]
    },
    {
      title: "Помещение в торговом центре",
      base_price: 55000000,
      base_area: 520,
      description: "Помещение в работающем ТЦ, высокий трафик покупателей, арендаторы",
      seller_type: "Управляющая компания",
      features: ["Торговый центр", "Высокий трафик", "Арендаторы", "Работающий ТЦ"]
    }
  ];

  // Фильтрация по критериям
  let filtered = realisticListings.filter(item => {
    // Фильтр по минимальной площади
    if (filters?.min_area && item.base_area < filters.min_area) return false;
    // Фильтр по максимальной площади
    if (filters?.max_area && item.base_area > filters.max_area) return false;
    // Фильтр по максимальной цене
    if (filters?.max_price && item.base_price > filters.max_price) return false;
    return true;
  });

  // Если после фильтрации пусто, возвращаем хотя бы один результат
  if (filtered.length === 0 && realisticListings.length > 0) {
    filtered = [realisticListings[0]];
  }

  // Ограничиваем количество результатов
  const maxResults = region === 'all_regions' ? 6 : Math.min(filtered.length, 4);
  filtered = filtered.slice(0, maxResults);

  // Адаптируем под выбранный регион
  return filtered.map((item, index) => {
    // Коэффициенты цен по регионам
    const priceCoeff = getPriceCoefficient(region);
    const adjustedPrice = Math.round(item.base_price * priceCoeff);

    // Случайные вариации площади (±10%)
    const areaVariation = 0.9 + Math.random() * 0.2;
    const adjustedArea = Math.round(item.base_area * areaVariation);

    return {
      id: `demo_${region}_${Date.now()}_${index}`,
      title: item.title,
      description: item.description,
      price: {
        value: adjustedPrice,
        currency: "RUB"
      },
      address: `${regionData.name}, ${getRandomAddress(region)}`,
      area: adjustedArea,
      floor: Math.random() > 0.7 ? '2' : '1',
      url: `https://www.avito.ru/${regionData.avito_region}/kommercheskaya_nedvizhimost/prodam/pomeschenie-demo-${Date.now()}_${index}`,
      images: null,
      seller_type: item.seller_type,
      created_at: getRandomRecentDate(),
      coordinates: {
        lat: regionData.coords[0] + (Math.random() - 0.5) * 0.05,
        lon: regionData.coords[1] + (Math.random() - 0.5) * 0.05
      },
      features: item.features,
      is_real: false,
      is_demo: true,
      demo_note: "Реалистичный пример на основе типичных предложений"
    };
  });
}

// Коэффициенты цен по регионам
function getPriceCoefficient(region) {
  const coefficients = {
    'moscow': 1.0,
    'spb': 0.7,
    'ekaterinburg': 0.4,
    'novosibirsk': 0.35,
    'kazan': 0.4,
    'samara': 0.35,
    'rostov': 0.3,
    'krasnodar': 0.35,
    'voronezh': 0.25,
    'yaroslavl': 0.3,
    'all_regions': 0.6
  };

  return coefficients[region] || 0.3;
}

// Генерация случайных адресов
function getRandomAddress(region) {
  const addresses = {
    'moscow': ['ул. Тверская', 'пр-т Мира', 'ул. Арбат', 'Садовое кольцо', 'МКАД'],
    'spb': ['Невский проспект', 'ул. Рубинштейна', 'Московский пр-т', 'Васильевский остров'],
    'ekaterinburg': ['ул. Ленина', 'ул. Малышева', 'ул. 8 Марта', 'Центр'],
    'default': ['центральная часть', 'деловой район', 'промышленная зона', 'спальный район']
  };

  const regionAddresses = addresses[region] || addresses['default'];
  return regionAddresses[Math.floor(Math.random() * regionAddresses.length)];
}

// Генерация случайной даты (последние 30 дней)
function getRandomRecentDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
}