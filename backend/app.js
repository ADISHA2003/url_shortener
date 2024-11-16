const express = require('express');
const cors = require('cors');
const pool = require('./db');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from Netlify frontend
const allowedOrigins = ['https://url2003.netlify.app'];  // Your frontend URL on Netlify
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Generate a short code
function generateShortCode() {
    return crypto.randomBytes(4).toString('hex');
}

// Endpoint to shorten URL
app.post('/api/shorten', async (req, res) => {
    try {
        const { longUrl } = req.body;

        const shortCode = generateShortCode();
        await pool.query('INSERT INTO urls (long_url, short_code) VALUES ($1, $2)', [longUrl, shortCode]);

        // Use the backend URL for production in the shortened URL
        const shortUrl = `https://url2003.vercel.app/r/${shortCode}`;
        res.json({ success: true, shortUrl });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to redirect
app.get('/r/:shortCode', async (req, res) => {
    try {
        const { shortCode } = req.params;

        const result = await pool.query('SELECT long_url FROM urls WHERE short_code = $1', [shortCode]);
        if (result.rows.length > 0) {
            res.redirect(result.rows[0].long_url);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.PORT || `http://localhost:${PORT}`}`);
});
