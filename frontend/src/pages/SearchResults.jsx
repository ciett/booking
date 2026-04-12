import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FilterSidebar from '../components/FilterSidebar';
import HotelCard from '../components/HotelCard';
import { useTranslation } from 'react-i18next';

const CB = '#006ce4';
const NAVY = '#003580';

const Skeleton = () => (
    <div className="flex gap-0 bg-white animate-pulse" style={{ border: '1px solid rgba(91,97,110,0.15)', borderRadius: 20, overflow: 'hidden' }}>
        <div className="shrink-0 bg-gray-100" style={{ width: 240, height: 200 }}></div>
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <div className="flex justify-between mb-3">
                    <div className="h-5 bg-gray-100 rounded-full w-2/3"></div>
                    <div className="h-9 w-9 bg-gray-100 rounded-xl"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-1/3 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-4/5"></div>
                </div>
            </div>
            <div className="flex justify-between items-end">
                <div className="h-7 bg-gray-100 rounded-full w-1/3"></div>
                <div className="h-10 w-32 bg-gray-100 rounded-full"></div>
            </div>
        </div>
    </div>
);

const EmptyState = ({ city, t }) => (
    <div className="bg-white rounded-[24px] p-16 flex flex-col items-center justify-center text-center"
        style={{ border: '1px solid rgba(91,97,110,0.15)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: CB + '12' }}>
            <i className="fa-solid fa-magnifying-glass-location text-3xl" style={{ color: CB }}></i>
        </div>
        <h3 className="font-black text-[#0a0b0d] text-xl mb-2" style={{ lineHeight: 1.1 }}>
            Không tìm thấy chỗ nghỉ nào ở {city || 'đây'}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed" style={{ color: '#6b7280' }}>
            {t('searchResults.emptyDesc', 'Vui lòng thử tìm kiếm địa điểm khác hoặc thay đổi ngày nhận, trả phòng.')}
        </p>
    </div>
);

const SearchResults = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [hotels, setHotels]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [sortBy, setSortBy]   = useState('topPicks');
    const [filters, setFilters] = useState({ rating: [], type: [] });

    const city     = searchParams.get('city')     || '';
    const checkIn  = searchParams.get('checkIn')  || '';
    const checkOut = searchParams.get('checkOut') || '';
    const adults   = parseInt(searchParams.get('adults'))   || 2;
    const children = parseInt(searchParams.get('children')) || 0;
    const rooms    = parseInt(searchParams.get('rooms'))    || 1;

    useEffect(() => {
        if (!city) { setLoading(false); return; }
        setLoading(true);
        axios.get('/api/hotels/search', { params: { city, checkIn, checkOut } })
            .then(res => {
                setHotels(res.data.map(h => ({
                    id: h.id, name: h.name,
                    rating: h.rating ? Number(h.rating).toFixed(1) : '0.0',
                    reviews: h.reviewCount || 0,
                    price: h.price || 0,
                    location: h.address || h.city,
                    image: h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
                    desc: h.description || t('searchResults.noDescription'),
                })));
            })
            .catch(() => setError(t('searchResults.fetchError')))
            .finally(() => setLoading(false));
    }, [city, checkIn, checkOut]);

    const filteredHotels = hotels.filter(h => {
        if (filters.rating.length > 0) {
            const r = parseFloat(h.rating) || 0;
            if (!filters.rating.some(v => (v === 'superb' && r >= 4.5) || (v === 'veryGood' && r >= 4.0) || (v === 'good' && r >= 3.5))) return false;
        }
        if (filters.type.length > 0) {
            const n = h.name.toLowerCase(), d = h.desc.toLowerCase();
            if (!filters.type.some(v =>
                (v === 'apartment' && (n.includes('apartment') || n.includes('căn hộ') || d.includes('căn hộ'))) ||
                (v === 'hotel'     && (n.includes('hotel')     || n.includes('khách sạn')))                      ||
                (v === 'villa'     && (n.includes('villa')     || n.includes('biệt thự') || d.includes('biệt thự'))) ||
                (v === 'resort'    && (n.includes('resort')    || d.includes('resort')))
            )) return false;
        }
        return true;
    });

    const sortedHotels = [...filteredHotels].sort((a, b) => {
        if (sortBy === 'lowestPrice') return (Number(String(a.price).replace(/\D/g,''))||0) - (Number(String(b.price).replace(/\D/g,''))||0);
        if (sortBy === 'rating')      return (parseFloat(b.rating)||0) - (parseFloat(a.rating)||0);
        return 0;
    });

    const sortTabs = [
        { key: 'topPicks',    label: t('searchResults.topPicks',    'Lựa chọn hàng đầu') },
        { key: 'lowestPrice', label: t('searchResults.lowestPrice', 'Giá thấp nhất') },
        { key: 'rating',      label: t('searchResults.ratingAndPrice', 'Đánh giá cao nhất') },
    ];

    return (
        <div style={{ background: '#f7f8fa', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs font-semibold" style={{ color: CB }}>
                <span>Trang chủ</span>
                <i className="fa-solid fa-chevron-right text-[8px] text-gray-300"></i>
                <span>Việt Nam</span>
                <i className="fa-solid fa-chevron-right text-[8px] text-gray-300"></i>
                <span style={{ color: '#6b7280' }}>{city || 'Tìm kiếm'}</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-12 flex flex-col md:flex-row gap-6">
                <FilterSidebar filters={filters} onFilterChange={setFilters} />

                <main className="flex-1">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="font-black text-[#0a0b0d] mb-1" style={{ fontSize: 28, lineHeight: 1.1 }}>
                            {city || 'Tất cả chỗ nghỉ'}
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 14 }}>
                            {loading ? 'Đang tìm kiếm...' : `${hotels.length} chỗ nghỉ được tìm thấy`}
                            {(checkIn && checkOut) && ` · ${checkIn} → ${checkOut}`}
                        </p>
                    </div>

                    {/* Sort Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                        {sortTabs.map(tab => (
                            <button key={tab.key}
                                onClick={() => setSortBy(tab.key)}
                                className="px-5 py-2.5 rounded-[56px] text-sm font-bold whitespace-nowrap transition-all"
                                style={sortBy === tab.key
                                    ? { background: '#0a0b0d', color: '#fff' }
                                    : { background: '#fff', color: '#374151', border: '1px solid rgba(91,97,110,0.2)' }}
                                onMouseOver={e => { if (sortBy !== tab.key) e.currentTarget.style.background = '#eef0f3'; }}
                                onMouseOut={e => { if (sortBy !== tab.key) e.currentTarget.style.background = '#fff'; }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        {loading ? (
                            <>{[1,2,3].map(i => <Skeleton key={i} />)}</>
                        ) : error ? (
                            <div className="text-center py-16 rounded-[24px]"
                                style={{ background: '#fee2e220', border: '1px solid #dc262640', color: '#fca5a5' }}>
                                <i className="fa-solid fa-triangle-exclamation text-3xl mb-3 block"></i>
                                <p className="font-semibold">{error}</p>
                            </div>
                        ) : sortedHotels.length === 0 ? (
                            <EmptyState city={city} t={t} />
                        ) : (
                            sortedHotels.map(hotel => (
                                <HotelCard key={hotel.id} hotel={hotel}
                                    checkIn={checkIn} checkOut={checkOut}
                                    adults={adults} children={children} rooms={rooms} />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SearchResults;