import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SocialButtons from '../components/SocialButtons';

const CB   = '#006ce4';
const NAVY = '#003580';
const inputCls = "w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all bg-white border border-gray-300 focus:border-[#006ce4] focus:ring-2 focus:ring-[#006ce420] placeholder:text-gray-400 text-gray-900";

let useAuth;
try { useAuth = require('../context/AuthContext').useAuth; } catch(e) { useAuth = () => ({ login: null }); }

const Register = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', email: '', password: '' });
    const [status, setStatus]     = useState({ type: '', message: '' });
    const [loading, setLoading]   = useState(false);
    const navigate = useNavigate();
    let login = null;
    try { login = useAuth()?.login; } catch(e){}

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); setStatus({ type: '', message: '' });
        try {
            const response = await axios.post('/api/auth/register', formData);
            setStatus({ type: 'success', message: response.data.message || t('auth.registerSuccess') });
            setTimeout(() => navigate('/login', { state: { registeredEmail: formData.email } }), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || t('auth.registerError') });
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider, token, email, name) => {
        setLoading(true); setStatus({ type: '', message: '' });
        try {
            const response = await axios.post('/api/auth/social-login', { provider, token, email, name });
            const { token: jwt, id, email: userEmail, fullName, role } = response.data;
            localStorage.setItem('booking_token', jwt);
            localStorage.setItem('booking_user_id', id);
            localStorage.setItem('booking_user', userEmail);
            localStorage.setItem('booking_name', fullName || userEmail);
            localStorage.setItem('booking_role', role);
            if (login) login(jwt, { id, email: userEmail, fullName, role });
            navigate('/', { replace: true });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || t('auth.socialLoginError', { provider }) });
            setLoading(false);
        }
    };

    const fields = [
        { name: 'fullName',    type: 'text',     label: t('auth.fullName'),       placeholder: t('auth.fullNamePlaceholder'), required: true },
        { name: 'phoneNumber', type: 'tel',      label: t('auth.phoneNumber'),   placeholder: t('auth.phoneNumberPlaceholder'),   required: false },
        { name: 'email',       type: 'email',    label: t('auth.email'),   placeholder: 'email@example.com', required: true },
        { name: 'password',    type: 'password', label: t('auth.password'),        placeholder: t('auth.passwordCreatePlaceholder'), required: true },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{ background: '#f2f2f2', fontFamily: "'Inter', sans-serif" }}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Blue header strip */}
                <div className="px-8 pt-8 pb-6" style={{ background: NAVY }}>
                    <Link to="/" className="text-white font-black text-xl no-underline block mb-4">Booking.com</Link>
                    <h1 className="text-white font-bold text-2xl">{t('auth.createAccount')}</h1>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        {t('auth.joinFree')}
                    </p>
                </div>

                {/* Form */}
                <div className="px-8 py-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                        {fields.map(f => (
                            <div key={f.name}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                                <input type={f.type} name={f.name} required={f.required}
                                    placeholder={f.placeholder} value={formData[f.name]}
                                    onChange={handleChange} className={inputCls} />
                            </div>
                        ))}

                        {status.message && (
                            <div className={`text-sm font-medium p-3 rounded-xl border ${
                                status.type === 'error'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-green-50 text-green-700 border-green-200'
                            }`}>
                                {status.message}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full font-bold py-3 rounded-xl text-white transition-all disabled:opacity-60 mt-2"
                            style={{ background: loading ? '#578bfa' : CB }}
                            onMouseOver={e => { if (!loading) e.currentTarget.style.background = NAVY; }}
                            onMouseOut={e => { if (!loading) e.currentTarget.style.background = CB; }}>
                            {loading ? t('auth.signingUp') : t('auth.createNewAccount')}
                        </button>
                    </form>

                    <SocialButtons onAuthSuccess={handleSocialLogin} loading={loading} />

                    <div className="mt-5 text-center text-sm text-gray-600">
                        {t('auth.loginPrompt')}{' '}
                        <Link to="/login" className="font-bold no-underline" style={{ color: CB }}>
                            {t('auth.login')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;