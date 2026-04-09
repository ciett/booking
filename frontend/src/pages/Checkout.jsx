import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from '../services/api';

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Lấy thông tin từ query params
  const type = searchParams.get('type') || '';
  const name = searchParams.get('name') || '';
  const price = Number(searchParams.get('price')) || 0;
  const details = searchParams.get('details') ? JSON.parse(searchParams.get('details')) : {};

  // States
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [userId, setUserId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [selectedWallet, setSelectedWallet] = useState('momo');
  
  // Đọc cờ status do PayOS truyền về sau khi redirect
  const statusParam = searchParams.get('status');
  const [orderStatus, setOrderStatus] = useState(statusParam === 'success' ? 'completed' : 'idle'); // 'idle', 'processing', 'completed'
  const [bookingCode] = useState(() => 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 5).toUpperCase());
  const [showQrModal, setShowQrModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút
  const [currentBookingId, setCurrentBookingId] = useState(null);

  useEffect(() => {
     if (statusParam === 'cancel') {
         message.warning('Thanh toán đã bị hủy.');
     }
  }, [statusParam]);

  useEffect(() => {
    if (!showQrModal) return;
    if (timeLeft <= 0) {
      setShowQrModal(false);
      setOrderStatus('idle');
      message.error("Hết thời gian thanh toán mã QR!");
      return;
    }
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [showQrModal, timeLeft]);

  useEffect(() => {
    const token = localStorage.getItem('booking_token');
    
    // Nếu chưa đăng nhập, chuyển hướng sang /login và lưu lại đường dẫn hiện tại để quay lại
    if (!token) {
      message.warning('Vui lòng đăng nhập để tiếp tục đặt chỗ.');
      navigate('/login', { state: { from: location } });
      return; // Không gọi API bên dưới nếu không có token
    }

    // Nếu user đã đăng nhập, tự động lấy thông tin từ DB để điền sẵn
    api.get('/users/me')
      .then(res => {
        if (res.data) {
          setUserId(res.data.id);
          setCustomerInfo({
            fullName: res.data.fullName || '',
            email: res.data.email || '',
            phone: res.data.phoneNumber || ''
          });
        }
      })
      .catch(err => {
        console.error("Không thể tự động điền thông tin người dùng", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('booking_token');
          message.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login', { state: { from: location } });
        }
      });
  }, [navigate, location]);

  const serviceFee = Math.round(price * 0.05);
  const totalPrice = price + serviceFee;

  // Xử lý tạo Order cho PayPal thông qua Backend
  const handleCreatePaypalOrder = async (data, actions) => {
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      message.warning(t('checkout.fillRequired'));
      throw new Error("Missing customer info");
    }
    try {
      // 1. Tạo đơn hàng PENDING trong DB trước (nếu chưa có)
      let bookingId = currentBookingId;
      if (!bookingId) {
        // MAP loại dịch vụ sang ENUM Backend (BookingType)
        const typeMap = {
           'hotel': 'HOTEL',
           'flight': 'FLIGHT',
           'car-rentals': 'CAR_RENTAL',
           'attractions': 'ATTRACTION',
           'airport-taxis': 'TAXI',
           'flight-hotel': 'COMBO'
        };

        const bookingPayload = {
           user: userId ? { id: userId } : null, 
           bookingType: typeMap[type] || 'HOTEL',
           totalPrice: totalPrice,
           bookingCode: bookingCode,
           status: 'PENDING'
        };

        const bookingRes = await api.post('/bookings', bookingPayload);
        bookingId = bookingRes.data.id;
        setCurrentBookingId(bookingId);
      }

      // 2. Gọi backend tạo order PayPal
      const usdPrice = (totalPrice / 25000).toFixed(2);
      const res = await api.post('/paypal/create-order', { amount: usdPrice });
      return res.data.id; 
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi khởi tạo đơn hàng PayPal");
    }
  };

  // Xử lý Capture Order khi thanh toán hoàn tất
  const handleApprovePaypalOrder = async (data, actions) => {
    try {
      const res = await api.post('/paypal/capture-order', { 
        orderId: data.orderID,
        bookingId: currentBookingId 
      });
      const captureData = res.data;
      
      if (captureData.status === 'COMPLETED') {
         message.success("Thanh toán thành công qua PayPal!");
         setOrderStatus('completed');
      } else {
         message.error("Thanh toán chưa được hoàn tất");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi xác nhận thanh toán");
    }
  };

  // Label cho loại dịch vụ
  const typeLabels = {
    hotel: t('checkout.typeHotel'),
    flight: t('checkout.typeFlight'),
    car: t('checkout.typeCar'),
    attraction: t('checkout.typeAttraction'),
    taxi: t('checkout.typeTaxi'),
    package: t('checkout.typePackage'),
  };

  // Icon cho loại dịch vụ
  const typeIcons = {
    hotel: 'fa-solid fa-hotel',
    flight: 'fa-solid fa-plane',
    car: 'fa-solid fa-car',
    attraction: 'fa-solid fa-ticket',
    taxi: 'fa-solid fa-taxi',
    package: 'fa-solid fa-suitcase-rolling',
  };

  // Logic Polling kiểm tra trạng thái thanh toán
  useEffect(() => {
    if (!showQrModal) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await api.get(`/bookings/status/${bookingCode}`);
        // Nếu Backend báo đã xác nhận hoặc hoàn tất
        if (res.data === 'CONFIRMED' || res.data === 'COMPLETED') {
          clearInterval(pollInterval);
          setShowQrModal(false);
          setOrderStatus('completed');
          message.success(t('checkout.paymentSuccess', 'Hệ thống đã nhận được tiền. Cảm ơn bạn!'));
        }
      } catch (err) {
        console.error("Lỗi khi polling trạng thái đơn hàng:", err);
      }
    }, 3000); // Mỗi 3 giây hỏi 1 lần

    return () => clearInterval(pollInterval);
  }, [showQrModal, bookingCode, t]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      message.warning(t('checkout.fillRequired'));
      return;
    }
    
    setOrderStatus('processing');

    try {
      // MAP loại dịch vụ sang ENUM Backend (BookingType)
      const typeMap = {
         'hotel': 'HOTEL',
         'flight': 'FLIGHT',
         'car-rentals': 'CAR_RENTAL',
         'attractions': 'ATTRACTION',
         'airport-taxis': 'TAXI',
         'flight-hotel': 'COMBO'
      };

      // 1. Lưu đơn hàng thật vào database
      const bookingPayload = {
         user: userId ? { id: userId } : null, 
         bookingType: typeMap[type] || 'HOTEL',
         totalPrice: totalPrice,
         bookingCode: bookingCode,
         status: 'PENDING'
      };

      await api.post('/bookings', bookingPayload);

      // 2. Gọi PayOS để lấy link thanh toán thật (Dành cho Bank Transfer và E-wallet dùng VietQR)
      if (paymentMethod === 'bank' || paymentMethod === 'ewallet') {
          const payosRes = await api.post('/payment/create-link', {
              bookingCode: bookingCode,
              amount: totalPrice
          });

          if (payosRes.data && payosRes.data.checkoutUrl) {
              window.location.href = payosRes.data.checkoutUrl;
          }
      } else {
          // Khi chọn COD...
          setOrderStatus('completed');
      }
      
    } catch (err) {
      console.error("Lỗi khi tạo giao dịch:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         message.error(t('checkout.sessionExpired', 'Phiên làm việc đã hết hạn. Hệ thống đang chuyển hướng về trang Đăng nhập...'));
         localStorage.removeItem('booking_token');
         setTimeout(() => {
             navigate('/login', { state: { from: location } });
         }, 1500);
      } else {
         message.error("Không thể kết nối với cổng thanh toán. Vui lòng thử lại sau.");
      }
      setOrderStatus('idle');
    }
  };

  const handleQrScanned = () => {
     setShowQrModal(false);
     setOrderStatus('processing');
     setTimeout(() => {
        setOrderStatus('completed');
     }, 2000);
  };

  // Trang xác nhận thành công
  if (orderStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center animate-fade-in-up border-t-8 border-green-500">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100">
            <i className="fa-solid fa-check text-green-600 text-3xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 text-balance">
             {t('checkout.successTitle', 'Đặt chỗ thành công!')}
          </h1>
          <p className="text-gray-500 mb-6 text-sm md:text-base">
             {t('checkout.successDesc', 'Thanh toán hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!')}
          </p>
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">{t('checkout.orderCode')}</span>
              <span className="font-bold text-gray-900">{searchParams.get('bookingCode') || bookingCode}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">{t('checkout.service')}</span>
              <span className="font-semibold text-right truncate max-w-[60%]">{name}</span>
            </div>
            <div className="flex justify-between text-base border-b border-gray-200 pb-2">
              <span className="text-gray-500">{t('checkout.totalAmount')}</span>
              <span className="font-bold text-green-600">{totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-500">Trạng thái:</span>
              <span className="text-green-600">
                 Đã thanh toán (Xác nhận 100%)
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-[#003b95] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#002d73] transition-all w-full flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-home"></i> {t('checkout.backHome', 'Trở về trang chủ')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#003b95] text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-lock text-blue-300"></i>
            {t('checkout.title')}
          </h1>
          <p className="text-blue-200 mt-1">{t('checkout.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleConfirm}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CỘT TRÁI - Form thanh toán */}
            <div className="lg:col-span-2 space-y-6">

              {/* Thông tin khách hàng */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <i className="fa-solid fa-user text-[#003b95]"></i>
                  {t('checkout.customerInfo')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('checkout.fullName')} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder={t('checkout.fullNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('checkout.email')} <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder={t('checkout.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('checkout.phone')} <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder={t('checkout.phonePlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <i className="fa-solid fa-credit-card text-[#003b95]"></i>
                  {t('checkout.paymentMethod')}
                </h2>

                <div className="space-y-3">
                  {/* Nhóm 1: Chuyển khoản ngân hàng (VietQR) */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'bank' ? 'border-[#003b95] bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} className="accent-[#003b95] w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Chuyển khoản ngân hàng (VietQR)</p>
                      <p className="text-xs text-gray-500">Phổ biến nhất tại Việt Nam, phí thấp và tiện lợi</p>
                    </div>
                    <i className="fa-solid fa-qrcode text-xl text-[#003b95]"></i>
                  </label>

                  {paymentMethod === 'bank' && (
                    <div className="ml-9 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in-up text-sm text-blue-800">
                      <p className="font-semibold mb-1"><i className="fa-solid fa-circle-info mr-2"></i>Hướng dẫn thanh toán:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Bấm <strong>Hoàn tất thanh toán</strong> ở cột bên phải để tiếp tục.</li>
                        <li>Mã QR chuyển khoản sẽ hiển thị an toàn trên màn hình lớn.</li>
                        <li>Sử dụng App Ngân hàng bất kỳ để quét mã và tự động nhận diện thông tin.</li>
                      </ul>
                    </div>
                  )}

                  {/* Nhóm 2: Ví điện tử (Momo/ZaloPay/VNPAY) */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'ewallet' ? 'border-[#003b95] bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('ewallet')}
                  >
                    <input type="radio" name="payment" value="ewallet" checked={paymentMethod === 'ewallet'} onChange={() => setPaymentMethod('ewallet')} className="accent-[#003b95] w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Ví điện tử (Momo/ZaloPay/VNPAY)</p>
                      <p className="text-xs text-gray-500">Tiện lợi cho khách dùng mobile, quét mã thanh toán ngay</p>
                    </div>
                    <i className="fa-solid fa-wallet text-xl text-pink-500"></i>
                  </label>

                  {paymentMethod === 'ewallet' && (
                    <div className="ml-9 p-5 bg-purple-50 rounded-xl border border-purple-200 animate-fade-in-up">
                      <p className="text-sm font-semibold text-purple-800 mb-3">{t('checkout.ewalletInstruction', 'Thanh toán trực tiếp bằng ví điện tử qua mã PayOS/VietQR:')}</p>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <button type="button" onClick={() => setSelectedWallet('momo')} className={`border-2 p-3 rounded-xl flex flex-col items-center justify-center transition-all focus:outline-none ${selectedWallet === 'momo' ? 'border-pink-500 bg-pink-50 shadow-sm' : 'border-gray-200 hover:border-pink-300 bg-white'}`}>
                          <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center text-xl font-bold mb-2 shadow-sm">M</div>
                          <p className={`text-xs font-bold ${selectedWallet === 'momo' ? 'text-pink-600' : 'text-gray-700'}`}>MoMo</p>
                        </button>
                        <button type="button" onClick={() => setSelectedWallet('zalopay')} className={`border-2 p-3 rounded-xl flex flex-col items-center justify-center transition-all focus:outline-none ${selectedWallet === 'zalopay' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 bg-white'}`}>
                          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-2 shadow-sm">ZaloPay</div>
                          <p className={`text-xs font-bold ${selectedWallet === 'zalopay' ? 'text-blue-600' : 'text-gray-700'}`}>ZaloPay</p>
                        </button>
                        <button type="button" onClick={() => setSelectedWallet('vnpay')} className={`border-2 p-3 rounded-xl flex flex-col items-center justify-center transition-all focus:outline-none ${selectedWallet === 'vnpay' ? 'border-red-500 bg-red-50 shadow-sm' : 'border-gray-200 hover:border-red-300 bg-white'}`}>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 text-white flex items-center justify-center text-sm font-bold mb-2 shadow-sm">VN</div>
                          <p className={`text-xs font-bold ${selectedWallet === 'vnpay' ? 'text-red-600' : 'text-gray-700'}`}>VNPAY</p>
                        </button>
                      </div>
                      <div className="mt-4 flex items-start gap-2 bg-purple-100 p-3 rounded-lg">
                        <i className="fa-solid fa-bolt text-purple-600 mt-0.5"></i>
                        <p className="text-xs text-purple-800 leading-relaxed font-medium">
                          Sau khi bấm Xác nhận, bạn sẽ được tự động chuyển đến cổng thanh toán PayOS. Hãy mở App Ví để quét mã. Đơn hàng sẽ được duyệt ngay lập tức!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Nhóm 3: Thanh toán quốc tế (PayPal / Thẻ Visa, Mastercard) */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'paypal' ? 'border-[#003b95] bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="accent-[#003b95] w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Thanh toán quốc tế (PayPal / Thẻ Visa, Mastercard)</p>
                      <p className="text-xs text-gray-500">Thanh toán bảo mật toàn cầu, chấp nhận hầu hết loại thẻ</p>
                    </div>
                    <div className="flex gap-2 text-[#00457C]">
                        <i className="fa-brands fa-paypal text-2xl"></i>
                        <i className="fa-brands fa-cc-visa text-2xl"></i>
                        <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                    </div>
                  </label>

                  {paymentMethod === 'paypal' && (
                    <div className="ml-9 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up">
                      <p className="text-sm font-semibold text-gray-700 mb-4">{t('checkout.paypalInstruction', 'Bạn có thể thanh toán bằng số dư PayPal hoặc thẻ Visa/Mastercard trực tiếp bên dưới:')}</p>
                      <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "USD" }}>
                        {totalPrice > 0 ? (
                          <PayPalButtons 
                            createOrder={handleCreatePaypalOrder}
                            onApprove={handleApprovePaypalOrder}
                            style={{ layout: "vertical", shape: "rect", color: "gold" }}
                          />
                        ) : (
                          <div className="p-4 bg-orange-50 border border-orange-200 text-orange-600 rounded-xl text-center text-sm font-semibold">
                            Vui lòng chọn sản phẩm có giá trị lớn hơn 0 để thanh toán qua PayPal.
                          </div>
                        )}
                      </PayPalScriptProvider>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI - Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <i className="fa-solid fa-receipt text-[#003b95]"></i>
                  {t('checkout.orderSummary')}
                </h2>

                {/* Loại dịch vụ */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#003b95] rounded-lg flex items-center justify-center">
                    <i className={`${typeIcons[type] || 'fa-solid fa-tag'} text-white`}></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">{typeLabels[type] || type}</p>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">{name}</p>
                  </div>
                </div>

                {/* Chi tiết */}
                {Object.keys(details).length > 0 && (
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    {Object.entries(details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-500">{key}</span>
                        <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Giá */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('checkout.subtotal')}</span>
                    <span className="font-medium">{price.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('checkout.serviceFee')}</span>
                    <span className="font-medium">{serviceFee.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">{t('checkout.totalAmount')}</span>
                    <span className="font-extrabold text-xl text-[#003b95]">{totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                {/* Nút xác nhận */}
                {paymentMethod !== 'paypal' ? (
                  <button
                    type="submit"
                    disabled={orderStatus === 'processing'}
                    className={`w-full font-bold py-4 rounded-xl transition-all duration-200 text-lg flex items-center justify-center shadow-lg
                      ${orderStatus === 'processing' ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-[#006ce4] hover:bg-[#003b95] text-white active:scale-[0.98] shadow-blue-500/20'}`}
                  >
                    {orderStatus === 'processing' ? (
                      <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Đang xử lý...</>
                    ) : (
                      <><i className="fa-solid fa-lock mr-2"></i> {t('checkout.confirmPayment', 'Hoàn tất thanh toán')}</>
                    )}
                  </button>
                ) : (
                  <div className="w-full text-center bg-blue-50 text-[#00457C] font-semibold py-4 rounded-xl transition-all duration-200 text-sm border border-blue-200 border-dashed animate-pulse">
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Bấm nút PayPal ở khung bên trái để tiến hành thanh toán
                  </div>
                )}

                {/* Badges */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fa-solid fa-shield-halved text-green-600"></i>
                    {t('checkout.securePayment')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fa-solid fa-rotate-left text-blue-600"></i>
                    {t('checkout.refundPolicy')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fa-solid fa-headset text-purple-600"></i>
                    {t('checkout.support247')}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Modal Popup chứa mã QR dành riêng cho Ví điện tử */}
      {showQrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full relative">
            <button 
               onClick={() => { setShowQrModal(false); setOrderStatus('idle'); }}
               type="button"
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            <div className="text-center mb-5 mt-2">
               <h3 className={`text-xl font-bold mb-1
                  ${selectedWallet === 'momo' ? 'text-pink-600' : ''}
                  ${selectedWallet === 'zalopay' ? 'text-blue-600' : ''}
                  ${selectedWallet === 'vnpay' ? 'text-red-600' : ''}
               `}>
                  Thanh toán bằng {selectedWallet === 'momo' ? 'MoMo' : selectedWallet === 'zalopay' ? 'ZaloPay' : 'VNPay'}
               </h3>
               <p className="text-sm text-gray-500">Mở ứng dụng ví và quét mã bên dưới</p>
               <div className="mt-3 inline-block bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Đơn hàng: </span>
                  <span className="text-sm font-extrabold text-gray-900">{bookingCode}</span>
               </div>
            </div>
            
            <div className={`p-4 rounded-xl flex items-center justify-center border-2 border-dashed mb-4 bg-white shadow-inner
               ${selectedWallet === 'momo' ? 'border-pink-300 bg-pink-50' : ''}
               ${selectedWallet === 'zalopay' ? 'border-blue-300 bg-blue-50' : ''}
               ${selectedWallet === 'vnpay' ? 'border-red-300 bg-red-50' : ''}
            `}>
              {/* Vẫn sử dụng ảnh VietQR giả lập chung cho tất cả */}
              <img 
                src={`https://img.vietqr.io/image/mbbank-0328282592-compact2.jpg?amount=${totalPrice}&addInfo=${bookingCode}&accountName=NGUYEN%20TUAN%20KIET`} 
                alt="E-Wallet Payment QR" 
                className="w-56 h-56 object-contain mix-blend-multiply"
              />
            </div>
            
            <div className={`text-sm p-4 rounded-xl flex items-center justify-center gap-3 mb-2 font-semibold animate-pulse border
               ${selectedWallet === 'momo' ? 'bg-pink-100 text-pink-700 border-pink-200' : ''}
               ${selectedWallet === 'zalopay' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
               ${selectedWallet === 'vnpay' ? 'bg-red-100 text-red-700 border-red-200' : ''}
            `}>
               <i className="fa-solid fa-circle-notch fa-spin text-lg"></i>
               {t('checkout.waitingPayment', 'Đang chờ bạn quét mã...')}
            </div>

            <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-400">
               <i className="fa-regular fa-clock"></i>
               Mã hết hạn sau: <span className="font-bold text-gray-600">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>

            {/* Nút giả lập thanh toán (Dành cho bản vẽ Demo) */}
            <button 
              onClick={handleQrScanned}
              className="w-full mt-2 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition shadow flex items-center justify-center gap-2 text-sm"
            >
              <i className="fa-solid fa-bolt text-yellow-500"></i> Mô phỏng thanh toán thành công
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
