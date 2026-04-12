import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/PersonOutline';

const CB = '#006ce4';
const NAVY = '#003580';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    const token    = localStorage.getItem('booking_token');
    const userName = localStorage.getItem('booking_name');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        ['booking_token','booking_user','booking_name','booking_role','booking_user_id']
            .forEach(k => localStorage.removeItem(k));
        navigate('/login');
    };

    const languageItems = [
        { key: 'vi', label: (<div className="flex items-center gap-3 px-1 py-0.5"><img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-4 rounded-sm" /><span className="font-medium text-sm">Tiếng Việt</span></div>), onClick: () => i18n.changeLanguage('vi') },
        { key: 'en', label: (<div className="flex items-center gap-3 px-1 py-0.5"><img src="https://flagcdn.com/w20/us.png" alt="EN" className="w-5 h-4 rounded-sm" /><span className="font-medium text-sm">English (US)</span></div>), onClick: () => i18n.changeLanguage('en') },
    ];

    const navItems = [
        { path: '/',             icon: 'fa-bed',           label: t('navbar.stays') },
        { path: '/flights',      icon: 'fa-plane',         label: t('navbar.flights') },
        { path: '/flight-hotel', icon: 'fa-suitcase',      label: t('navbar.flightAndHotel') },
        { path: '/car-rentals',  icon: 'fa-car',           label: t('navbar.carRentals') },
        { path: '/attractions',  icon: 'fa-fort-awesome',  label: t('navbar.attractions') },
        { path: '/airport-taxis',icon: 'fa-taxi',          label: t('navbar.airportTaxis') },
    ];

    return (
        <header style={{
            background: NAVY,
            fontFamily: "'Inter', sans-serif",
            position: 'sticky', top: 0, zIndex: 50,
            boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
            transition: 'box-shadow 0.3s'
        }}>
            {/* Top bar */}
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-white text-xl font-black tracking-tight no-underline">Booking.com</Link>

                <div className="hidden md:flex items-center gap-2">
                    {/* Currency */}
                    <button className="text-xs font-bold text-gray-400 hover:text-white px-3 py-2 rounded-full transition-colors"
                        style={{ letterSpacing: '0.05em' }}>
                        {t('navbar.currency')}
                    </button>

                    {/* Language */}
                    <Dropdown menu={{ items: languageItems }} trigger={['click']} placement="bottomRight">
                        <button className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
                            style={{ background: 'rgba(255,255,255,0.12)' }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                            <img src={i18n.language?.startsWith('en') ? 'https://flagcdn.com/w20/us.png' : 'https://flagcdn.com/w20/vn.png'}
                                alt="lang" className="w-5 h-4 rounded-sm" />
                        </button>
                    </Dropdown>

                    {/* List Property */}
                    <Link to="/list-your-property"
                        className="text-xs font-bold px-4 py-2 rounded-full no-underline transition-colors"
                        style={{ color: '#9ca3af', background: 'rgba(255,255,255,0.06)' }}
                        onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                        onMouseOut={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                        {t('navbar.listProperty')}
                    </Link>

                    {/* Auth */}
                    {token ? (
                        <div className="flex items-center gap-2">
                            <Link to="/account" className="flex items-center gap-2 px-4 py-2 rounded-full no-underline transition-all"
                                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                                <PersonIcon style={{ color: CB, fontSize: 16 }} />
                                <span className="text-white text-xs font-bold max-w-[100px] truncate">{userName}</span>
                            </Link>
                            <button onClick={handleLogout}
                                className="text-xs font-bold px-4 py-2 rounded-full transition-all"
                                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                                {t('navbar.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/register"
                                className="text-xs font-bold px-4 py-2 rounded-full no-underline transition-all"
                                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                {t('navbar.register')}
                            </Link>
                            <Link to="/login"
                                className="text-xs font-bold px-5 py-2 rounded-full no-underline transition-all"
                                style={{ background: CB, color: '#fff' }}
                                onMouseOver={e => e.currentTarget.style.background = '#578bfa'}
                                onMouseOut={e => e.currentTarget.style.background = CB}>
                                {t('navbar.login')}
                            </Link>
                        </div>
                    )}
                </div>

                <button className="md:hidden text-white text-xl">
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Sub nav */}
            <div className="max-w-6xl mx-auto px-4 pb-3 overflow-x-auto scrollbar-hide"
                style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex gap-1 pt-2">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link key={item.path} to={item.path}
                                className="flex items-center gap-2 px-4 py-2 rounded-full no-underline whitespace-nowrap text-xs font-semibold transition-all"
                                style={{
                                    color: isActive ? '#fff' : '#9ca3af',
                                    background: isActive ? CB : 'transparent',
                                }}
                                onMouseOver={e => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
                                onMouseOut={e => { if (!isActive) e.currentTarget.style.color = '#9ca3af'; }}>
                                <i className={`fa-solid ${item.icon} text-xs`}></i>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};

export default Navbar;