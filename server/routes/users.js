
const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Get User (Sync)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const user = db.users.find(u => u._id === id);
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
});

module.exports = router;
