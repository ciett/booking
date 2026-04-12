import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FilterSidebar from '../components/FilterSidebar';
import HotelCard from '../components/HotelCard';
import { useTranslation } from 'react-i18next';

const HotelCardSkeleton = () => (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 bg-white animate-pulse">
        <div className="w-full md:w-[240px] h-[240px] bg-gray-200 rounded-md shrink-0"></div>
        <div className="flex-1 flex flex-col justify-between py-2">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
            <div className="flex flex-col items-end mt-4 gap-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-md mt-2"></div>
            </div>
        </div>
    </div>
);

const EmptyState = ({ city, t }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-10 flex flex-col items-center justify-center text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <i className="fa-solid fa-magnifying-glass-location text-4xl text-[#006ce4]"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('searchResults.emptyTitle', { defaultValue: 'Không tìm thấy chỗ nghỉ nào ở {{city}}', city: city || 'đây' })}
        </h3>
        <p className="text-gray-500 max-w-md mb-6">
            {t('searchResults.emptyDesc', 'Rất tiếc, không có khách sạn nào phù hợp. Vui lòng thử tìm kiếm địa điểm khác hoặc thay đổi ngày nhận/trả phòng.')}
        </p>
    </div>
);

const SearchResults = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('topPicks');
    const [filters, setFilters] = useState({ rating: [], type: [] });

    const city = searchParams.get('city') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const adults = parseInt(searchParams.get('adults')) || 2;
    const children = parseInt(searchParams.get('children')) || 0;
    const rooms = parseInt(searchParams.get('rooms')) || 1;

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/hotels/search', {
                    params: { city, checkIn, checkOut }
                });
                
                // Map backend data to frontend format
                const mappedHotels = response.data.map(h => ({
                    id: h.id,
                    name: h.name,
                    rating: h.rating ? Number(h.rating).toFixed(1) : "0.0", // Dữ liệu backend đang là thang 5 nên lấy gốc
                    reviews: h.reviewCount || 0,
                    price: h.price ? h.price.toLocaleString('vi-VN') : t('searchResults.contact'),
                    location: h.address || h.city,
                    image: h.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
                    desc: h.description || t('searchResults.noDescription')
                }));
                
                setHotels(mappedHotels);
            } catch (err) {
                console.error("Error fetching hotels:", err);
                setError(t('searchResults.fetchError'));
            } finally {
                setLoading(false);
            }
        };

        if (city) {
            fetchHotels();
        } else {
            setLoading(false);
        }
    }, [city, checkIn, checkOut]);

    const filteredHotels = hotels.filter(h => {
        // Lọc theo Điểm đánh giá
        if (filters.rating.length > 0) {
            const numRating = parseFloat(h.rating) || 0;
            const ratingMatches = filters.rating.some(r => {
                if (r === 'superb') return numRating >= 4.5;
                if (r === 'veryGood') return numRating >= 4.0;
                if (r === 'good') return numRating >= 3.5;
                return false;
            });
            if (!ratingMatches) return false;
        }

        // Lọc theo Loại chỗ ở
        if (filters.type.length > 0) {
            const nameLower = h.name.toLowerCase();
            const descLower = h.desc.toLowerCase();
            const typeMatches = filters.type.some(t => {
                if (t === 'apartment') return nameLower.includes('apartment') || nameLower.includes('căn hộ') || descLower.includes('căn hộ');
                if (t === 'hotel') return nameLower.includes('hotel') || nameLower.includes('khách sạn') || descLower.includes('khách sạn');
                if (t === 'villa') return nameLower.includes('villa') || nameLower.includes('biệt thự') || descLower.includes('biệt thự');
                if (t === 'resort') return nameLower.includes('resort') || nameLower.includes('nghỉ dưỡng') || descLower.includes('resort');
                return false;
            });
            if (!typeMatches) return false;
        }

        return true;
    });

    const sortedHotels = [...filteredHotels].sort((a, b) => {
        if (sortBy === 'lowestPrice') {
            const priceA = Number(String(a.price).replace(/[^0-9]/g, '')) || 0;
            const priceB = Number(String(b.price).replace(/[^0-9]/g, '')) || 0;
            return priceA - priceB;
        }
        if (sortBy === 'rating') {
            const ratingA = parseFloat(a.rating) || 0;
            const ratingB = parseFloat(b.rating) || 0;
            return ratingB - ratingA;
        }
        return 0;
    });

    return (
        <div className="bg-white min-h-screen pb-10">
            {/* Breadcrumbs nhỏ */}
            <div className="section-container py-3 text-[11px] text-[#006ce4] flex items-center gap-2">
                <span>{t('searchResults.home')}</span> <i className="fa-solid fa-chevron-right text-[8px] text-gray-400"></i>
                <span>{t('searchResults.vietnam')}</span> <i className="fa-solid fa-chevron-right text-[8px] text-gray-400"></i>
                <span className="text-gray-500 font-medium italic">{t('searchResults.searchResults')}</span>
            </div>

            <div className="section-container flex flex-col md:flex-row gap-6">
                {/* CỘT TRÁI */}
                <FilterSidebar filters={filters} onFilterChange={setFilters} />

                {/* CỘT PHẢI */}
                <main className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {city}: {loading ? t('searchResults.searching') : t('searchResults.foundCount', { count: hotels.length })}
                    </h1>
                    {/* Thanh Tab sắp xếp nhanh */}
                    <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
                        <button 
                            onClick={() => setSortBy('topPicks')} 
                            className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${sortBy === 'topPicks' ? 'font-bold text-[#006ce4] border-b-2 border-[#006ce4]' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {t('searchResults.topPicks', 'Lựa chọn hàng đầu')}
                        </button>
                        <button 
                            onClick={() => setSortBy('lowestPrice')} 
                            className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${sortBy === 'lowestPrice' ? 'font-bold text-[#006ce4] border-b-2 border-[#006ce4]' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {t('searchResults.lowestPrice', 'Giá thấp nhất')}
                        </button>
                        <button 
                            onClick={() => setSortBy('rating')} 
                            className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${sortBy === 'rating' ? 'font-bold text-[#006ce4] border-b-2 border-[#006ce4]' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {t('searchResults.ratingAndPrice', 'Đánh giá từ cao đến thấp')}
                        </button>
                    </div>

                    {/* Danh sách thẻ khách sạn */}
                    <div className="space-y-4">
                        {loading ? (
                            <>
                                <HotelCardSkeleton />
                                <HotelCardSkeleton />
                                <HotelCardSkeleton />
                            </>
                        ) : error ? (
                            <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100 animate-fade-in-up">
                                <i className="fa-solid fa-triangle-exclamation text-3xl mb-3"></i>
                                <p className="font-semibold">{error}</p>
                            </div>
                        ) : sortedHotels.length === 0 ? (
                            <EmptyState city={city} t={t} />
                        ) : (
                            sortedHotels.map(hotel => (
                                <HotelCard 
                                    key={hotel.id} 
                                    hotel={hotel} 
                                    checkIn={checkIn}
                                    checkOut={checkOut}
                                    adults={adults}
                                    children={children}
                                    rooms={rooms}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SearchResults;