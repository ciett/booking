import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState(location.state?.registeredEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            const { token, id, email: userEmail, fullName, role } = response.data;
            
            login(token, { id, email: userEmail, fullName, role });
            
            localStorage.setItem('booking_user_id', id);
            localStorage.setItem('booking_role', role);

            // Chuyển hướng về trang chủ hoặc trang trước đó
<<<<<<< Updated upstream
            const redirectPath = location.state?.from?.pathname + (location.state?.from?.search || '') || '/';
            navigate(redirectPath, { replace: true });
=======
            const from = location.state?.from;
            const redirectPath = from ? (from.pathname + (from.search || '')) : '/';
            navigate(redirectPath);
>>>>>>> Stashed changes
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grow flex items-center justify-center p-4 bg-gray-50 h-screen">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-100">
                <Link to="/" className="text-booking-blue font-bold text-2xl block text-center mb-6">Booking.com</Link>
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Đăng nhập vào tài khoản</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Địa chỉ email</label>
                        <input
                            type="email"
                            required
                            placeholder="Nhập địa chỉ email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:border-booking-blue focus:ring-1 focus:ring-booking-blue transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:border-booking-blue focus:ring-1 focus:ring-booking-blue transition"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded font-medium border border-red-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-booking-blue text-white font-bold py-3 px-4 rounded hover:bg-booking-dark transition-colors mt-2 disabled:opacity-70"
                    >
                        {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600">Bạn chưa có tài khoản? </span>
                    <Link to="/register" className="text-booking-blue hover:underline font-semibold">Đăng ký tại đây</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;