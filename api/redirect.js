// api/r/[shortCode].js
const pool = require('../../db/pool');  // Database connection

module.exports = async (req, res) => {
    try {
        const { shortCode } = req.query;  // Get short code from URL

        // Fetch the long URL from the database using the short code
        const result = await pool.query('SELECT long_url FROM urls WHERE short_code = $1', [shortCode]);

        if (result.rows.length > 0) {
            // Redirect to the long URL
            res.redirect(result.rows[0].long_url);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (err) {
        console.error('Error in redirect:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};
