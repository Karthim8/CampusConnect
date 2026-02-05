import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token);
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        </div>
    );
};

export default AuthSuccess;
