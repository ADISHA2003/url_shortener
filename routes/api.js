// api.js
const express = require('express');
const pool = require('../db/pool');
const crypto = require('crypto');

const router = express.Router();

// Generate a short code
function generateShortCode() {
    return crypto.randomBytes(4).toString('hex');
}

// Simple URL validation function
function isValidUrl(url) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i; // Simple URL validation pattern
    return urlPattern.test(url);
}

// Endpoint to shorten URL
router.post('/shorten', async (req, res) => {
    try {
        const { longUrl } = req.body;

        // Validate the long URL
        if (!longUrl || !isValidUrl(longUrl)) {
            return res.status(400).json({ error: 'Invalid or missing URL' });
        }

        const shortCode = generateShortCode();
        
        // Insert long URL and short code into the database
        await pool.query('INSERT INTO urls (long_url, short_code) VALUES ($1, $2)', [longUrl, shortCode]);

        // Hardcoded base URL for production
        const baseUrl = 'https://url2003.vercel.app';

        console.log('Shortened URL:', `${baseUrl}/api/r/${shortCode}`); // Debugging line

        // Send back the short URL
        res.json({ shortUrl: `${baseUrl}/api/r/${shortCode}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to redirect
router.get('/r/:shortCode', async (req, res) => {
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

module.exports = router;
