
const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Get Stats
router.get('/stats', (req, res) => {
    const db = readDB();
    res.json({
        users: db.users.length,
        donations: db.donations.length,
        openComplaints: db.complaints.filter(c => c.status === 'open').length,
        complaints: db.complaints,
        usersList: db.users
    });
});

// Complaints
router.post('/complaints', (req, res) => {
    const { userId, subject } = req.body;
    const db = readDB();
    const newComp = {
        _id: 'c' + Date.now(),
        userId,
        subject,
        status: 'open',
        date: new Date().toISOString()
    };
    db.complaints.push(newComp);
    writeDB(db);
    res.json(newComp);
});

router.post('/complaints/:id/resolve', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const idx = db.complaints.findIndex(c => c._id === id);
    if (idx !== -1) {
        db.complaints[idx].status = 'resolved';
        writeDB(db);
        res.json(db.complaints[idx]);
    } else {
        res.status(404).send('Not found');
    }
});

// Feedback
router.post('/feedback', (req, res) => {
    const db = readDB();
    db.feedback.push(req.body);
    writeDB(db);
    res.json({ success: true });
});

module.exports = router;
