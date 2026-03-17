import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);

            setStatus({ 
                type: 'success', 
                message: response.data.message || 'Đăng ký thành công! Đang chuyển hướng...' 
            });

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
            });
            setLoading(false);
        }
    };

    return (
        <div className="grow flex items-center justify-center p-4 bg-gray-50 h-screen">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-100">
                <Link to="/" className="text-booking-blue font-bold text-2xl block text-center mb-6">Booking.com</Link>
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Tạo tài khoản</h1>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            placeholder="Nhập họ và tên của bạn"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:border-booking-blue focus:ring-1 focus:ring-booking-blue transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Nhập số điện thoại"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:border-booking-blue focus:ring-1 focus:ring-booking-blue transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Địa chỉ email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="name@domain.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:border-booking-blue focus:ring-1 focus:ring-booking-blue transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Tạo mật khẩu mạnh"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:border-booking-blue focus:ring-1 focus:ring-booking-blue transition"
                        />
                    </div>

                    {status.message && (
                        <div className={`text-sm p-3 rounded font-medium border ${status.type === 'error' ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-700 bg-green-50 border-green-200'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-booking-blue text-white font-bold py-3 px-4 rounded hover:bg-booking-dark transition-colors mt-2 disabled:opacity-70"
                    >
                        {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600">Bạn đã có tài khoản? </span>
                    <Link to="/login" className="text-booking-blue hover:underline font-semibold">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;