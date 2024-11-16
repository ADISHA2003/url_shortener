// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Use API Routes
app.use('/api', apiRoutes);

// Serve frontend (index.html) for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
