import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/LockOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import api from '../services/api';
import dayjs from 'dayjs';
import FlightIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttractionIcon from '@mui/icons-material/LocationOn';
import TaxiIcon from '@mui/icons-material/LocalTaxi';
import ComboIcon from '@mui/icons-material/CardGiftcard';

const Account = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'CUSTOMER'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('booking_token')) {
      navigate('/login');
      return;
    }
    
    const fetchUserData = async () => {
      try {
        const userRes = await api.get('/users/me');
        setUserProfile(userRes.data);
        
        if (userRes.data && userRes.data.id) {
          const bookingRes = await api.get(`/bookings/user/${userRes.data.id}`);
          setBookings(bookingRes.data);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleLogout();
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleProfileChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      await api.put('/users/me', {
        fullName: userProfile.fullName,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber
      });
      message.success(t('account.saveSuccess') || "Đã lưu thông tin cá nhân thành công!");
      
      // Kiểm tra xem email có bị đổi không so với localStorage
      if (userProfile.email && userProfile.email !== localStorage.getItem('booking_user')) {
          message.warning(t('account.emailChanged') || "Email đăng nhập đã được thay đổi. Hệ thống sẽ đăng xuất!");
          setTimeout(() => {
              handleLogout();
          }, 2000);
      } else {
          // Update local storage name to reflect changes on navbar
          localStorage.setItem('booking_name', userProfile.fullName);
          window.dispatchEvent(new Event("storage")); // Trigger custom event if navbar listens
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data || t('account.saveFailure') || "Lỗi khi lưu thông tin");
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      message.error(t('account.passwordMismatch') || "Mật khẩu xác nhận không trùng khớp!");
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      message.success(t('account.passwordSuccess') || "Đổi mật khẩu thành công!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      message.error(err.response?.data || t('account.passwordFailure') || "Không thể đổi mật khẩu. Hãy kiểm tra lại mật khẩu hiện tại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('booking_token');
    localStorage.removeItem('booking_user');
    localStorage.removeItem('booking_name');
    localStorage.removeItem('booking_role');
    localStorage.removeItem('booking_user_id');
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: t('account.profile'), icon: <PersonIcon /> },
    { id: 'bookings', label: t('account.bookings'), icon: <HistoryIcon /> },
    { id: 'security', label: t('account.security'), icon: <LockIcon /> },
    { id: 'settings', label: t('account.settings'), icon: <SettingsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 flex flex-col items-center border-b border-gray-100 bg-linear-to-br from-blue-50 to-white">
              <div className="relative group cursor-pointer mb-4">
                <div className="w-24 h-24 rounded-full bg-booking-blue text-white flex justify-center items-center text-3xl font-bold shadow-md">
                  {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <EditIcon className="text-white" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-800 text-center">{userProfile.fullName || 'Người dùng'}</h2>
              <p className="text-sm text-gray-500 text-center">{userProfile.email || ''}</p>
              <div className="mt-2 bg-blue-100 text-booking-blue text-xs font-bold px-3 py-1 rounded-full">{userProfile.role}</div>
            </div>

            <nav className="p-2 space-y-1 grow">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === tab.id
                    ? 'bg-blue-50 text-booking-blue'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100'
                    }`}
                >
                  <span className={`${activeTab === tab.id ? 'text-booking-blue' : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-semibold"
                >
                  <ExitToAppIcon fontSize="small"/>
                  <span>{t('account.logout') || "Đăng xuất"}</span>
                </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] transition-all duration-300">
            {activeTab === 'profile' && (
              <div className="transition-opacity duration-500 opacity-100 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('account.personalInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.fullName')}</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={userProfile.fullName || ''} 
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={userProfile.email || ''} 
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.phoneNumber')}</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      value={userProfile.phoneNumber || ''} 
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" 
                    />
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={saveProfile}
                    disabled={loading}
                    className="bg-booking-blue hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-sm focus:ring-4 focus:ring-blue-100 disabled:opacity-70"
                  >
                    {loading ? 'Đang lưu...' : t('account.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="transition-opacity duration-500 opacity-100 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('account.bookings')}</h3>
                
                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <HistoryIcon className="text-booking-blue" style={{ fontSize: 40 }} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{t('account.noTripsYet')}</h4>
                      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">{t('account.noTripsDesc')}</p>
                      <button onClick={() => navigate('/')} className="px-6 py-3 bg-booking-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-100">
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

            {activeTab === 'security' && (
              <div className="transition-opacity duration-500 opacity-100 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('account.accountSecurity')}</h3>
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" 
                    />
                  </div>
                  <button 
                    onClick={savePassword}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                    className="w-full bg-booking-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm focus:ring-4 focus:ring-blue-100 disabled:opacity-70"
                  >
                    {loading ? 'Đang cập nhật...' : (t('account.changePassword') || "Đổi mật khẩu")}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="transition-opacity duration-500 opacity-100 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('account.appSettings')}</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.language')}</label>
                    <select 
                        className="w-full md:w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all"
                        value={i18n.language}
                        onChange={handleLanguageChange}
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.currency')}</label>
                    <select className="w-full md:w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all">
                      <option>VND - Đồng Việt Nam</option>
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
