const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET all memes (Search, Filter, Sort)
router.get('/', async (req, res) => {
    const { search, category, sort } = req.query;
    let query = `
        SELECT m.*, u.username, 
        (SELECT COUNT(*) FROM reactions r WHEREVr.meme_id = m.id) as reaction_count
        FROM memes m
        JOIN users u ON m.uploader_id = u.id
        WHERE 1=1
    `;
    const params = [];

    // Search Filter
    if (search) {
        query += ` AND (m.title LIKE ? OR m.caption LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    // Category Filter
    if (category) {
        query += ` AND m.category = ?`;
        params.push(category);
    }

    // Sort (Trending or Newest)
    if (sort === 'trending') {
        query += ` ORDER BY reaction_count DESC`;
    } else {
        query += ` ORDER BY m.created_at DESC`; // Default
    }

    try {
        const [memes] = await db.query(query, params);
        res.json(memes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST Upload Meme (Protected)
router.post('/', protect, upload.single('image'), async (req, res) => {
    const { title, caption, category } = req.body;
    // req.file.path contains the image location
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    
    // Normalize path for Windows/Unix compatibility for URL
    const image_url = req.file.path.replace(/\\/g, "/"); 

    try {
        const [result] = await db.query(
            'INSERT INTO memes (title, caption, image_url, category, uploader_id) VALUES (?, ?, ?, ?, ?)',
            [title, caption, image_url, category, req.user.id]
        );
        res.status(201).json({ id: result.insertId, title, image_url });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading meme' });
    }
});

// DELETE Meme (Protected & Ownership Check)
router.delete('/:id', protect, async (req, res) => {
    try {
        const [meme] = await db.query('SELECT * FROM memes WHERE id = ?', [req.params.id]);
        
        if (meme.length === 0) return res.status(404).json({ message: 'Meme not found' });
        if (meme[0].uploader_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

        await db.query('DELETE FROM memes WHERE id = ?', [req.params.id]);
        res.json({ message: 'Meme removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST Reaction (Protected)
router.post('/reaction', protect, async (req, res) => {
    const { meme_id, reaction_type } = req.body; // e.g., 'laugh'

    try {
        // Check if already reacted
        const [existing] = await db.query(
            'SELECT * FROM reactions WHERE meme_id = ? AND user_id = ?', 
            [meme_id, req.user.id]
        );

        if (existing.length > 0) {
            // Optional: Toggle reaction (delete if exists) or Update
            await db.query('UPDATE reactions SET reaction_type = ? WHERE id = ?', [reaction_type, existing[0].id]);
            return res.json({ message: 'Reaction updated' });
        }

        await db.query(
            'INSERT INTO reactions (meme_id, user_id, reaction_type) VALUES (?, ?, ?)',
            [meme_id, req.user.id, reaction_type]
        );
        res.status(201).json({ message: 'Reaction added' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;