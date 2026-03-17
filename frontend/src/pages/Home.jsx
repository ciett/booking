<script src="http://localhost:5173"></script>
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Home = () => {
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestedCities, setSuggestedCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('/api/hotels/cities');
                setSuggestedCities(response.data);
            } catch (error) {
                console.error("Error fetching cities", error);
            }
        };
        fetchCities();
    }, []);

    const handleSearch = async () => {
        if (!destination) return;
        setLoading(true);
        try {
            let url = `/api/hotels/search?city=${destination}`;
            if (dates && dates.length === 2 && dates[0] && dates[1]) {
                const checkIn = dates[0].format('YYYY-MM-DD');
                const checkOut = dates[1].format('YYYY-MM-DD');
                url += `&checkIn=${checkIn}&checkOut=${checkOut}`;
            }
            const response = await axios.get(url);
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching hotels", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="grow">
            {/* Hero Section - Phần giới thiệu đầu trang */}
            <div className="bg-booking-blue text-white">
                <div className="max-w-6xl mx-auto px-4 pt-12 pb-20">
                    <h1 className="text-5xl font-extrabold mb-4">Tìm chỗ nghỉ tiếp theo</h1>
                    <p className="text-2xl">Tìm kiếm giá thấp cho khách sạn, nhà ở và nhiều hơn nữa...</p>
                </div>
            </div>

            {/* Search Box - Thanh tìm kiếm */}
            <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
                <div className="bg-booking-yellow p-1 rounded-lg shadow-lg">
                    <form className="flex flex-col md:flex-row bg-white rounded-md overflow-hidden">

                        {/* Điểm đến */}
                        <div className="flex-1 flex items-center p-3 border-b md:border-b-0 md:border-r border-yellow-400">
                            <i className="fa-solid fa-bed text-gray-400 mr-3 text-xl"></i>
                            <Autocomplete
                                freeSolo
                                options={suggestedCities}
                                value={destination}
                                onChange={(event, newValue) => {
                                    setDestination(newValue || '');
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setDestination(newInputValue);
                                }}
                                disableClearable
                                className="w-full"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Bạn muốn đến đâu?"
                                        variant="standard"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                                        InputProps={{
                                            ...params.InputProps,
                                            disableUnderline: true,
                                            className: "!text-gray-700 !font-semibold !placeholder-gray-500",
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                padding: '0 !important',
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>

                        {/* Ngày tháng */}
                        <div className="flex-1 flex items-center p-3 border-b md:border-b-0 md:border-r border-yellow-400 cursor-pointer">
                            <i className="fa-regular fa-calendar text-gray-400 mr-3 text-xl"></i>
                            <ConfigProvider theme={{ token: { colorPrimary: '#003b95' } }}>
                                <RangePicker
                                    value={dates}
                                    onChange={(val) => setDates(val)}
                                    disabledDate={current => current && current < dayjs().startOf('day')}
                                    variant="borderless"
                                    className="w-full flex-1 font-semibold text-gray-700 px-0!"
                                    placeholder={['Nhận phòng', 'Trả phòng']}
                                    format="DD/MM/YYYY"
                                />
                            </ConfigProvider>
                        </div>

                        {/* Khách/Phòng */}
                        <div className="flex-1 flex items-center p-3 border-b md:border-b-0 md:border-r border-yellow-400 cursor-pointer">
                            <i className="fa-regular fa-user text-gray-400 mr-3 text-xl"></i>
                            <span className="text-gray-700 font-semibold truncate">2 người lớn · 0 trẻ em · 1 phòng</span>
                        </div>

                        {/* Search Button */}
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="bg-booking-blue hover:bg-booking-dark text-white font-bold text-xl px-8 py-4 transition-colors">
                            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                        </button>

                    </form>
                </div>

                {/* Tùy chọn Checkbox */}
                <div className="flex items-center mt-3 text-sm text-gray-800 font-medium space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 mr-2 accent-booking-blue border-gray-300 rounded" />
                        Tôi đang tìm một căn nhà hay căn hộ nguyên căn
                    </label>
                </div>
            </div>

            {/* Search Results */}
            {results.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm tại {destination}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.map((hotel) => (
                            <div key={hotel.id} className="bg-white rounded-lg p-4 shadow border border-gray-200 flex flex-col cursor-pointer hover:shadow-lg transition">
                                <div className="h-40 bg-gray-200 rounded-md mb-3 bg-cover bg-center" style={{ backgroundImage: hotel.imageUrl ? `url(${hotel.imageUrl})` : 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80)' }}></div>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-booking-blue">{hotel.name}</h3>
                                    {hotel.starRating && <span className="bg-yellow-400 text-white font-bold px-2 py-0.5 rounded text-xs">{hotel.starRating}★</span>}
                                </div>
                                <p className="text-xs text-booking-blue underline mb-2"><i className="fa-solid fa-location-dot mr-1"></i>{hotel.address}, {hotel.city}</p>
                                <p className="text-sm text-gray-600 line-clamp-2 grow">{hotel.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Offers & Trending Destinations */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                
                {/* Mục Ưu đãi */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-2">Ưu đãi</h2>
                    <p className="text-gray-600 mb-4">Khuyến mãi, giảm giá và ưu đãi đặc biệt dành cho bạn</p>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Ưu đãi 1 */}
                        <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row shadow border border-gray-200">
                            <div className="flex-1 pr-4">
                                <h3 className="font-bold text-lg mb-1">Hãy tận hưởng kỳ nghỉ dài nhất của bạn</h3>
                                <p className="text-gray-600 mb-4 text-sm">Duyệt các chỗ nghỉ cung cấp kỳ nghỉ dài hạn, nhiều nơi có giá giảm theo tháng.</p>
                                <button className="bg-booking-blue text-white px-4 py-2 rounded font-semibold hover:bg-booking-dark">Tìm chỗ nghỉ</button>
                            </div>
                            <div className="w-full md:w-32 h-32 mt-4 md:mt-0 bg-cover bg-center rounded" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c53cd3b8ffac?w=400&q=80')" }}></div>
                        </div>

                        {/* Ưu đãi 2 */}
                        <div className="bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80')] bg-cover bg-center rounded-lg p-6 text-white shadow relative">
                            <div className="absolute inset-0 text-white px-4 py-2 rounded font-semibold"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <h3 className="font-bold text-2xl mb-1">Thoát khỏi nhịp sống thường ngày</h3>
                                    <p className="mb-4">Tận hưởng sự tự do với kỳ nghỉ hàng tháng trên Booking.com</p>
                                </div>
                                <button className="bg-booking-blue text-white w-max px-4 py-2 rounded font-semibold hover:bg-booking-dark mt-4">Khám phá kỳ nghỉ hàng tháng</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Điểm đến thịnh hành */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Điểm đến thịnh hành</h2>
                    <p className="text-gray-600 mb-4">Các lựa chọn phổ biến nhất cho du khách từ Việt Nam</p>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {/* TP. Hồ Chí Minh */}
                        <div className="col-span-2 md:col-span-3 rounded-lg overflow-hidden relative cursor-pointer group h-64">
                            <img src="https://images.unsplash.com/photo-1583417311753-157d60548170?w=800&q=80" alt="HCMC" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-gray-900 via-transparent to-transparent p-4">
                                <h3 className="text-white font-bold text-2xl flex items-center space-x-2">Hồ Chí Minh <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="ml-2 w-6 h-4 rounded" /></h3>
                            </div>
                        </div>

                        {/* Đà Lạt */}
                        <div className="col-span-2 md:col-span-3 rounded-lg overflow-hidden relative cursor-pointer group h-64">
                            <img src="https://images.unsplash.com/photo-1629739572627-8adbc7d3ecae?w=800&q=80" alt="Da Lat" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-gray-900 via-transparent to-transparent p-4">
                                <h3 className="text-white font-bold text-2xl flex items-center space-x-2">Đà Lạt <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="ml-2 w-6 h-4 rounded" /></h3>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Home;