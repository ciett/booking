import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, ConfigProvider, InputNumber, Popover, AutoComplete } from 'antd';
import dayjs from 'dayjs';
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
        const params = new URLSearchParams({
            city: destination,
            checkIn: dates ? dates[0].format('YYYY-MM-DD') : '',
            checkOut: dates ? dates[1].format('YYYY-MM-DD') : '',
            adults: options.adult,
            children: options.children,
            rooms: options.room
        });
        navigate(`/search-results?${params.toString()}`);
    };

    // Nội dung bên trong ô chọn số người (Popover content)
    const content = (
        <div className="p-4 space-y-4 w-64 bg-white">
            <div className="flex justify-between items-center">
                <span className="font-medium">Người lớn</span>
                <InputNumber min={1} max={30} value={options.adult} onChange={(val) => setOptions({...options, adult: val})} />
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">Trẻ em</span>
                <InputNumber min={0} max={10} value={options.children} onChange={(val) => setOptions({...options, children: val})} />
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">Phòng</span>
                <InputNumber min={1} max={10} value={options.room} onChange={(val) => setOptions({...options, room: val})} />
            </div>
        </div>
    );

    return (
        <main className="grow">
            {/* Hero Section */}
            <div className="search-banner">
                <div className="section-container pt-12 pb-20">
                    <h1 className="text-5xl font-extrabold mb-4">Tìm chỗ nghỉ tiếp theo</h1>
                    <p className="text-2xl">Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà ở và nhiều hơn nữa...</p>
                </div>
            </div>

            {/* Search Box */}
            <div className="search-box-container relative z-10">
                <div className="bg-[#ffb700] p-1 rounded-lg shadow-lg">
                    <div className="flex flex-col md:flex-row bg-white rounded-md overflow-hidden">

                        {/* Điểm đến */}
                        <div className="flex-1 flex items-center p-3 border-b md:border-b-0 md:border-r border-yellow-400">
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
                                className="w-full font-semibold custom-home-autocomplete"
                            />
                        </div>

                        {/* Ngày tháng */}
                        <div className="flex-1 flex items-center p-1 border-b md:border-b-0 md:border-r border-yellow-400">
                            <ConfigProvider theme={{ token: { colorPrimary: '#003b95' } }}>
                                <RangePicker 
                                    className="w-full border-none font-semibold" 
                                    placeholder={['Ngày nhận', 'Ngày trả']}
                                    onChange={(val) => setDates(val)}
                                    variant="borderless"
                                />
                            </ConfigProvider>
                        </div>

                        {/* Khách/Phòng */}
                        <Popover content={content} title="Số lượng" trigger="click" placement="bottom">
                            <div className="flex-1 flex items-center p-3 border-b md:border-b-0 md:border-r border-yellow-400 cursor-pointer hover:bg-gray-50">
                                <i className="fa-regular fa-user text-gray-400 mr-3 text-xl"></i>
                                <span className="text-gray-700 font-semibold truncate">
                                    {options.adult} người lớn · {options.children} trẻ em · {options.room} phòng
                                </span>
                            </div>
                        </Popover>

                        {/* Nút Tìm kiếm */}
                        <button 
                            type="button" 
                            onClick={handleSearch}
                            className="bg-[#003b95] hover:bg-[#002b6d] text-white font-bold text-xl px-10 py-4 transition-colors"
                        >
                            Tìm kiếm
                        </button>

                    </div>
                </div>
            </div>

            {/* Điểm đến thịnh hành */}
            <div className="section-container py-12">
                <h2 className="text-2xl font-bold mb-4">Điểm đến thịnh hành</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                        onClick={() => navigate('/search-results')}
                        className="rounded-lg overflow-hidden relative h-64 cursor-pointer group shadow-md"
                    >
                        <img src="https://images.unsplash.com/photo-1583417311753-157d60548170?w=800" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="HCMC"/>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">TP. Hồ Chí Minh</h3>
                    </div>
                    <div 
                        onClick={() => navigate('/search-results')}
                        className="rounded-lg overflow-hidden relative h-64 cursor-pointer group shadow-md"
                    >
                        <img src="https://images.unsplash.com/photo-1629739572627-8adbc7d3ecae?w=800" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Da Lat"/>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">Đà Lạt</h3>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;