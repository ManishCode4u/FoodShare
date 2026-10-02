
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
// We'll create ProtectedRoute component inline or separate, let's keep it simple here first

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

function App() {
    const { user } = useAuth();

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

                    <Route path="/" element={
                        user ? (
                            user.role === 'donor' ? <Navigate to="/donor" /> :
                                user.role === 'ngo' ? <Navigate to="/ngo" /> :
                                    <Navigate to="/admin" />
                        ) : <Navigate to="/login" />
                    } />

                    <Route path="/donor" element={
                        <ProtectedRoute allowedRoles={['donor']}>
                            <DonorDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/ngo" element={
                        <ProtectedRoute allowedRoles={['ngo']}>
                            <NgoDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <footer className="bg-gray-800 text-white py-6 mt-12">
                <div className="max-w-7xl mx-auto text-center">
                    <p>&copy; 2023 FoodShare. Saving the world, one meal at a time.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
