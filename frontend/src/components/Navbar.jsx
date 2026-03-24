import { Link, useLocation, useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem('booking_token');
    const userName = localStorage.getItem('booking_name');

    const handleLogout = () => {
        localStorage.removeItem('booking_token');
        localStorage.removeItem('booking_user');
        localStorage.removeItem('booking_name');
        localStorage.removeItem('booking_role');
        navigate('/login');
    };

    // Hàm helper để định dạng class cho các mục Menu
    const navLinkClass = (isActive) => 
        `flex items-center space-x-2 rounded-full px-4 py-2 font-semibold transition-colors text-white no-underline ${
            isActive 
            ? 'border border-white bg-booking-dark' // Class khi đang ở trang này
            : 'hover:bg-white/10' // Class khi ở trang khác
        }`;

    const navItems = [
        { path: '/', icon: 'fa-bed', label: 'Lưu trú' },
        { path: '/flights', icon: 'fa-plane', label: 'Chuyến bay' },
        { path: '/flight-hotel', icon: 'fa-suitcase', label: 'Chuyến bay + Khách sạn' },
        { path: '/car-rentals', icon: 'fa-car', label: 'Thuê xe' },
        { path: '/attractions', icon: 'fa-fort-awesome', label: 'Địa điểm tham quan' },
        { path: '/airport-taxis', icon: 'fa-taxi', label: 'Taxi sân bay' },
    ];

    return (
        <header className="bg-booking-blue text-white">
            <div className="section-container py-4 flex items-center justify-between">
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

                    <div className="flex space-x-2 items-center">
                        {token ? (
                            <>
                                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                                    <PersonIcon className="text-white" />
                                    <span className="text-white font-bold">{userName}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-white text-booking-blue px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors text-sm"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="bg-white text-booking-blue px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors">
                                    Đăng ký
                                </Link>
                                <Link to="/login" className="bg-white text-booking-blue px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors">
                                    Đăng nhập
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Icon */}
                <button className="md:hidden text-2xl">
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Sub Navbar (Menu điều hướng chính) */}
            <div className="section-container pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex space-x-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={navLinkClass(isActive)}
                            >
                                <i className={`fa-solid ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};

export default Navbar;