
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('fs_user');
        const token = sessionStorage.getItem('fs_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.success) {
                sessionStorage.setItem('fs_token', res.data.token);
                sessionStorage.setItem('fs_user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', userData);
            if (res.data.success) {
                sessionStorage.setItem('fs_token', res.data.token);
                sessionStorage.setItem('fs_user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        sessionStorage.removeItem('fs_token');
        sessionStorage.removeItem('fs_user');
        setUser(null);
        window.location.href = '/login';
    };

    const refreshUser = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${user._id}`);
            if (res.data) {
                sessionStorage.setItem('fs_user', JSON.stringify(res.data));
                setUser(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
