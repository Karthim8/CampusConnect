import React from 'react';

const Login = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="p-8 bg-gray-800 rounded-lg shadow-xl w-96 text-center border border-gray-700">
                <h1 className="text-3xl font-bold text-white mb-6">CampusConnect</h1>
                <p className="text-gray-400 mb-8">Exclusively for College Students</p>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
