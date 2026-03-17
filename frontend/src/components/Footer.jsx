import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-booking-blue text-white mt-10">
            <div className="max-w-6xl mx-auto px-4 py-6 text-center">
                
                <div className="h-px bg-white bg-opacity-20 mb-6"></div>
                
                <ul className="flex flex-wrap justify-center space-x-4 space-y-2 md:space-y-0 text-sm font-semibold underline mb-4">
                    <li><a href="#">Tài khoản của bạn</a></li>
                    <li><a href="#">Trợ giúp Dịch vụ Khách hàng</a></li>
                    <li><a href="#">Trở thành đối tác liên kết</a></li>
                    <li><a href="#">Booking.com dành cho Doanh nghiệp</a></li>
                </ul>
            </div>
            
            <div className="bg-booking-dark text-white text-xs py-4 text-center">
                Bản quyền © 1996–2026 Booking.com clone. Bảo lưu mọi quyền.
            </div>
        </footer>
    );
};

export default Footer;