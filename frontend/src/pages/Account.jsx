import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/LockOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FlightIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttractionIcon from '@mui/icons-material/LocationOn';
import TaxiIcon from '@mui/icons-material/LocalTaxi';
import ComboIcon from '@mui/icons-material/CardGiftcard';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import api from '../services/api';
import dayjs from 'dayjs';

const CB_BLUE = '#006ce4';

const getServiceInfo = (type) => {
  switch (type) {
    case 'FLIGHT':     return { label: 'Vé Máy Bay',          icon: <FlightIcon style={{ color: CB_BLUE }} />,          bg: '#e8eeff' };
    case 'HOTEL':      return { label: 'Khách Sạn',           icon: <HotelIcon style={{ color: '#f97316' }} />,         bg: '#fff7ed' };
    case 'CAR_RENTAL': return { label: 'Thuê Xe',             icon: <DirectionsCarIcon style={{ color: '#16a34a' }} />, bg: '#f0fdf4' };
    case 'ATTRACTION': return { label: 'Địa Điểm Tham Quan', icon: <AttractionIcon style={{ color: '#9333ea' }} />,    bg: '#faf5ff' };
    case 'TAXI':       return { label: 'Taxi Sân Bay',        icon: <TaxiIcon style={{ color: '#ca8a04' }} />,         bg: '#fefce8' };
    case 'COMBO':      return { label: 'Combo Tiết Kiệm',     icon: <ComboIcon style={{ color: '#ec4899' }} />,        bg: '#fdf2f8' };
    default:           return { label: type || 'Dịch Vụ',    icon: <HistoryIcon style={{ color: '#6b7280' }} />,      bg: '#f9fafb' };
  }
};

const StatusBadge = ({ status }) => {
  const cfg = {
    CONFIRMED: { label: 'Đã xác nhận', color: '#16a34a', bg: '#dcfce7' },
    PENDING:   { label: 'Chờ xử lý',   color: '#ca8a04', bg: '#fef9c3' },
    CANCELLED: { label: 'Đã hủy',      color: '#dc2626', bg: '#fee2e2' },
  }[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };

  return (
    <span style={{ background: cfg.bg, color: cfg.color }}
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
      {cfg.label}
    </span>
  );
};

