import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login(email, password);
            navigate('/dashboard');
            window.location.reload(); // Quick refresh to update auth state
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-sky-100 p-3 rounded-full text-sky-600 mb-4">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-center text-gray-900">ASAP Travels</h2>
                    <p className="text-gray-500 text-sm mt-1">Operator Control Center</p>
                </div>

                {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-6 flex items-center border border-red-100"><AlertCircle size={18} className="mr-2" />{error}</div>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-100 focus-within:border-sky-400 transition-all">
                            <Mail className="text-gray-400 mr-3" size={20} />
                            <input
                                type="email"
                                className="w-full bg-transparent outline-none text-gray-700 font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@asap-travels.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Security Password</label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-100 focus-within:border-sky-400 transition-all">
                            <Lock className="text-gray-400 mr-3" size={20} />
                            <input
                                type="password"
                                className="w-full bg-transparent outline-none text-gray-700 font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all"
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
