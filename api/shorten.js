// api/shorten.js
const pool = require('../db/pool');  // Database connection
const crypto = require('crypto');

// Generate a short code
function generateShortCode() {
    return crypto.randomBytes(4).toString('hex');
}

// Simple URL validation function
function isValidUrl(url) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
}

// Serverless function handler
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { longUrl } = req.body;

            // Validate the long URL
            if (!longUrl || !isValidUrl(longUrl)) {
                return res.status(400).json({ error: 'Invalid or missing URL' });
            }

            const shortCode = generateShortCode();

            // Insert long URL and short code into the database
            await pool.query('INSERT INTO urls (long_url, short_code) VALUES ($1, $2)', [longUrl, shortCode]);

            const baseUrl = 'https://url2003.vercel.app';

            // Send back the short URL
            res.json({ shortUrl: `${baseUrl}/api/r/${shortCode}` });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
