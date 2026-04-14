import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, ConfigProvider, InputNumber, Popover, AutoComplete } from 'antd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const CB = '#006ce4';
const NAVY = '#003580';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState(null);
    const [options, setOptions] = useState({ adult: 2, children: 0, room: 1 });
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get('/api/hotels/cities')
            .then(r => setCities(r.data))
            .catch(() => {});
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams({
            city: destination,
            checkIn: dates ? dates[0].format('YYYY-MM-DD') : '',
            checkOut: dates ? dates[1].format('YYYY-MM-DD') : '',
            adults: options.adult, children: options.children, rooms: options.room
        });
        navigate(`/search-results?${params.toString()}`);
    };

    const guestContent = (
        <div className="p-5 space-y-4 w-72 bg-white rounded-2xl shadow-xl">
            {[
                { label: t('home.searchAdults'), key: 'adult', min: 1, max: 30 },
                { label: t('home.searchChildren'), key: 'children', min: 0, max: 10 },
                { label: t('home.searchRooms'), key: 'room', min: 1, max: 10 },
            ].map(f => (
                <div key={f.key} className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-gray-700">{f.label}</span>
                    <InputNumber min={f.min} max={f.max} value={options[f.key]}
                        onChange={val => setOptions({ ...options, [f.key]: val })}
                        className="rounded-xl" />
                </div>
            ))}
        </div>
    );

    const trending = [
        { city: 'Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1583417311753-157d60548170?auto=format&fit=crop&q=80&w=800', count: '1,234', color: '#1e3a5f' },
        { city: 'Đà Lạt',     img: 'https://images.unsplash.com/photo-1629739572627-8adbc7d3ecae?auto=format&fit=crop&q=80&w=800', count: '856',   color: '#1a3d2b' },
        { city: 'Hà Nội',     img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800', count: '2,100', color: '#3d1a1a' },
        { city: 'Phú Quốc',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800', count: '674',   color: '#1a2f3d' },
    ];

    return (
        <main style={{ background: '#f7f8fa', fontFamily: "'Inter', sans-serif" }}>
            {/* ── HERO ── */}
            <section style={{ background: NAVY, paddingBottom: '80px', paddingTop: '80px' }}>
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-bold uppercase tracking-widest"
                        style={{ background: CB + '18', color: CB, border: `1px solid ${CB}30` }}>
                        <i className="fa-solid fa-bolt"></i> {t('home.bestBooking')}
                    </div>
                    <h1 className="text-white font-black mb-6 leading-none"
                        style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.0 }}>
                        {t('home.heroTitle')}
                    </h1>
                    <p style={{ color: '#9ca3af', fontSize: 18, maxWidth: 560, margin: '0 auto 40px' }}>
                        {t('home.heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* ── SEARCH BOX ── */}
            <div className="max-w-[1140px] mx-auto px-4 -mt-6 relative z-20">
                <div className="bg-white rounded-[24px] p-2 shadow-2xl" style={{ border: '1px solid rgba(91,97,110,0.12)' }}>
                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Destination */}
                        <div className="flex items-center px-5 py-4 flex-[1.2] min-w-0 gap-3">
                            <i className="fa-solid fa-location-dot text-gray-300 text-lg shrink-0"></i>
                            <AutoComplete
                                options={cities.map(c => ({ value: c }))}
                                filterOption={(inp, opt) => opt.value.toUpperCase().includes(inp.toUpperCase())}
                                style={{ width: '100%' }} value={destination}
                                onChange={val => setDestination(val)}
                                placeholder={t('home.searchDestPlaceholder')}
                                variant="borderless"
                                className="font-medium text-base w-full min-w-0" />
                        </div>
                        {/* Dates */}
                        <div className="flex items-center px-4 py-3 flex-[1.5] min-w-[250px] lg:min-w-0 gap-3">
                            <i className="fa-regular fa-calendar text-gray-300 text-lg shrink-0"></i>
                            <ConfigProvider theme={{ token: { colorPrimary: CB, borderRadius: 12 } }}>
                                <RangePicker className="w-full font-medium" variant="borderless"
                                    format="DD/MM/YYYY"
                                    placeholder={[t('home.searchDateCheckIn'), t('home.searchDateCheckOut')]}
                                    onChange={val => setDates(val)}
                                    separator={<i className="fa-solid fa-arrow-right text-gray-300 text-xs"></i>} />
                            </ConfigProvider>
                        </div>
                        {/* Guests */}
                        <Popover content={guestContent} title={<span className="font-bold text-gray-800">{t('home.searchGuests')}</span>} trigger="click" placement="bottom">
                            <div className="flex items-center px-5 py-4 flex-1 min-w-0 gap-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-r-[22px]">
                                <i className="fa-regular fa-user text-gray-300 text-lg shrink-0"></i>
                                <span className="text-gray-600 font-medium text-sm flex-1 truncate">
                                    {options.adult} {t('home.searchAdults')} · {options.children} {t('home.searchChildren')} · {options.room} {t('home.searchRooms')}
                                </span>
                                <i className="fa-solid fa-chevron-down text-gray-300 text-xs shrink-0"></i>
                            </div>
                        </Popover>
                        {/* CTA */}
                        <div className="flex items-center p-2">
                            <button type="button" onClick={handleSearch}
                                className="font-bold text-white px-8 py-4 rounded-[18px] whitespace-nowrap transition-all active:scale-95 w-full md:w-auto"
                                style={{ background: CB, fontSize: 15 }}
                                onMouseOver={e => e.currentTarget.style.background = '#578bfa'}
                                onMouseOut={e => e.currentTarget.style.background = CB}>
                                {t('home.searchButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TRENDING ── */}
            <section className="max-w-6xl mx-auto px-4 py-20">
                <div className="mb-10">
                    <h2 className="font-black text-[#0a0b0d] mb-2" style={{ fontSize: 36, lineHeight: 1.1 }}>
                        {t('home.trendingTitle')}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: 16 }}>{t('home.trendingSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {trending.map(dest => (
                        <div key={dest.city}
                            onClick={() => navigate(`/search-results?city=${encodeURIComponent(dest.city)}`)}
                            className="relative rounded-[28px] overflow-hidden cursor-pointer group"
                            style={{ height: 280 }}>
                            <div className="absolute inset-0" style={{ background: dest.color }}>
                                <img src={dest.img} alt={dest.city}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{ opacity: 0.85 }}
                                    onError={e => { e.target.src = `https://picsum.photos/seed/${dest.city}/800/600`; }} />
                            </div>
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,11,13,0.85) 0%, transparent 60%)' }}></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-black mb-1" style={{ fontSize: 26, lineHeight: 1.1 }}>{dest.city}</h3>
                                <p style={{ color: '#9ca3af', fontSize: 13 }}>{dest.count} {t('home.properties')}</p>
                            </div>
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: CB }}>
                                <i className="fa-solid fa-arrow-right text-white text-sm"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WHY BOOK ── */}
            <section style={{ background: NAVY, padding: '80px 0' }}>
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-white font-black text-center mb-16" style={{ fontSize: 36, lineHeight: 1.1 }}>
                        {t('home.whyChoose')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: 'fa-shield-halved', title: t('home.security'), desc: t('home.securityDesc'), color: '#006ce4' },
                            { icon: 'fa-bolt',          title: t('home.bestPrice'),   desc: t('home.bestPriceDesc'), color: '#10b981' },
                            { icon: 'fa-headset',       title: t('home.support'),     desc: t('home.supportDesc'),   color: '#f59e0b' },
                        ].map(f => (
                            <div key={f.title} className="p-8 rounded-[24px] transition-all"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                                    style={{ background: f.color + '20' }}>
                                    <i className={`fa-solid ${f.icon} text-lg`} style={{ color: f.color }}></i>
                                </div>
                                <h3 className="text-white font-bold mb-2" style={{ fontSize: 18 }}>{f.title}</h3>
                                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;