const Account = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({ fullName: '', email: '', phoneNumber: '', role: 'CUSTOMER' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('booking_token')) { navigate('/login'); return; }
    const fetchUserData = async () => {
      try {
        const userRes = await api.get('/users/me');
        setUserProfile(userRes.data);
        if (userRes.data?.id) {
          const bookingRes = await api.get(`/bookings/user/${userRes.data.id}`);
          setBookings(bookingRes.data);
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) handleLogout();
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleProfileChange  = (e) => setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    setLoading(true);
    try {
      await api.put('/users/me', { fullName: userProfile.fullName, email: userProfile.email, phoneNumber: userProfile.phoneNumber });
      message.success('Đã lưu thông tin thành công!');
      if (userProfile.email !== localStorage.getItem('booking_user')) {
        message.warning('Email đã thay đổi. Hệ thống sẽ đăng xuất!');
        setTimeout(handleLogout, 2000);
      } else {
        localStorage.setItem('booking_name', userProfile.fullName);
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) { message.error(err.response?.data || 'Lỗi khi lưu thông tin'); }
    finally { setLoading(false); }
  };

  const savePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) { message.error('Mật khẩu xác nhận không khớp!'); return; }
    setLoading(true);
    try {
      await api.put('/users/me/password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      message.success('Đổi mật khẩu thành công!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { message.error(err.response?.data || 'Mật khẩu hiện tại không đúng.'); }
    finally { setLoading(false); }
  };

  const handleLanguageChange = (e) => i18n.changeLanguage(e.target.value);

  const handleLogout = () => {
    ['booking_token','booking_user','booking_name','booking_role','booking_user_id'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  const tabs = [
    { id: 'profile',  label: t('account.profile'),   icon: <PersonIcon fontSize="small" /> },
    { id: 'bookings', label: t('account.bookings'),   icon: <HistoryIcon fontSize="small" /> },
    { id: 'security', label: t('account.security'),   icon: <LockIcon fontSize="small" /> },
    { id: 'settings', label: t('account.settings'),   icon: <SettingsIcon fontSize="small" /> },
  ];

  const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:border-[#006ce4] focus:ring-[#006ce420] outline-none transition-all text-gray-900 text-sm font-medium placeholder:text-gray-400";
  const pillBtn = (extra = '') => `px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${extra}`;

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', fontFamily: "'Inter', 'CoinbaseSans', sans-serif" }}
      className="flex justify-center py-10 px-4">

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* ── SIDEBAR ─────────────────────────────────── */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">

            {/* Avatar Section — dark strip */}
            <div style={{ background: '#003580' }} className="p-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mb-4 text-white"
                style={{ background: CB_BLUE, letterSpacing: '-1px' }}>
                {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="text-white text-base font-bold text-center leading-tight">{userProfile.fullName || 'Người dùng'}</h2>
              <p className="text-gray-400 text-xs text-center mt-1">{userProfile.email}</p>
              <span className="mt-3 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: CB_BLUE + '22', color: CB_BLUE }}>
                {userProfile.role}
              </span>
            </div>

            {/* Nav */}
            <nav className="p-3 space-y-1 grow">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-semibold text-left"
                  style={activeTab === tab.id
                    ? { background: '#006ce4' + '12', color: '#006ce4' }
                    : { color: '#5b616e' }}>
                  <span style={activeTab === tab.id ? { color: '#006ce4' } : { color: '#9ca3af' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="p-4" style={{ borderTop: '1px solid rgba(91,97,110,0.12)' }}>
              <button onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[56px] text-sm font-semibold transition-colors"
                style={{ color: '#dc2626', background: '#fee2e2' }}
                onMouseOver={e => e.currentTarget.style.background = '#fecaca'}
                onMouseOut={e => e.currentTarget.style.background = '#fee2e2'}>
                <ExitToAppIcon fontSize="small" />
                {t('account.logout') || 'Đăng xuất'}
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ────────────────────────────── */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-[32px] p-8 min-h-[500px]"
            style={{ border: '1px solid rgba(91,97,110,0.15)' }}>

            {/* ── PROFILE ── */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-black text-[#0a0b0d] mb-1" style={{ lineHeight: 1.1 }}>
                  {t('account.personalInfo')}
                </h3>
                <p className="text-sm text-gray-400 mb-8">Cập nhật thông tin tài khoản của bạn</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0a0b0d] mb-2 uppercase tracking-wider">{t('account.fullName')}</label>
                    <input type="text" name="fullName" value={userProfile.fullName || ''} onChange={handleProfileChange} className={inputCls} placeholder="Họ và tên" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0a0b0d] mb-2 uppercase tracking-wider">Email</label>
                    <input type="email" name="email" value={userProfile.email || ''} onChange={handleProfileChange} className={inputCls} placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0a0b0d] mb-2 uppercase tracking-wider">{t('account.phoneNumber')}</label>
                    <input type="tel" name="phoneNumber" value={userProfile.phoneNumber || ''} onChange={handleProfileChange} className={inputCls} placeholder="09xxxxxxxx" />
                  </div>
                </div>

                <div className="mt-8 pt-6 flex justify-end" style={{ borderTop: '1px solid rgba(91,97,110,0.12)' }}>
                  <button onClick={saveProfile} disabled={loading}
                    className={pillBtn('text-white disabled:opacity-60')}
                    style={{ background: loading ? '#578bfa' : CB_BLUE }}
                    onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#578bfa'; }}
                    onMouseOut={e => { if (!loading) e.currentTarget.style.background = CB_BLUE; }}>
                    {loading ? 'Đang lưu...' : t('account.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {/* ── BOOKINGS ── */}
            {activeTab === 'bookings' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-black text-[#0a0b0d] mb-1" style={{ lineHeight: 1.1 }}>
                  {t('account.bookings')}
                </h3>
                <p className="text-sm text-gray-400 mb-8">Lịch sử các chuyến đi và dịch vụ đã đặt</p>

                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ background: CB_BLUE + '12' }}>
                      <HistoryIcon style={{ fontSize: 36, color: CB_BLUE }} />
                    </div>
                    <h4 className="text-xl font-black text-[#0a0b0d] mb-2">{t('account.noTripsYet')}</h4>
                    <p className="text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">{t('account.noTripsDesc')}</p>
                    <button onClick={() => navigate('/')}
                      className={pillBtn('text-white')} style={{ background: CB_BLUE }}
                      onMouseOver={e => e.currentTarget.style.background = '#578bfa'}
                      onMouseOut={e => e.currentTarget.style.background = CB_BLUE}>
                      {t('account.startSearching')}
                    </button>
                  </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(book => {
                            const getServiceInfo = (type) => {
                                switch(type) {
                                    case 'FLIGHT': return { label: 'Vé Máy Bay', icon: <FlightIcon className="text-blue-500" /> };
                                    case 'HOTEL': return { label: 'Khách Sạn', icon: <HotelIcon className="text-orange-500" /> };
                                    case 'CAR_RENTAL': return { label: 'Thuê Xe', icon: <DirectionsCarIcon className="text-green-500" /> };
                                    case 'ATTRACTION': return { label: 'Địa Điểm Tham Quan', icon: <AttractionIcon className="text-purple-500" /> };
                                    case 'TAXI': return { label: 'Taxi Sân Bay', icon: <TaxiIcon className="text-yellow-600" /> };
                                    case 'COMBO': return { label: 'Combo Tiết Kiệm', icon: <ComboIcon className="text-pink-500" /> };
                                    default: return { label: type, icon: <HistoryIcon /> };
                                }
                            };
                            const info = getServiceInfo(book.bookingType);
                            
                            return (
                                <div key={book.id} className="border border-gray-100 p-5 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white flex flex-col md:flex-row justify-between md:items-center gap-4 group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-blue-50 text-booking-blue text-[10px] font-bold px-2 py-0.5 uppercase rounded tracking-wider">Mã Đặt #{book.id}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    book.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                                                    book.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {book.status === 'CONFIRMED' ? 'Đã xác nhận' : 
                                                     book.status === 'CANCELLED' ? 'Đã hủy' : 
                                                     book.status === 'PENDING' ? 'Chờ xử lý' : book.status}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-lg text-gray-800">{info.label}</h4>
                                            <p className="text-xs text-gray-400 font-medium">Ngày đặt: {dayjs(book.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                    <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0">
                                        <div className="text-xl font-black text-booking-blue tracking-tight">
                                            {book.totalPrice?.toLocaleString('vi-VN')} <span className="text-sm font-bold">VND</span>
                                        </div>
                                        <button className="text-xs font-bold text-[#006ce4] hover:underline mt-1 bg-transparent border-none p-0 cursor-pointer">
                                            Xem chi tiết &rarr;
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === 'security' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-black text-[#0a0b0d] mb-1" style={{ lineHeight: 1.1 }}>
                  {t('account.accountSecurity')}
                </h3>
                <p className="text-sm text-gray-400 mb-8">Quản lý mật khẩu và bảo mật tài khoản</p>

                <div className="space-y-5 max-w-md">
                  {[
                    { name: 'currentPassword', label: 'Mật khẩu hiện tại', placeholder: '••••••••' },
                    { name: 'newPassword',     label: 'Mật khẩu mới',      placeholder: 'Ít nhất 8 ký tự' },
                    { name: 'confirmPassword', label: 'Xác nhận mật khẩu', placeholder: 'Nhập lại mật khẩu mới' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-bold text-[#0a0b0d] mb-2 uppercase tracking-wider">{f.label}</label>
                      <input type="password" name={f.name} value={passwordData[f.name]} onChange={handlePasswordChange}
                        className={inputCls} placeholder={f.placeholder} />
                    </div>
                  ))}

                  <button onClick={savePassword}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                    className={pillBtn('w-full text-white disabled:opacity-50 mt-2')}
                    style={{ background: loading ? '#578bfa' : CB_BLUE }}
                    onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#578bfa'; }}
                    onMouseOut={e => { if (!loading) e.currentTarget.style.background = CB_BLUE; }}>
                    {loading ? 'Đang cập nhật...' : (t('account.changePassword') || 'Đổi mật khẩu')}
                  </button>
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-black text-[#0a0b0d] mb-1" style={{ lineHeight: 1.1 }}>
                  {t('account.appSettings')}
                </h3>
                <p className="text-sm text-gray-400 mb-8">Tuỳ chỉnh ngôn ngữ và hiển thị</p>

                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-[#0a0b0d] mb-2 uppercase tracking-wider">{t('account.language')}</label>
                    <select className={inputCls} value={i18n.language} onChange={handleLanguageChange}>
                      <option value="vi">🇻🇳  Tiếng Việt</option>
                      <option value="en">🇺🇸  English (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0a0b0d] mb-2 uppercase tracking-wider">{t('account.currency')}</label>
                    <select className={inputCls}>
                      <option>🇻🇳  VND — Đồng Việt Nam</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
