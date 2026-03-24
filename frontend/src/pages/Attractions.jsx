import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Input, ConfigProvider, AutoComplete } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';

const { RangePicker } = DatePicker;

const Attractions = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [dates, setDates] = useState(null);

    const disabledDate = (current) => current && current < dayjs().startOf('day');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('/api/attractions/cities');
                setCities(response.data);
            } catch (error) {
                console.error("Error fetching attraction cities", error);
            }
        };
        fetchCities();
    }, []);

    const handleSearch = async (cityName) => {
        const searchCity = typeof cityName === 'string' ? cityName : city;
        if (!searchCity) {
            alert("Vui lòng nhập thành phố bạn muốn đến");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`/api/attractions/search`, {
                params: { city: searchCity }
            });
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching attractions", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#003b95' } }}>
            <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen text-black">

                {/* Banner */}
                <div className="search-banner">
                    <div className="section-container">
                        <h1 className="text-4xl font-bold mb-3">Địa điểm tham quan, hoạt động và trải nghiệm</h1>
                        <p className="text-xl opacity-90">Khám phá những điều tuyệt vời nhất tại điểm đến của bạn</p>
                    </div>
                </div>

        {/* Search Bar */}
        <div className="search-box-container">
          <div className="search-box grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Địa điểm */}
            <div className="md:col-span-5 border rounded-lg p-2 flex items-center gap-2 bg-white">
              <i className="fa-solid fa-location-dot text-gray-400 ml-2"></i>
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Bạn muốn đi đâu?</span>
                <AutoComplete
                  options={cities.map(city => ({ value: city }))}
                  filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  placeholder="Thành phố, điểm tham quan..."
                  variant="borderless"
                  className="w-full"
                  value={city}
                  onChange={(val) => setCity(val)}
                  onSelect={(val) => {
                      setCity(val);
                      handleSearch(val);
                  }}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                          handleSearch();
                      }
                  }}
                />
              </div>
            </div>
            <div className="md:col-span-4 border rounded-lg p-2 bg-white">
              <span className="text-[10px] font-bold text-gray-500 uppercase px-3">Thời gian</span>
              <RangePicker
                disabledDate={disabledDate}
                variant="borderless"
                className="w-full"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </div>
            <div className="md:col-span-3">
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  height: '100%',
                  backgroundColor: '#006ce4',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '16px',
                  borderRadius: '4px'
                }}
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </Button>
            </div>
          </div>
        </div>

                {/* Danh sách địa điểm */}
                <div className="section-container mt-16 mb-20">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Các điểm tham quan nổi bật tại Việt Nam</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        
                        {/* Vịnh Hạ Long - Gọi hàm và truyền trực tiếp tên */}
                        <div 
                            onClick={() => handleSearch('Hạ Long')}
                            className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                        >
                            <img src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800" alt="Hạ Long" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 text-white">
                                <h3 className="font-bold text-2xl">Vịnh Hạ Long</h3>
                                <p className="text-sm opacity-90">Kỳ quan thiên nhiên thế giới</p>
                            </div>
                        </div>

                        {/* Hội An */}
                        <div 
                            onClick={() => handleSearch('Hội An')}
                            className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                        >
                            <img src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800" alt="Hội An" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 text-white">
                                <h3 className="font-bold text-2xl">Phố Cổ Hội An</h3>
                                <p className="text-sm opacity-90">Di sản văn hóa UNESCO</p>
                            </div>
                        </div>

                        {/* Cố Đô Huế */}
                        <div 
                            onClick={() => handleSearch('Huế')}
                            className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                        >
                            <img src="https://images.unsplash.com/photo-1599708153386-62e200ec806f?w=800" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Huế" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 text-white">
                                <h3 className="font-bold text-xl">Cố Đô Huế</h3>
                            </div>
                        </div>

                        {/* Phú Quốc */}
                        <div 
                            onClick={() => handleSearch('Phú Quốc')}
                            className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                        >
                            <img src="https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Phú Quốc" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 text-white">
                                <h3 className="font-bold text-xl">Đảo Phú Quốc</h3>
                            </div>
                        </div>

                        {/* Đà Nẵng */}
                        <div 
                            onClick={() => handleSearch('Đà Nẵng')}
                            className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                        >
                            <img src="https://images.unsplash.com/photo-1559592443-7f87a79f6527?w=800" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Đà Nẵng" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 text-white">
                                <h3 className="font-bold text-xl">Đà Nẵng</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-container text-center pb-20">
                    <p className="text-gray-400 italic">Chọn một điểm đến để khám phá các hoạt động thú vị.</p>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Attractions;