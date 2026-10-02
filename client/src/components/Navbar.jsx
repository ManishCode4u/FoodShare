
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Utensils, Coins, LogOut } from 'lucide-react'; // Using Lucide icons as they are nicer than FontAwesome

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Utensils className="text-orange-500 w-8 h-8 mr-2" />
                        <span className="font-bold text-xl tracking-tight text-gray-900">FoodShare</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium">Login</Link>
                                <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 font-medium">Sign Up</Link>
                            </>
                        ) : (
                            <>
                                <span className="text-sm text-gray-500 hidden lg:block">Welcome, {user.name}</span>
                                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full text-orange-600 font-bold">
                                    <Coins size={16} /> <span>{user.credits || 0}</span>
                                </div>

                                {user.role === 'donor' && (
                                    <Link to="/donor" className="text-gray-600 hover:text-orange-500">Dashboard</Link>
                                )}
                                {user.role === 'ngo' && (
                                    <Link to="/ngo" className="text-gray-600 hover:text-orange-500">Find Food</Link>
                                )}
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-600 hover:text-orange-500">Panel</Link>
                                )}

                                <button onClick={logout} className="flex items-center gap-1 text-red-500 font-medium hover:text-red-700 ml-2">
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
