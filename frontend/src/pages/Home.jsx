import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, ConfigProvider, InputNumber, Popover, AutoComplete } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

const Home = () => {
    const navigate = useNavigate();
    
    // States cho tìm kiếm
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState(null);
    
    // State cho số lượng người/phòng
    const [options, setOptions] = useState({
        adult: 2,
        children: 0,
        room: 1,
    });
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('/api/hotels/cities');
                setCities(response.data);
            } catch (error) {
                console.error("Error fetching hotel cities", error);
            }
        };
        fetchCities();
    }, []);

    // Hàm điều hướng khi bấm nút Tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        // Chuyển sang trang kết quả
        navigate('/search-results');
    };

    // Nội dung bên trong ô chọn số người (Popover content)
    const content = (
        <div className="p-5 space-y-4 w-72 bg-white rounded-xl shadow-xl">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Người lớn</span>
                <InputNumber min={1} max={30} value={options.adult} onChange={(val) => setOptions({...options, adult: val})} className="rounded-lg" />
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Trẻ em</span>
                <InputNumber min={0} max={10} value={options.children} onChange={(val) => setOptions({...options, children: val})} className="rounded-lg" />
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Phòng</span>
                <InputNumber min={1} max={10} value={options.room} onChange={(val) => setOptions({...options, room: val})} className="rounded-lg" />
            </div>
        </div>
    );

    return (
        <main className="grow bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-booking-blue via-blue-800 to-indigo-900 text-white relative w-full pt-16 pb-32 px-4 sm:px-6 lg:px-8 shadow-inner overflow-hidden">
                {/* Decorative background overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                
                <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
                        Tìm chỗ nghỉ tiếp theo
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-blue-100 max-w-2xl drop-shadow-sm">
                        Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà ở và nhiều hơn nữa...
                    </p>
                </div>
            </div>

            {/* Search Box - Floating Over Hero */}
            <div className="max-w-6xl mx-auto px-4 relative z-20 -mt-12">
                <div className="bg-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
                    <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200">

                        {/* Điểm đến */}
                        <div className="flex-1 flex items-center p-3 md:p-4 hover:bg-gray-50 transition-colors cursor-text">
                            <i className="fa-solid fa-bed text-gray-400 mr-3 text-xl"></i>
                            <AutoComplete
                                options={cities.map(city => ({ value: city }))}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                                style={{ width: '100%' }}
                                placeholder="Bạn muốn đến đâu?"
                                value={destination}
                                onChange={(val) => setDestination(val)}
                                variant="borderless"
                                className="w-full font-semibold custom-home-autocomplete text-lg"
                            />
                        </div>

                        {/* Ngày tháng */}
                        <div className="flex-1 flex items-center p-2.5 md:p-3 hover:bg-gray-50 transition-colors">
                            <ConfigProvider theme={{ token: { colorPrimary: '#003b95', borderRadius: 8 } }}>
                                <RangePicker 
                                    className="w-full font-semibold text-lg cursor-pointer" 
                                    placeholder={['Ngày nhận', 'Ngày trả']}
                                    onChange={(val) => setDates(val)}
                                    variant="borderless"
                                    separator={<i className="fa-solid fa-arrow-right text-gray-400 text-sm"></i>}
                                />
                            </ConfigProvider>
                        </div>

                        {/* Khách/Phòng */}
                        <Popover content={content} title={<span className="font-bold text-gray-800 text-lg">Số lượng</span>} trigger="click" placement="bottom">
                            <div className="flex-1 flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                <i className="fa-regular fa-user text-gray-400 mr-3 text-xl"></i>
                                <span className="text-gray-700 font-semibold text-lg truncate flex-1">
                                    {options.adult} người lớn · {options.children} trẻ em · {options.room} phòng
                                </span>
                                <i className="fa-solid fa-chevron-down text-gray-400 text-sm ml-2"></i>
                            </div>
                        </Popover>

                        {/* Nút Tìm kiếm */}
                        <button 
                            type="button" 
                            onClick={handleSearch}
                            className="bg-[#003b95] hover:bg-blue-800 text-white font-bold text-xl px-12 py-4 transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            <span className="flex items-center justify-center space-x-2">
                                <span>Tìm kiếm</span>
                            </span>
                        </button>

                    </div>
                </div>
            </div>

            {/* Điểm đến thịnh hành */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Điểm đến thịnh hành</h2>
                <p className="text-gray-500 mb-8 text-lg">Các lựa chọn phổ biến nhất dành cho du khách từ Việt Nam</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* HCMC Card */}
                    <div 
                        onClick={() => navigate('/search-results')}
                        className="rounded-2xl overflow-hidden relative h-72 cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        {/* Reliable image source with gradient fallback */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-400">
                            <img src="https://images.unsplash.com/photo-1583417311753-157d60548170?auto=format&fit=crop&q=80&w=800" 
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                                 alt="Hồ Chí Minh"
                                 onError={(e) => {
                                     e.target.onerror = null; 
                                     e.target.src = "https://picsum.photos/seed/hcmc/800/600";
                                 }}
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-white text-3xl font-bold mb-1 drop-shadow-lg flex items-center group-hover:-translate-y-1 transition-transform">
                                TP. Hồ Chí Minh
                                <img src="https://flagcdn.com/w40/vn.png" className="w-6 h-4 ml-3 rounded-sm shadow-sm" alt="Vietnam" />
                            </h3>
                            <p className="text-blue-100 font-medium transform group-hover:-translate-y-1 transition-transform delay-75">1,234 chỗ nghỉ</p>
                        </div>
                    </div>

                    {/* Da Lat Card */}
                    <div 
                        onClick={() => navigate('/search-results')}
                        className="rounded-2xl overflow-hidden relative h-72 cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-800 to-green-500">
                            <img src="https://images.unsplash.com/photo-1629739572627-8adbc7d3ecae?auto=format&fit=crop&q=80&w=800" 
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                                 alt="Đà Lạt"
                                 onError={(e) => {
                                     e.target.onerror = null; 
                                     e.target.src = "https://picsum.photos/seed/dalat/800/600";
                                 }}
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-white text-3xl font-bold mb-1 drop-shadow-lg flex items-center group-hover:-translate-y-1 transition-transform">
                                Đà Lạt
                                <img src="https://flagcdn.com/w40/vn.png" className="w-6 h-4 ml-3 rounded-sm shadow-sm" alt="Vietnam" />
                            </h3>
                            <p className="text-blue-100 font-medium transform group-hover:-translate-y-1 transition-transform delay-75">856 chỗ nghỉ</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;