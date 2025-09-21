const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Авито API конфигурация
const AVITO_CONFIG = {
    client_id: process.env.AVITO_CLIENT_ID,
    client_secret: process.env.AVITO_CLIENT_SECRET,
    auth_url: 'https://api.avito.ru/token',
    base_url: 'https://api.avito.ru'
};

// Маршруты API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        config: {
            client_id: AVITO_CONFIG.client_id ? 'configured' : 'missing'
        }
    });
});

// OAuth авторизация
app.post('/api/auth', async (req, res) => {
    try {
        const axios = require('axios');

        const response = await axios.post(AVITO_CONFIG.auth_url, {
            grant_type: 'client_credentials',
            client_id: AVITO_CONFIG.client_id,
            client_secret: AVITO_CONFIG.client_secret,
            scope: 'public_profile,read,write'
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json({
            success: true,
            access_token: response.data.access_token,
            expires_in: response.data.expires_in
        });

    } catch (error) {
        console.error('Auth error:', error.response?.data || error.message);
        res.status(400).json({
            success: false,
            error: error.response?.data?.error_description || 'Authentication failed'
        });
    }
});

// Поиск объявлений
app.post('/api/search', async (req, res) => {
    try {
        const { region, filters, access_token } = req.body;

        // Здесь будет реальный запрос к API Авито
        // Пока возвращаем моковые данные
        const mockResults = [
            {
                id: "123456789",
                title: "Помещение под магазин, 85 кв.м",
                price: "120000",
                area: 85,
                location: "Москва, ул. Ленина, 15",
                region: region || "moscow"
            }
        ];

        res.json({
            success: true,
            results: mockResults,
            total_count: mockResults.length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Callback для OAuth
app.get('/callback', (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.redirect('/?error=' + encodeURIComponent(error));
    }

    if (code) {
        return res.redirect('/?code=' + encodeURIComponent(code));
    }

    res.redirect('/');
});

// Статические файлы
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Avito Client ID: ${AVITO_CONFIG.client_id ? 'configured' : 'missing'}`);
});

module.exports = app;