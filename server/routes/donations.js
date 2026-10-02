
const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Get Donations
router.get('/', (req, res) => {
    const db = readDB();
    res.json(db.donations);
});

// Create Donation
router.post('/', (req, res) => {
    const data = req.body; // Expects full donation object minus ID/Dates logic
    const db = readDB();

    const newDonation = {
        _id: 'd' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        status: 'available',
        image: `https://picsum.photos/seed/${Date.now()}/300/200`
    };

    db.donations.push(newDonation);
    writeDB(db);
    res.json(newDonation);
});

// Claim Donation (NGO)
router.post('/:id/claim', (req, res) => {
    const { id } = req.params;
    const { ngoId } = req.body;
    const db = readDB();

    const idx = db.donations.findIndex(d => d._id === id);
    if (idx !== -1) {
        db.donations[idx].status = 'claimed';
        db.donations[idx].ngoId = ngoId;
        writeDB(db);
        res.json(db.donations[idx]);
    } else {
        res.status(404).json({ message: 'Donation not found' });
    }
});

// Complete Donation (Donor)
router.post('/:id/complete', (req, res) => {
    const { id } = req.params;
    const db = readDB();

    const idx = db.donations.findIndex(d => d._id === id);
    if (idx !== -1) {
        db.donations[idx].status = 'completed';

        // Add credits to donor
        const donorId = db.donations[idx].donorId;
        const uIdx = db.users.findIndex(u => u._id === donorId);
        if (uIdx !== -1) {
            db.users[uIdx].credits = (db.users[uIdx].credits || 0) + 10;
        }

        writeDB(db);
        res.json({ donation: db.donations[idx], donor: db.users[uIdx] });
    } else {
        res.status(404).json({ message: 'Donation not found' });
    }
});

module.exports = router;
