import React, { useState } from 'react';
import { DatePicker, Input, ConfigProvider } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';

const { RangePicker } = DatePicker;

const Attractions = () => {
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city) {
      alert("Vui lòng nhập thành phố bạn muốn đến");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`/api/attractions/search`, {
        params: { city: city }
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
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">

        {/* Banner */}
        <div className="w-full bg-[#003b95] text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">Địa điểm tham quan, hoạt động và trải nghiệm</h1>
            <p className="text-xl opacity-90">Khám phá những điều tuyệt vời nhất tại điểm đến của bạn</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl w-full -mt-10 px-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Địa điểm */}
            <div className="md:col-span-5 border rounded-lg p-2 flex items-center gap-2 bg-white">
              <i className="fa-solid fa-location-dot text-gray-400 ml-2"></i>
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Bạn muốn đi đâu?</span>
                <Input
                  placeholder="Thành phố, điểm tham quan..."
                  variant="borderless"
                  className="w-full"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onPressEnter={handleSearch}
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

        {/* Search Results */}
        {results.length > 0 && (
          <div className="max-w-6xl w-full mt-8 px-4 text-black">
            <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((attraction) => (
                <div key={attraction.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition">
                  {/* Image placeholder */}
                  <div className="h-40 bg-gray-200 w-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80')` }}></div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{attraction.category}</span>
                    <h3 className="font-bold text-lg text-booking-blue mb-1 line-clamp-2">{attraction.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1"><i className="fa-solid fa-location-dot mr-1 text-gray-400"></i>{attraction.city}</p>
                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500 block">Từ</span>
                        <span className="text-lg font-bold text-gray-900">{attraction.price.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <Button variant="contained" size="small" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold', textTransform: 'none' }}>Mua vé</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danh mục gợi ý */}
        <div className="max-w-6xl w-full mt-12 px-4 mb-20">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Khám phá theo danh mục</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Văn hóa', icon: '🏛️' },
              { name: 'Ẩm thực', icon: '🍲' },
              { name: 'Thiên nhiên', icon: '🌳' },
              { name: 'Giải trí', icon: '🎡' }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-all flex flex-col items-center">
                <span className="text-4xl mb-2">{item.icon}</span>
                <span className="font-semibold text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl w-full mt-16 px-4 mb-20">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Các điểm tham quan nổi bật tại Việt Nam</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            
            {/* Ảnh lớn 1 - Vịnh Hạ Long (Chiếm 3 cột) */}
            <div className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80" alt="Hạ Long" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-2xl flex items-center">Vịnh Hạ Long</h3>
                <p className="text-white text-sm opacity-90">Kỳ quan thiên nhiên thế giới</p>
              </div>
            </div>

            {/* Ảnh lớn 2 - Hội An (Chiếm 3 cột) */}
            <div className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80" alt="Hội An" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-2xl flex items-center">Phố Cổ Hội An</h3>
                <p className="text-white text-sm opacity-90">Di sản văn hóa UNESCO</p>
              </div>
            </div>

            {/* Các ảnh nhỏ ở hàng dưới (Mỗi cái chiếm 2 cột) */}
            <div className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1599708153386-62e200ec806f?w=800&q=80" alt="Huế" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-xl">Cố Đô Huế</h3>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80" alt="Phú Quốc" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-xl">Đảo Phú Quốc</h3>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1559592443-7f87a79f6527?w=800&q=80" alt="Đà Nẵng" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-xl">Đà Nẵng</h3>
              </div>
            </div>

          </div>
        </div>

        {/* Thông báo Footer */}
        <div className="max-w-6xl w-full mt-10 px-4 text-center pb-10">
            <p className="text-gray-400 italic">Nhập địa điểm để bắt đầu tìm kiếm các hoạt động thú vị.</p>
        </div>

      </div>
    </ConfigProvider>
  );
};

export default Attractions;