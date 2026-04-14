import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import SocialButtons from '../components/SocialButtons';

const CB   = '#006ce4';
const NAVY = '#003580';
const inputCls = "w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all bg-white border border-gray-300 focus:border-[#006ce4] focus:ring-2 focus:ring-[#006ce420] placeholder:text-gray-400 text-gray-900";

let useAuth;
try { useAuth = require('../context/AuthContext').useAuth; } catch(e) { useAuth = () => ({ login: null }); }

const Login = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    let login = null;
    try { login = useAuth()?.login; } catch(e){}

    const [email, setEmail]       = useState(location.state?.registeredEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleLoginResponse = (response) => {
        const { token, id, email: userEmail, fullName, role } = response.data;
        localStorage.setItem('booking_token', token);
        localStorage.setItem('booking_user_id', id);
        localStorage.setItem('booking_user', userEmail);
        localStorage.setItem('booking_name', fullName || userEmail);
        localStorage.setItem('booking_role', role);
        if (login) login(token, { id, email: userEmail, fullName, role });
        const from = location.state?.from;
        navigate(from ? (from.pathname + (from.search || '')) : '/', { replace: true });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            handleLoginResponse(response);
        } catch (err) {
            setError(err.response?.data?.message || t('auth.loginError'));
        } finally { setLoading(false); }
    };

    const handleSocialLogin = async (provider, token, email, name) => {
        setLoading(true); setError('');
        try {
            const response = await api.post('/auth/social-login', { provider, token, email, name });
            handleLoginResponse(response);
        } catch (err) {
            setError(err.response?.data?.message || t('auth.socialLoginError', { provider }));
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{ background: '#f2f2f2', fontFamily: "'Inter', sans-serif" }}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Blue header strip */}
                <div className="px-8 pt-8 pb-6" style={{ background: NAVY }}>
                    <Link to="/" className="text-white font-black text-xl no-underline block mb-4">Booking.com</Link>
                    <h1 className="text-white font-bold text-2xl">{t('auth.login')}</h1>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        {t('auth.welcomeBack')}
                    </p>
                </div>

                {/* Form */}
                <div className="px-8 py-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.email')}</label>
                            <input type="email" required placeholder="email@example.com" value={email}
                                onChange={e => setEmail(e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.password')}</label>
                            <input type="password" required placeholder={t('auth.passwordPlaceholder')} value={password}
                                onChange={e => setPassword(e.target.value)} className={inputCls} />
                        </div>

                        {error && (
                            <div className="text-sm font-medium p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full font-bold py-3 rounded-xl text-white transition-all disabled:opacity-60 mt-2"
                            style={{ background: loading ? '#578bfa' : CB }}
                            onMouseOver={e => { if (!loading) e.currentTarget.style.background = NAVY; }}
                            onMouseOut={e => { if (!loading) e.currentTarget.style.background = CB; }}>
                             {loading ? t('auth.signingIn') : t('auth.login')}
                        </button>
                    </form>

                    <SocialButtons onAuthSuccess={handleSocialLogin} loading={loading} />

                    <div className="mt-5 text-center text-sm text-gray-600">
                        {t('auth.registerPrompt')}{' '}
                        <Link to="/register" className="font-bold no-underline" style={{ color: CB }}>
                            {t('auth.createNewAccount')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;