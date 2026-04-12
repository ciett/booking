import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DetailOverlay from './DetailOverlay';
import { useTranslation } from 'react-i18next';

const CB = '#006ce4';
const NAVY = '#003b95';

const getRatingInfo = (rating) => {
    const r = parseFloat(rating) || 0;
    if (r >= 4.5) return { key: 'hotelCard.superb',    color: '#003b95', bg: '#003b9515' };
    if (r >= 4.0) return { key: 'hotelCard.excellent', color: '#006ce4', bg: '#006ce415' };
    if (r >= 3.5) return { key: 'hotelCard.veryGood',  color: '#f59e0b', bg: '#f59e0b15' };
    if (r >= 3.0) return { key: 'hotelCard.good',      color: '#6b7280', bg: '#6b728015' };
    return          { key: 'hotelCard.acceptable',     color: '#dc2626', bg: '#dc262615' };
};

const HotelCard = ({ hotel, checkIn, checkOut, adults = 2, children = 0, rooms = 1 }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const nights     = (checkIn && checkOut) ? Math.max(1, dayjs(checkOut).diff(dayjs(checkIn), 'day')) : 1;
    const basePrice  = Number(String(hotel.price).replace(/[^0-9]/g, '')) || 0;
    const totalPrice = basePrice * nights * rooms;
    const formatted  = totalPrice.toLocaleString('vi-VN');

    const ri         = getRatingInfo(hotel.rating);
    const ratingText = t(ri.key);

    const checkoutUrl = `/checkout?type=hotel&name=${encodeURIComponent(hotel.name)}&price=${totalPrice}&details=${encodeURIComponent(JSON.stringify({
        'Địa chỉ': hotel.location,
        'Đánh giá': hotel.rating,
        'Thời gian ở': `${nights} đêm (${checkIn || 'Nay'} - ${checkOut || 'Mai'})`,
        'Số phòng': rooms
    }))}`;

    return (
        <div className="group flex flex-col md:flex-row gap-0 bg-white transition-all duration-300"
            style={{ border: '1px solid rgba(91,97,110,0.15)', borderRadius: 20, overflow: 'hidden' }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,82,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>

            {/* Image */}
            <div className="relative shrink-0" style={{ width: '100%', maxWidth: 240, height: 200, minHeight: 200 }}>
                <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name}
                    style={{ display: 'block' }} />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                    onMouseOver={e => e.currentTarget.style.color = '#dc2626'}
                    onMouseOut={e => e.currentTarget.style.color = '#6b7280'}>
                    <i className="fa-regular fa-heart text-sm text-gray-500"></i>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-5">
                <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-bold text-[#0a0b0d] text-lg leading-tight line-clamp-2 group-hover:text-[#006ce4] transition-colors cursor-pointer">
                            {hotel.name}
                        </h3>
                        {/* Rating badge */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className="text-right">
                                <p className="text-xs font-bold leading-tight" style={{ color: ri.color }}>{ratingText}</p>
                                <p className="text-[10px] text-gray-400">{hotel.reviews} đánh giá</p>
                            </div>
                            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-sm font-black shrink-0"
                                style={{ background: ri.color }}>
                                {hotel.rating}
                            </div>
                        </div>
                    </div>

                    <p className="text-xs font-semibold mb-3 cursor-pointer flex items-center gap-1"
                        style={{ color: CB }}>
                        <i className="fa-solid fa-location-dot text-[10px]"></i>
                        {hotel.location}
                    </p>

                    <div className="py-2 px-3 rounded-xl text-xs text-gray-600 line-clamp-2 mb-3"
                        style={{ background: '#f7f8fa', borderLeft: `3px solid ${CB}` }}>
                        {hotel.desc}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-semibold" style={{ color: '#10b981' }}>
                        <span><i className="fa-solid fa-check mr-1"></i>{t('hotelCard.freeCancel')}</span>
                        <span><i className="fa-solid fa-check mr-1"></i>{t('hotelCard.noPrepayment')}</span>
                    </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-end justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(91,97,110,0.1)' }}>
                    <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mr-2"
                            style={{ background: '#febb02', color: '#0a0b0d' }}>
                            {t('hotelCard.greatDeal')}
                        </span>
                        <p className="text-2xl font-black text-[#0a0b0d] mt-1">
                            {formatted} <span className="text-xs font-bold text-gray-400">VND</span>
                        </p>
                        <p className="text-[10px] text-gray-400">{nights} đêm · {adults} khách</p>
                    </div>

                    <DetailOverlay
                        trigger={
                            <button className="font-bold text-white px-6 py-3 rounded-[56px] transition-all text-sm"
                                style={{ background: CB }}
                                onMouseOver={e => e.currentTarget.style.background = '#578bfa'}
                                onMouseOut={e => e.currentTarget.style.background = CB}>
                                {t('hotelCard.checkAvailability')} <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
                            </button>
                        }
                        title={hotel.name}
                        description={hotel.location}
                        content={
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1.5 rounded-xl text-white text-sm font-bold" style={{ background: ri.color }}>{hotel.rating}</div>
                                    <span className="font-bold text-sm">{ratingText} · {hotel.reviews} đánh giá</span>
                                </div>
                                <div className="rounded-2xl overflow-hidden h-48">
                                    <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name} />
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{hotel.desc}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { icon: 'fa-check', text: t('hotelCard.freeCancel'), color: '#10b981' },
                                        { icon: 'fa-check', text: t('hotelCard.noPrepayment'), color: '#10b981' },
                                        { icon: 'fa-wifi',  text: t('hotelCard.freeWifi'), color: CB },
                                        { icon: 'fa-car',   text: t('hotelCard.parking'), color: CB },
                                    ].map(f => (
                                        <div key={f.text} className="flex items-center gap-2 text-xs font-semibold p-2 rounded-xl"
                                            style={{ background: f.color + '10', color: f.color }}>
                                            <i className={`fa-solid ${f.icon} text-xs`}></i> {f.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                        footer={
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-black text-[#0a0b0d]">{formatted} <span className="text-xs text-gray-400">VND</span></p>
                                    <p className="text-xs text-gray-400">{nights} đêm · {adults} khách</p>
                                </div>
                                <button onClick={() => navigate(checkoutUrl)}
                                    className="font-bold text-white px-8 py-3 rounded-[56px] transition-all"
                                    style={{ background: CB }}
                                    onMouseOver={e => e.currentTarget.style.background = '#578bfa'}
                                    onMouseOut={e => e.currentTarget.style.background = CB}>
                                    {t('hotelCard.bookNow')}
                                </button>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default HotelCard;