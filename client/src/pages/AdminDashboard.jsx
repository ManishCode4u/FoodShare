
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, donations: 0, openComplaints: 0, complaints: [], usersList: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stats');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const resolveComplaint = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/admin/complaints/${id}/resolve`);
            fetchStats();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="fade-in">
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="text-blue-600 font-semibold">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.users}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-green-600 font-semibold">Donations Made</h3>
                    <p className="text-3xl font-bold">{stats.donations}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <h3 className="text-red-600 font-semibold">Open Complaints</h3>
                    <p className="text-3xl font-bold">{stats.openComplaints}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="p-4 border-b"><h3 className="font-bold">Recent Complaints</h3></div>
                    <div className="p-4 max-h-60 overflow-y-auto">
                        {stats.complaints.length === 0 ? <p>No complaints.</p> : stats.complaints.map(c => (
                            <div key={c._id} className="flex justify-between items-center border-b py-3 last:border-0">
                                <div>
                                    <p className="font-medium">{c.subject}</p>
                                    <p className="text-sm text-gray-500">User: {c.userId}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {c.status}
                                    </span>
                                    {c.status === 'open' && (
                                        <button onClick={() => resolveComplaint(c._id)} className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-black">Resolve</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="p-4 border-b"><h3 className="font-bold">User Management</h3></div>
                    <div className="p-4 max-h-60 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.usersList.map(u => (
                                    <tr key={u._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{u.name}</td>
                                        <td className="p-2 capitalize"><span className="bg-gray-200 px-2 py-1 rounded text-xs">{u.role}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
