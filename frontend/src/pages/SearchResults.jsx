import React from 'react';
import FilterSidebar from '../components/FilterSidebar';
import HotelCard from '../components/HotelCard';

const SearchResults = () => {
    // Dữ liệu mẫu (sau này bạn sẽ gọi từ API)
    const dummyHotels = [
        { id: 1, name: "Golden Suites Saigon", rating: "8.5", reviews: 410, price: "1.250.000", location: "Quận 7, TP. HCM", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", desc: "Tọa lạc tại vị trí thuận tiện, chỗ nghỉ này cung cấp phòng ốc hiện đại với tầm nhìn ra thành phố..." },
        { id: 2, name: "The Reverie Saigon", rating: "9.4", reviews: 1250, price: "8.900.000", location: "Quận 1, TP. HCM", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500", desc: "Trải nghiệm đẳng cấp 5 sao ngay tại trung tâm Sài Gòn với phong cách thiết kế sang trọng..." },
        { id: 3, name: "Cozrum Homes - Amber House", rating: "8.1", reviews: 215, price: "650.000", location: "Quận 3, TP. HCM", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500", desc: "Không gian ấm cúng, phù hợp cho những chuyến du lịch tiết kiệm nhưng vẫn đầy đủ tiện nghi..." }
    ];

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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">TP. Hồ Chí Minh: tìm thấy {dummyHotels.length} chỗ nghỉ</h1>

                    {/* Thanh Tab sắp xếp nhanh */}
                    <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
                        <button className="px-4 py-3 text-sm font-bold text-[#006ce4] border-b-2 border-[#006ce4] whitespace-nowrap">Lựa chọn hàng đầu</button>
                        <button className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">Giá thấp nhất trước</button>
                        <button className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">Điểm đánh giá & Giá</button>
                    </div>

                    {/* Danh sách thẻ khách sạn */}
                    <div className="space-y-4">
                        {dummyHotels.map(hotel => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SearchResults;