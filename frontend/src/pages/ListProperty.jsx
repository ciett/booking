import React from 'react';
import { Link } from 'react-router-dom';

const ListProperty = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Header đơn giản dành riêng cho trang đối tác */}
            <header className="bg-booking-blue py-4 px-6 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4 text-white text-sm">
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative h-[500px] flex items-center">
                <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt="Host" 
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 max-w-6xl mx-auto px-6 text-white w-full">
                    <div className="max-w-xl bg-white p-8 rounded-lg shadow-2xl text-gray-900">
                        <h1 className="text-3xl font-extrabold mb-4 leading-tight">
                            Đăng chỗ nghỉ của bạn trên Booking.com
                        </h1>
                        <p className="text-lg mb-6 text-gray-600">
                            Dù bạn có một căn hộ nhỏ hay cả một hệ thống khách sạn, hãy bắt đầu tiếp cận hàng triệu khách du lịch ngay hôm nay.
                        </p>
                        <Link to="/submit-property" className="block w-full">
                            <button className="w-full bg-booking-blue text-white py-4 rounded font-bold text-xl hover:bg-booking-dark transition shadow-lg">
                                Bắt đầu ngay
                            </button>
                        </Link>
                        <div className="h-px bg-gray-200 my-4"></div>
                        <p className="text-sm text-center text-gray-500">
                            Hơn 6,4 triệu căn hộ, biệt thự và các chỗ nghỉ độc đáo khác đã được đăng ký.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section: Tại sao nên chọn chúng tôi */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-16">Tại sao Quý vị nên đăng ký chỗ nghỉ trên Booking.com?</h2>
                <div className="grid md:grid-cols-3 gap-12 text-center">
                    <div>
                        <div className="text-booking-blue text-5xl mb-6">
                            <i className="fa-solid fa-earth-americas"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-3">Tiếp cận khách toàn cầu</h3>
                        <p className="text-gray-600">Quảng bá chỗ nghỉ của bạn đến hàng triệu du khách từ khắp nơi trên thế giới, 24/7.</p>
                    </div>
                    <div>
                        <div className="text-green-600 text-5xl mb-6">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-3">Kiểm soát tuyệt đối</h3>
                        <p className="text-gray-600">Bạn toàn quyền quyết định giá cả, quy tắc chung và thời gian nhận/trả phòng của khách.</p>
                    </div>
                    <div>
                        <div className="text-orange-500 text-5xl mb-6">
                            <i className="fa-solid fa-headset"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-3">Hỗ trợ 24/7</h3>
                        <p className="text-gray-600">Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn qua điện thoại hoặc email.</p>
                    </div>
                </div>
            </div>

            {/* Section: Các bước thực hiện */}
            <div className="bg-gray-100 py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-10 text-center">Đăng chỗ nghỉ cực kỳ đơn giản</h2>
                    <div className="space-y-8">
                        <div className="flex gap-6 items-start">
                            <div className="bg-booking-blue text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                            <div>
                                <h4 className="font-bold text-xl">Đăng ký chỗ nghỉ</h4>
                                <p className="text-gray-600">Cung cấp thông tin chi tiết về chỗ nghỉ, hình ảnh và tiện nghi.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="bg-booking-blue text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                            <div>
                                <h4 className="font-bold text-xl">Xác nhận thông tin</h4>
                                <p className="text-gray-600">Chúng tôi sẽ kiểm tra và kích hoạt trang chỗ nghỉ của bạn trong thời gian sớm nhất.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="bg-booking-blue text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">3</div>
                            <div>
                                <h4 className="font-bold text-xl">Đón những vị khách đầu tiên</h4>
                                <p className="text-gray-600">Khi chỗ nghỉ lên sóng, du khách có thể đặt phòng ngay lập tức.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer kêu gọi */}
            <div className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">Sẵn sàng để tăng doanh thu của bạn?</h2>
                <Link to="/submit-property">
                    <button className="bg-booking-blue text-white px-10 py-4 rounded font-bold text-xl hover:bg-booking-dark transition shadow-lg">
                        Đăng chỗ nghỉ ngay
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ListProperty;