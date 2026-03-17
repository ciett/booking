import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
    // Hàm helper để định dạng class cho các mục Menu
    const navLinkClass = ({ isActive }) => 
        `flex items-center space-x-2 rounded-full px-4 py-2 font-semibold transition-colors text-white no-underline border ${
            isActive 
            ? 'border-white bg-booking-dark' // Class khi đang ở trang này
            : 'border-transparent hover:bg-white/10' // Class khi ở trang khác
        }`;

    return (
        <header className="bg-booking-blue text-white">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-tight">Booking.com</Link>

                {/* Menu bên phải */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-semibold">
                    <button className="hover:bg-booking-dark p-2 rounded">VND</button>
                    <button className="hover:bg-booking-dark p-2 rounded">
                        <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-5 rounded-full inline" />
                    </button>
                    <button className="hover:bg-booking-dark p-2 rounded">
                        <i className="fa-regular fa-circle-question text-xl"></i>
                    </button>
                    <Link to="/list-your-property">
                        <button className=" text-white hover:bg-booking-dark p-2 rounded">
                            Đăng tin chỗ nghỉ của Quý vị
                        </button>
                    </Link>

                    <div className="flex space-x-2">
                        <Link to="/register" className="bg-white text-booking-blue px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors">
                            Đăng ký
                        </Link>
                        <Link to="/login" className="bg-white text-booking-blue px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors">
                            Đăng nhập
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Icon */}
                <button className="md:hidden text-2xl">
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Sub Navbar (Menu điều hướng chính) */}
            <div className="max-w-6xl mx-auto px-4 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex space-x-2">
                    <NavLink to="/" className={navLinkClass}>
                        <i className="fa-solid fa-bed"></i> <span>Lưu trú</span>
                    </NavLink>

                    <NavLink to="/flights" className={navLinkClass}>
                        <i className="fa-solid fa-plane"></i> <span>Chuyến bay</span>
                    </NavLink>

                    <NavLink to="/flight-hotel" className={navLinkClass}>
                        <i className="fa-solid fa-suitcase"></i> <span>Chuyến bay + Khách sạn</span>
                    </NavLink>

                    <NavLink to="/car-rentals" className={navLinkClass}>
                        <i className="fa-solid fa-car"></i> <span>Thuê xe</span>
                    </NavLink>

                    <NavLink to="/attractions" className={navLinkClass}>
                        <i className="fa-solid fa-fort-awesome"></i> <span>Địa điểm tham quan</span>
                    </NavLink>

                    <NavLink to="/airport-taxis" className={navLinkClass}>
                        <i className="fa-solid fa-taxi"></i> <span>Taxi sân bay</span>
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Navbar;