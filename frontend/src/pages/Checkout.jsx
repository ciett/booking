import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from '../services/api';
const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lấy thông tin từ query params
  const type = searchParams.get('type') || '';
  const name = searchParams.get('name') || '';
  const price = Number(searchParams.get('price')) || 0;
  const details = searchParams.get('details') ? JSON.parse(searchParams.get('details')) : {};

  // States
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingCode] = useState(() => 'BK' + Date.now().toString().slice(-6));
  const [currentBookingId, setCurrentBookingId] = useState(null);

  useEffect(() => {
    // Nếu user đã đăng nhập, tự động lấy thông tin từ DB để điền sẵn
    const token = localStorage.getItem('booking_token');
    if (token) {
      api.get('/users/me')
        .then(res => {
          if (res.data) {
            setCustomerInfo({
              fullName: res.data.fullName || '',
              email: res.data.email || '',
              phone: res.data.phoneNumber || ''
            });
          }
        })
        .catch(err => {
          console.error("Không thể tự động điền thông tin người dùng", err);
        });
    }
  }, []);

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
        const userId = localStorage.getItem('booking_user_id');
        const bookingData = {
          userId: userId ? parseInt(userId) : null,
          bookingType: type.toUpperCase(),
          totalPrice: totalPrice,
          status: 'PENDING',
          details: details,
          customerInfo: customerInfo
        };
        const bookingRes = await api.post('/bookings', bookingData);
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
         setConfirmed(true);
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

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      message.warning(t('checkout.fillRequired'));
      return;
    }

    try {
      const userId = localStorage.getItem('booking_user_id');
      const bookingData = {
        userId: userId ? parseInt(userId) : null,
        bookingType: type.toUpperCase(),
        totalPrice: totalPrice,
        status: 'PENDING',
        details: details,
        customerInfo: customerInfo
      };

      await api.post('/bookings', bookingData);
      message.success('Đặt chỗ thành công!');
      setConfirmed(true);
    } catch (err) {
      console.error('Lỗi khi tạo đặt chỗ:', err);
      message.error('Có lỗi xảy ra khi đặt chỗ. Vui lòng thử lại.');
    }
  };

  // Trang xác nhận thành công
  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-check text-green-600 text-3xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{t('checkout.successTitle')}</h1>
          <p className="text-gray-500 mb-6">{t('checkout.successDesc')}</p>
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('checkout.orderCode')}</span>
              <span className="font-bold text-gray-900">BK{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('checkout.service')}</span>
              <span className="font-semibold">{name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('checkout.totalAmount')}</span>
              <span className="font-bold text-green-600">{totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-[#003b95] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#002d73] transition-all w-full"
          >
            {t('checkout.backHome')}
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
                    <div className="ml-9 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-1 w-full space-y-2 text-sm text-gray-700">
                        <p className="text-base font-bold text-gray-900 mb-2">{t('checkout.bankInfo', 'Thông tin chuyển khoản')}</p>
                        <p><span className="font-medium text-gray-500">{t('checkout.bankName', 'Ngân hàng')}:</span> Vietcombank (VCB)</p>
                        <p><span className="font-medium text-gray-500">{t('checkout.accountNumber', 'Số tài khoản')}:</span> <span className="text-booking-blue font-bold text-base">123456789012</span></p>
                        <p><span className="font-medium text-gray-500">{t('checkout.accountHolder', 'Chủ tài khoản')}:</span> CONG TY BOOKING CLONE</p>
                        <p><span className="font-medium text-gray-500">{t('checkout.transferContent', 'Nội dung')}:</span> <span className="text-red-600 font-bold bg-yellow-100 px-2 py-0.5 rounded text-base inline-block">{bookingCode}</span></p>
                        <p className="text-xs italic text-gray-500 mt-2 block border-t pt-2">* Vui lòng chuyển đúng số tiền và nội dung để hệ thống tự động đối soát xác nhận đơn hàng.</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 shrink-0">
                        <img 
                          src={`https://img.vietqr.io/image/vcb-123456789012-compact2.png?amount=${totalPrice}&addInfo=${bookingCode}&accountName=CONG%20TY%20BOOKING%20CLONE`} 
                          alt="VietQR Payment" 
                          className="w-48 h-48 object-contain"
                        />
                        <p className="text-xs text-center text-gray-500 mt-2 font-semibold">Quét mã qua ứng dụng ngân hàng</p>
                      </div>
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
                    <div className="ml-9 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up">
                      <p className="text-sm font-semibold text-gray-700 mb-3">{t('checkout.selectWallet', 'Chọn ví điện tử bạn muốn sử dụng')}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <button type="button" className="border-2 border-gray-200 hover:border-pink-500 p-3 rounded-xl text-center transition-all focus:border-pink-500 focus:bg-pink-50">
                          <div className="text-2xl mb-1">💳</div>
                          <p className="text-xs font-bold text-gray-700">MoMo</p>
                        </button>
                        <button type="button" className="border-2 border-gray-200 hover:border-blue-500 p-3 rounded-xl text-center transition-all focus:border-blue-500 focus:bg-blue-50">
                          <div className="text-2xl mb-1">💙</div>
                          <p className="text-xs font-bold text-gray-700">ZaloPay</p>
                        </button>
                        <button type="button" className="border-2 border-gray-200 hover:border-red-500 p-3 rounded-xl text-center transition-all focus:border-red-500 focus:bg-red-50">
                          <div className="text-2xl mb-1">🔴</div>
                          <p className="text-xs font-bold text-gray-700">VNPAY</p>
                        </button>
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
                    className="w-full bg-[#006ce4] hover:bg-[#003b95] text-white font-bold py-4 rounded-xl transition-all duration-200 text-lg active:scale-[0.98] shadow-lg shadow-blue-500/20"
                  >
                    <i className="fa-solid fa-lock mr-2"></i>
                    {t('checkout.confirmPayment', 'Hoàn tất thanh toán')}
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
    </div>
  );
};

export default Checkout;
