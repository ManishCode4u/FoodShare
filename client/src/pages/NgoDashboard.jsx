
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
}

const NgoDashboard = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [center, setCenter] = useState([28.6139, 77.2090]); // Default Delhi

    useEffect(() => {
        if (user && user.location) {
            setCenter([user.location.coordinates[1], user.location.coordinates[0]]);
        }
        fetchDonations();
    }, [user]);

    const fetchDonations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/donations');
            setDonations(res.data.filter(d => d.status === 'available'));
        } catch (err) {
            console.error(err);
        }
    };

    const handleClaim = async (id) => {
        if (!confirm("Are you sure you want to claim this donation?")) return;
        try {
            await axios.post(`http://localhost:5000/api/donations/${id}/claim`, { ngoId: user._id });
            alert('Donation Claimed!');
            fetchDonations(); // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fade-in space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold">Nearby Donations</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-2 rounded-lg shadow h-[500px] z-0">
                    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ChangeView center={center} />

                        <Marker position={center}>
                            <Popup>You are here</Popup>
                        </Marker>

                        {donations.map(d => (
                            <Marker key={d._id} position={[d.location.coordinates[1], d.location.coordinates[0]]}>
                                <Popup>
                                    <b>{d.foodType}</b><br />
                                    {d.quantity}<br />
                                    <button onClick={() => handleClaim(d._id)} className="bg-orange-500 text-white text-xs px-2 py-1 rounded mt-1">Claim</button>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div className="lg:col-span-1 space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {donations.map(d => (
                        <div key={d._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg">{d.foodType}</h4>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{d.quantity}</p>
                            <p className="text-red-500 text-xs mt-2 font-semibold">Exp: {new Date(d.expiry).toLocaleString()}</p>

                            <button onClick={() => handleClaim(d._id)} className="mt-3 w-full bg-orange-500 text-white py-2 rounded text-sm hover:bg-orange-600">
                                Claim Donation
                            </button>
                        </div>
                    ))}
                    {donations.length === 0 && <p>No available donations nearby.</p>}
                </div>
            </div>
        </div>
    );
};

export default NgoDashboard;
