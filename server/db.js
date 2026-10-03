const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect Vercel / serverless environment
const IS_SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DB_FILE = IS_SERVERLESS ? path.join(os.tmpdir(), 'foodshare_data.json') : path.join(__dirname, 'data.json');
const LOCAL_SEED_FILE = path.join(__dirname, 'data.json');

// MOCK SEED DATA (Default initial data)
const SEED_DATA = {
    users: [
        { _id: 'u1', name: 'Admin User', email: 'admin@food.com', password: '123', role: 'admin', location: { type: 'Point', coordinates: [77.2090, 28.6139] } },
        { _id: 'u2', name: 'Taj Hotel', email: 'donor@hotel.com', password: '123', role: 'donor', credits: 0, location: { type: 'Point', coordinates: [77.2150, 28.6150] } },
        { _id: 'u3', name: 'Helping Hands NGO', email: 'ngo@help.com', password: '123', role: 'ngo', credits: 0, location: { type: 'Point', coordinates: [77.2050, 28.6100] } }
    ],
    donations: [
        { _id: 'd1', donorId: 'u2', foodType: 'Rice & Curry', quantity: '5kg', expiry: '2026-12-31T20:00', location: { type: 'Point', coordinates: [77.2150, 28.6150] }, address: 'Connaught Place, New Delhi', status: 'available', image: 'https://picsum.photos/seed/food1/300/200', createdAt: new Date().toISOString() },
        { _id: 'd2', donorId: 'u2', foodType: 'Bread Packets', quantity: '20 pcs', expiry: '2026-12-30T14:00', location: { type: 'Point', coordinates: [77.2200, 28.6200] }, address: 'Janpath, New Delhi', status: 'claimed', ngoId: 'u3', image: 'https://picsum.photos/seed/food2/300/200', createdAt: new Date().toISOString() }
    ],
    feedback: [],
    complaints: [
        { _id: 'c1', userId: 'ngo@help.com', subject: 'Map issue', status: 'open', date: new Date().toISOString() }
    ]
};

function getInitialData() {
    try {
        if (fs.existsSync(LOCAL_SEED_FILE)) {
            return JSON.parse(fs.readFileSync(LOCAL_SEED_FILE, 'utf8'));
        }
    } catch (e) {
        // ignore error and fallback
    }
    return SEED_DATA;
}

// In-memory cache for speed and resilience
let memoryStore = null;

// Initialize DB file if not exists
function initDB() {
    if (!memoryStore) {
        memoryStore = getInitialData();
    }
    if (!fs.existsSync(DB_FILE)) {
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2));
        } catch (e) {
            // Read-only filesystem in serverless, will use memoryStore
        }
    }
}

initDB();

const readDB = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const content = fs.readFileSync(DB_FILE, 'utf8');
            memoryStore = JSON.parse(content);
            return memoryStore;
        }
    } catch (e) {
        // ignore error and fallback to memoryStore
    }
    if (!memoryStore) {
        memoryStore = getInitialData();
    }
    return memoryStore;
};

const writeDB = (data) => {
    memoryStore = data;
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        // If file system is restricted, data remains preserved in memory during invocation
    }
};

module.exports = { readDB, writeDB };
