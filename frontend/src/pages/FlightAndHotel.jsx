import React, { useState, useEffect } from 'react';
import { DatePicker, Select, InputNumber, ConfigProvider } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import GroupIcon from '@mui/icons-material/Group';

const { RangePicker } = DatePicker;

const FlightAndHotel = () => {
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  const [airports, setAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [departureCode, setDepartureCode] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get('/api/flights/airports');
        setAirports(response.data);
      } catch (error) {
        console.error("Error fetching airports", error);
      }
    };
    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/hotels/cities');
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching hotel cities", error);
      }
    };
    fetchAirports();
    fetchCities();
  }, []);

  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!departureCode || !destination) {
      alert("Vui lòng chọn điểm đi và điểm đến");
      return;
    }
    setSearching(true);
    // Logic tìm kiếm thực tế sẽ được thêm sau
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#003b95' } }}>
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
        
        {/* Banner Đặc trưng cho Packages */}
        <div className="search-banner">
          <div className="section-container">
            <h1 className="text-4xl font-bold mb-3">Chuyến đi trọn gói: Máy bay + Khách sạn</h1>
            <p className="text-xl opacity-90">Tiết kiệm lên đến 15% khi đặt cả hai cùng lúc</p>
          </div>
        </div>

        {/* Search Bar kết hợp */}
        <div className="search-box-container">
          <div className="search-box">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Điểm đi */}
              <div className="md:col-span-3 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <FlightTakeoffIcon className="text-blue-500" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Điểm đi</span>
                  <Select 
                    showSearch 
                    placeholder="Hà Nội (HAN)" 
                    variant="borderless" 
                    className="w-full"
                    onChange={(val) => setDepartureCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* Điểm đến (Vừa là sân bay vừa là nơi ở) */}
              <div className="md:col-span-3 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <HotelIcon className="text-blue-500" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Điểm đến / Khách sạn</span>
                  <Select 
                    showSearch 
                    placeholder="Đà Nẵng" 
                    variant="borderless" 
                    className="w-full"
                    onChange={(val) => setDestination(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={cities.map(city => ({ value: city, label: city }))} />
                </div>
              </div>

              {/* Lịch trình */}
              <div className="md:col-span-4 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-400 uppercase px-3">Thời gian đi & về</span>
                <RangePicker disabledDate={disabledDate} variant="borderless" className="w-full" />
              </div>

              {/* Số người */}
              <div className="md:col-span-2 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <GroupIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Khách</span>
                  <InputNumber min={1} defaultValue={2} variant="borderless" className="w-full" />
                </div>
              </div>
            </div>

            {/* Nút Tìm kiếm to bản */}
            <div className="flex justify-end mt-2">
              <Button 
                variant="contained" 
                size="large"
                onClick={handleSearch}
                sx={{ 
                  backgroundColor: '#006ce4', 
                  px: 6, 
                  py: 1.5, 
                  fontWeight: 'bold', 
                  textTransform: 'none',
                  borderRadius: '4px'
                }}
              >
                {searching ? 'Đang tìm...' : 'Tìm kiếm gói tiết kiệm'}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results Mockup */}
        {searching && (
          <div className="section-container mt-8 text-center py-10">
            <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm gói trọn gói</h2>
            <p className="text-gray-500 italic">(Đang cập nhật danh sách các gói bay + ở phù hợp cho bạn...)</p>
          </div>
        )}

        {/* Phần nội dung quảng cáo gói - Ẩn đi khi đang tìm kiếm */}
        {!searching && (
          <div className="section-container mt-12 mb-20">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-center justify-between">
                  <div>
                      <h3 className="text-lg font-bold text-blue-900">Tại sao nên đặt theo gói?</h3>
                      <ul className="mt-2 text-blue-800 list-disc list-inside space-y-1">
                          <li>Giá rẻ hơn so với đặt lẻ từng dịch vụ</li>
                          <li>Quản lý chuyến đi dễ dàng tại một nơi</li>
                          <li>Đã bao gồm bảo hiểm hành trình cơ bản</li>
                      </ul>
                  </div>
                  <div className="hidden md:block text-6xl opacity-20 text-blue-900">
                      ✈️+🏨
                  </div>
              </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default FlightAndHotel;