// api/r/[shortCode].js
const pool = require('../../db/pool');  // Database connection

module.exports = async (req, res) => {
    try {
        const { shortCode } = req.params;  // Access shortCode from URL parameters
        const result = await pool.query('SELECT long_url FROM urls WHERE short_code = $1', [shortCode]);

        if (result.rows.length > 0) {
            res.redirect(result.rows[0].long_url);  // Redirect to the long URL
        } else {
            res.status(404).send('URL not found');  // Return 404 if shortCode doesn't exist
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};
