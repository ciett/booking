import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DetailOverlay from './DetailOverlay';
import { useTranslation } from 'react-i18next';

const HotelCard = ({ hotel, checkIn, checkOut, adults = 2, children = 0, rooms = 1 }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // Tính toán số đêm, tối thiểu là 1
    const nights = (checkIn && checkOut) ? Math.max(1, dayjs(checkOut).diff(dayjs(checkIn), 'day')) : 1;
    
    // Lấy giá cơ bản (xử lý chuỗi có dấu phân cách hoặc chữ)
    const basePrice = Number(String(hotel.price).replace(/[^0-9]/g, '')) || 0;
    const totalPrice = basePrice * nights * rooms;
    const formattedTotal = totalPrice.toLocaleString('vi-VN');

    // Chuyển đổi điểm số thành nhận xét
    const getRatingTextKey = (rating) => {
        const numRating = parseFloat(rating) || 0;
        if (numRating >= 4.5) return 'hotelCard.superb';
        if (numRating >= 4.0) return 'hotelCard.excellent';
        if (numRating >= 3.5) return 'hotelCard.veryGood';
        if (numRating >= 3.0) return 'hotelCard.good';
        return 'hotelCard.acceptable';
    };
    const ratingText = t(getRatingTextKey(hotel.rating));

    return (
        <div className="border border-gray-300 rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow bg-white">
            {/* Ảnh bên trái */}
            <div className="relative w-full md:w-[240px] h-[240px] shrink-0">
                <img src={hotel.image} className="w-full h-full object-cover rounded-md" alt="hotel" />
                <button className="absolute top-2 right-2 text-white text-xl drop-shadow-md hover:text-red-500">
                    <i className="fa-regular fa-heart"></i>
                </button>
            </div>

            {/* Nội dung ở giữa và bên phải */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-[#006ce4] hover:text-[#a36100] cursor-pointer line-clamp-1">
                            {hotel.name}
                        </h3>
                        {/* Ô điểm số xanh đậm */}
                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <p className="font-bold text-sm leading-tight">{ratingText}</p>
                                <p className="text-[11px] text-gray-500">{t('hotelCard.reviews', { count: hotel.reviews })}</p>
                            </div>
                            <div className="bg-[#003580] text-white w-8 h-8 flex items-center justify-center rounded-t-md rounded-br-md font-bold">
                                {hotel.rating}
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-xs text-[#006ce4] underline mb-2 cursor-pointer">{hotel.location} • {t('hotelCard.viewOnMap')}</p>
                    <div className="border-l-2 border-gray-200 pl-2 mt-2">
                        <p className="text-xs font-bold text-gray-700">{t('hotelCard.studioApartment')}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{hotel.desc}</p>
                        <p className="text-xs font-bold text-green-700 mt-1">{t('hotelCard.freeCancel')} • {t('hotelCard.noPrepayment')}</p>
                    </div>
                </div>

                {/* Giá tiền và Nút bấm */}
                <div className="flex flex-col items-end mt-4">
                    <span className="bg-[#febb02] text-[10px] font-bold px-2 py-0.5 rounded-sm mb-1">
                        {t('hotelCard.greatDeal')}
                    </span>
                    <p className="text-[11px] text-gray-500">{t('hotelCard.nights', { count: nights })}, {t('hotelCard.adults', { count: adults })}{children > 0 ? t('hotelCard.children', { count: children }) : ''}{rooms > 1 ? t('hotelCard.rooms', { count: rooms }) : ''}</p>
                    <p className="text-2xl font-bold text-gray-900">VND {formattedTotal}</p>
                    <p className="text-[10px] text-gray-500 mb-2">{t('hotelCard.includesTaxes')}</p>
                    <DetailOverlay 
                        trigger={
                            <button className="bg-[#006ce4] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#003b95] transition flex items-center gap-2">
                                {t('hotelCard.checkAvailability')} <i className="fa-solid fa-chevron-right text-xs"></i>
                            </button>
                        }
                        title={hotel.name}
                        description={hotel.location}
                        content={
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#003580] text-white px-2 py-1 rounded-sm font-bold">{hotel.rating}</div>
                                    <span className="font-bold">{ratingText} • {t('hotelCard.reviews', { count: hotel.reviews })}</span>
                                </div>
                                <div className="rounded-lg overflow-hidden h-48">
                                    <img src={hotel.image} className="w-full h-full object-cover" alt="hotel detail" />
                                </div>
                                <div className="prose prose-sm text-gray-600">
                                    <p className="font-semibold text-gray-900 mb-1">{t('hotelCard.descTitle')}</p>
                                    <p>{hotel.desc}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
                                        <i className="fa-solid fa-check"></i> {t('hotelCard.freeCancel')}
                                    </div>
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
                                        <i className="fa-solid fa-check"></i> {t('hotelCard.noPrepayment')}
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded">
                                        <i className="fa-solid fa-wifi"></i> {t('hotelCard.freeWifi')}
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded">
                                        <i className="fa-solid fa-parking"></i> {t('hotelCard.parking')}
                                    </div>
                                </div>
                            </div>
                        }
                        footer={
                            <div className="flex flex-col items-end">
                                <p className="text-xl font-bold text-gray-900 mb-1">VND {formattedTotal}</p>
                                <button
                                  onClick={() => navigate(`/checkout?type=hotel&name=${encodeURIComponent(hotel.name)}&price=${totalPrice}&details=${encodeURIComponent(JSON.stringify({ 'Địa chỉ': hotel.location, 'Đánh giá': hotel.rating, 'Thời gian ở': `${nights} đêm (${checkIn || 'Nay'} - ${checkOut || 'Mai'})`, 'Số phòng': rooms }))}`)}
                                  className="bg-[#006ce4] text-white px-8 py-2 rounded-md font-bold hover:bg-[#003b95] transition"
                                >{t('hotelCard.bookNow')}</button>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default HotelCard;