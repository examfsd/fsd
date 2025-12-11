const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register User
router.post('/register', async (req, res) => {
    const { username, email, password, location_lat, location_long } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        // Check if user exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, location_lat, location_long) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, location_lat || null, location_long || null]
        );

        // Generate Token
        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            id: result.insertId,
            username,
            email,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;