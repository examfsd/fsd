const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Route Imports
const authRoutes = require('./routes/auth');
const memeRoutes = require('./routes/memes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Serve static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/memes', memeRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('GrokMemeHub API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});