// api/search.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { region, filters } = req.body;

    // Тестовые данные для демонстрации
    const mockResults = [
      {
        id: "123456789",
        title: `Помещение под магазин в регионе ${region || 'Москва'}`,
        price: "120000",
        area: 85,
        location: "Москва, ул. Ленина, 15",
        description: "Первый этаж, отдельный вход"
      }
    ];

    res.json({
      success: true,
      results: mockResults,
      total_count: mockResults.length,
      region: region,
      filters_applied: filters
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}