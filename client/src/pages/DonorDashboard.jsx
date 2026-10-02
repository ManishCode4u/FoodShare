
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Clock, Weight, CheckCircle } from 'lucide-react';

const DonorDashboard = () => {
    const { user, refreshUser } = useAuth();
    const [donations, setDonations] = useState([]);
    const [formData, setFormData] = useState({ foodType: '', quantity: '', expiry: '', address: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/donations');
                // Filter client side for simplicity, ideally server filter
                setDonations(res.data.filter(d => d.donorId === user._id));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, [user._id]);

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/donations', {
                ...formData,
                donorId: user._id,
                location: user.location // User's location
            });
            setDonations([...donations, res.data]);
            setFormData({ foodType: '', quantity: '', expiry: '', address: '' });
            alert('Donation Posted!');
        } catch (err) {
            console.error(err);
        }
    };

    const handleComplete = async (id) => {
        if (!confirm("Confirm successful pickup?")) return;
        try {
            const res = await axios.post(`http://localhost:5000/api/donations/${id}/complete`);
            setDonations(donations.map(d => d._id === id ? res.data.donation : d));
            refreshUser(); // Update credits
            alert('Pickup Confirmed! Credits Earned.');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in">
            {/* Donation Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg h-fit">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <PlusCircle className="text-orange-500" /> Donate Food
                </h2>
                <form onSubmit={handleDonate}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Food Type</label>
                            <input type="text" value={formData.foodType} onChange={e => setFormData({ ...formData, foodType: e.target.value })} placeholder="e.g. Rice, Bread" className="w-full px-3 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Quantity</label>
                            <input type="text" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} placeholder="e.g. 5kg" className="w-full px-3 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Expiry Time</label>
                            <input type="datetime-local" value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Pickup Address</label>
                            <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows="2" className="w-full px-3 py-2 border rounded-lg" required></textarea>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-bold">
                            Post Donation
                        </button>
                    </div>
                </form>
            </div>

            {/* Donation List */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">My Donations</h2>
                <div className="grid gap-4">
                    {loading ? <p>Loading...</p> : donations.length === 0 ? <p className="text-gray-500">No donations yet.</p> : ''}
                    {[...donations].reverse().map(d => (
                        <div key={d._id} className={`bg-white p-4 rounded-lg shadow flex justify-between items-center border-l-4 ${d.status === 'available' ? 'border-green-500' : d.status === 'claimed' ? 'border-yellow-500' : 'border-gray-500'}`}>
                            <div className="flex gap-4">
                                <img src={d.image} className="w-20 h-20 object-cover rounded bg-gray-200" alt="Food" />
                                <div>
                                    <h3 className="font-bold text-lg">{d.foodType}</h3>
                                    <p className="text-sm text-gray-600 flex items-center gap-1"><Weight size={14} /> {d.quantity}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1"><Clock size={14} /> Exp: {new Date(d.expiry).toLocaleString()}</p>
                                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full capitalize ${d.status === 'available' ? 'bg-green-100 text-green-800' : d.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {d.status}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                {d.status === 'claimed' && (
                                    <button onClick={() => handleComplete(d._id)} className="mb-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                        Confirm Pickup
                                    </button>
                                )}
                                {d.status === 'completed' && (
                                    <p className="text-green-600 font-bold mb-1 text-sm">+10 Credits Earned!</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
