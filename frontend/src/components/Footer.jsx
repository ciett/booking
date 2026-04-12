import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NAVY = '#003580';

const Footer = () => {
    const { t } = useTranslation();
    const links = [
        { to: '/account',          label: t('footer.yourAccount') },
        { to: '/customer-service', label: t('footer.customerService') },
        { to: '/become-partner',   label: t('footer.becomePartner') },
        { to: '/business',         label: t('footer.bookingForBusiness') },
    ];
    return (
        <footer style={{ background: NAVY, fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Top row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <span className="text-white text-lg font-black tracking-tight">Booking.com</span>
                    <div className="flex flex-wrap gap-5">
                        {links.map(l => (
                            <Link key={l.to} to={l.to}
                                className="text-sm font-semibold underline transition-colors"
                                style={{ color: 'rgba(255,255,255,0.8)' }}
                                onMouseOver={e => e.target.style.color = '#fff'}
                                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
                {/* Bottom row */}
                <div className="pt-5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{t('footer.copyright')}</p>
                    <div className="flex gap-3">
                        {['fa-twitter','fa-facebook','fa-instagram','fa-linkedin'].map(icon => (
                            <button key={icon}
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                                style={{ background: 'rgba(255,255,255,0.12)' }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                                <i className={`fa-brands ${icon} text-xs text-white`}></i>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;