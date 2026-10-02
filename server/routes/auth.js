
const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email === email && u.password === password);

    if (user) {
        // In a real app, use JWT. Here we just return the user for simplicity to match the prototype's logic
        // But let's add a fake token
        const token = Buffer.from(JSON.stringify({ id: user._id, role: user.role })).toString('base64');
        res.json({ success: true, token, user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Signup
router.post('/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    const db = readDB();

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const newUser = {
        _id: 'u' + Date.now(),
        name,
        email,
        password,
        role,
        credits: 0,
        location: { type: 'Point', coordinates: [77.2090, 28.6139] } // Default location for now
    };

    db.users.push(newUser);
    writeDB(db);

    const token = Buffer.from(JSON.stringify({ id: newUser._id, role: newUser.role })).toString('base64');
    res.json({ success: true, token, user: newUser });
});

module.exports = router;
