import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/LockOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import EditIcon from '@mui/icons-material/Edit';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const userName = localStorage.getItem('booking_name') || 'Guest User';
  const userRole = localStorage.getItem('booking_role') || 'Sáng lập viên';
  const email = 'user@example.com'; // Placeholder

  useEffect(() => {
    if (!localStorage.getItem('booking_token')) {
      navigate('/login');
    }
  }, [navigate]);

  const tabs = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: <PersonIcon /> },
    { id: 'bookings', label: 'Lịch sử đặt phòng', icon: <HistoryIcon /> },
    { id: 'security', label: 'Bảo mật', icon: <LockIcon /> },
    { id: 'settings', label: 'Cài đặt', icon: <SettingsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex flex-col items-center border-b border-gray-100 bg-gradient-to-br from-blue-50 to-white">
              <div className="relative group cursor-pointer mb-4">
                <div className="w-24 h-24 rounded-full bg-booking-blue text-white flex justify-center items-center text-3xl font-bold shadow-md">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <EditIcon className="text-white" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-800">{userName}</h2>
              <p className="text-sm text-gray-500">{userRole}</p>
            </div>

            <nav className="p-2 space-y-1">
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
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full transition-all duration-300">
            {activeTab === 'profile' && (
              <div className="transition-opacity duration-500 opacity-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Họ và tên</label>
                      <input type="text" defaultValue={userName} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <input type="email" defaultValue={email} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
                      <input type="tel" placeholder="Nhập số điện thoại" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Quốc tịch</label>
                      <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all">
                        <option>Việt Nam</option>
                        <option>Hoa Kỳ</option>
                        <option>Nhật Bản</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                    <button className="bg-booking-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm focus:ring-4 focus:ring-blue-100">
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="transition-opacity duration-500 opacity-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử đặt phòng</h3>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <HistoryIcon className="text-booking-blue" style={{ fontSize: 40 }} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Chưa có chuyến đi nào</h4>
                  <p className="text-gray-500 max-w-md mb-8 leading-relaxed">Bạn chưa đặt một chuyến phiêu lưu nào. Hãy tìm kiếm và bắt đầu lên kế hoạch cho chuyến đi tiếp theo nhé!</p>
                  <button onClick={() => navigate('/')} className="px-6 py-3 bg-booking-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-100">
                    Bắt đầu tìm kiếm
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="transition-opacity duration-500 opacity-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Bảo mật tài khoản</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Mật khẩu</h4>
                      <p className="text-sm text-gray-500">Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản tốt hơn</p>
                    </div>
                    <button className="text-booking-blue font-bold px-5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors whitespace-nowrap ml-4">Đổi mật khẩu</button>
                  </div>
                  <div className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Xác thực hai yếu tố (2FA)</h4>
                      <p className="text-sm text-gray-500">Tăng cường lớp bảo vệ bằng điện thoại di động của bạn</p>
                    </div>
                    <button className="text-booking-blue font-bold px-5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors whitespace-nowrap ml-4">Thiết lập 2FA</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="transition-opacity duration-500 opacity-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt ứng dụng</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Ngôn ngữ</label>
                    <select className="w-full md:w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all">
                      <option>Tiếng Việt</option>
                      <option>English (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Tiền tệ</label>
                    <select className="w-full md:w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all">
                      <option>VND - Đồng Việt Nam</option>
                      <option>USD - US Dollar</option>
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
