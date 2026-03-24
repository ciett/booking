import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FilterSidebar from '../components/FilterSidebar';
import HotelCard from '../components/HotelCard';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const city = searchParams.get('city') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';

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
                    rating: h.rating || "0.0",
                    reviews: h.reviewCount || 0,
                    price: h.price ? h.price.toLocaleString('vi-VN') : "Liên hệ",
                    location: h.address || h.city,
                    image: h.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
                    desc: h.description || "Không có mô tả cho khách sạn này."
                }));
                
                setHotels(mappedHotels);
            } catch (err) {
                console.error("Error fetching hotels:", err);
                setError("Không thể tải danh sách khách sạn. Vui lòng thử lại.");
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

    return (
        <div className="bg-white min-h-screen pb-10">
            {/* Breadcrumbs nhỏ */}
            <div className="section-container py-3 text-[11px] text-[#006ce4] flex items-center gap-2">
                <span>Trang chủ</span> <i className="fa-solid fa-chevron-right text-[8px] text-gray-400"></i>
                <span>Việt Nam</span> <i className="fa-solid fa-chevron-right text-[8px] text-gray-400"></i>
                <span className="text-gray-500 font-medium italic">Kết quả tìm kiếm</span>
            </div>

            <div className="section-container flex flex-col md:flex-row gap-6">
                {/* CỘT TRÁI */}
                <FilterSidebar />

                {/* CỘT PHẢI */}
                <main className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {city}: {loading ? "Đang tìm..." : `tìm thấy ${hotels.length} chỗ nghỉ`}
                    </h1>
                    
                    {/* Thanh Tab sắp xếp nhanh */}
                    <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
                        <button className="px-4 py-3 text-sm font-bold text-[#006ce4] border-b-2 border-[#006ce4] whitespace-nowrap">Lựa chọn hàng đầu</button>
                        <button className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">Giá thấp nhất trước</button>
                        <button className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">Điểm đánh giá & Giá</button>
                    </div>

                    {/* Danh sách thẻ khách sạn */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
                        ) : error ? (
                            <div className="text-center py-20 text-red-500">{error}</div>
                        ) : hotels.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">Không tìm thấy chỗ nghỉ nào tại {city}.</div>
                        ) : (
                            hotels.map(hotel => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SearchResults;