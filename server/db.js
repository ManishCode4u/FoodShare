const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// MOCK SEED DATA (from original index.html)
const SEED_DATA = {
    users: [
        { _id: 'u1', name: 'Admin User', email: 'admin@food.com', role: 'admin', location: { type: 'Point', coordinates: [77.2090, 28.6139] } },
        { _id: 'u2', name: 'Taj Hotel', email: 'donor@hotel.com', role: 'donor', credits: 0, location: { type: 'Point', coordinates: [77.2150, 28.6150] } },
        { _id: 'u3', name: 'Helping Hands NGO', email: 'ngo@help.com', role: 'ngo', credits: 0, location: { type: 'Point', coordinates: [77.2050, 28.6100] } }
    ],
    donations: [
        { _id: 'd1', donorId: 'u2', foodType: 'Rice & Curry', quantity: '5kg', expiry: '2025-12-31T20:00', location: { type: 'Point', coordinates: [77.2150, 28.6150] }, address: 'Connaught Place, New Delhi', status: 'available', image: 'https://picsum.photos/seed/food1/300/200', createdAt: new Date().toISOString() },
        { _id: 'd2', donorId: 'u2', foodType: 'Bread Packets', quantity: '20 pcs', expiry: '2025-12-30T14:00', location: { type: 'Point', coordinates: [77.2200, 28.6200] }, address: 'Janpath, New Delhi', status: 'claimed', ngoId: 'u3', image: 'https://picsum.photos/seed/food2/300/200', createdAt: new Date().toISOString() }
    ],
    feedback: [],
    complaints: [
        { _id: 'c1', userId: 'ngo@help.com', subject: 'Map issue', status: 'open', date: new Date().toISOString() }
    ]
};

// Initialize DB file if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

module.exports = { readDB, writeDB };
