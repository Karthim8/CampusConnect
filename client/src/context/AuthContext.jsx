import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['x-auth-token'] = token;
            loadUser();
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['x-auth-token'];
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
            setUser(res.data);
        } catch (err) {
            console.error('Failed to load user', err);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
