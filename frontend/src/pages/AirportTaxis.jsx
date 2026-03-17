import React, { useState } from 'react';
import { DatePicker, Input, TimePicker, ConfigProvider } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';

const AirportTaxis = () => {
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  const [airportCode, setAirportCode] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!airportCode) {
      alert("Vui lòng nhập sân bay hoặc mã sân bay");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`/api/airport-taxis/search`, {
        params: { airportCode: airportCode }
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching taxis", error);
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
            <h1 className="text-4xl font-bold mb-3">Xe đưa đón sân bay giá rẻ</h1>
            <p className="text-xl opacity-90">Taxi sân bay đáng tin cậy, giá trọn gói, tài xế đợi sẵn</p>
          </div>
        </div>

        {/* Search Bar cho Airport Taxis */}
        <div className="max-w-6xl w-full -mt-10 px-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

              {/* Điểm đón (Sân bay) */}
              <div className="md:col-span-4 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <i className="fa-solid fa-plane-arrival text-gray-400 ml-2"></i>
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Điểm đón</span>
                  <Input
                    placeholder="Nhập sân bay..."
                    variant="borderless"
                    className="w-full"
                    value={airportCode}
                    onChange={(e) => setAirportCode(e.target.value)}
                    onPressEnter={handleSearch}
                  />
                </div>
              </div>

              {/* Điểm đến (Khách sạn/Địa chỉ) */}
              <div className="md:col-span-4 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <i className="fa-solid fa-location-dot text-gray-400 ml-2"></i>
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Điểm đến</span>
                  <Input placeholder="Khách sạn, địa chỉ..." variant="borderless" className="w-full" />
                </div>
              </div>

              {/* Ngày và Giờ */}
              <div className="md:col-span-2 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-500 uppercase px-3">Ngày đón</span>
                <DatePicker disabledDate={disabledDate} variant="borderless" className="w-full" />
              </div>

              <div className="md:col-span-2 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-500 uppercase px-3">Giờ đón</span>
                <TimePicker format="HH:mm" variant="borderless" className="w-full" />
              </div>
            </div>

            {/* Nút Tìm kiếm */}
            <div className="flex justify-end mt-2">
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  backgroundColor: '#006ce4',
                  px: 8,
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '16px'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((taxi) => (
                <div key={taxi.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-booking-blue mb-1">{taxi.carType}</h3>
                      <p className="text-sm text-gray-500"><i className="fa-solid fa-plane-arrival mr-2 text-gray-400"></i>Sân bay {taxi.airport?.name} ({taxi.airport?.code}) - {taxi.airport?.city}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
                    <div>
                      <span className="text-xs text-gray-500 block">Giá cơ bản</span>
                      <span className="text-2xl font-bold text-green-600">{taxi.basePrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <Button variant="contained" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }}>Đặt qua đối tác</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lợi ích */}
        <div className="max-w-6xl w-full mt-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-6 rounded-lg border border-gray-200 flex gap-4">
            <div className="text-3xl">⏱️</div>
            <div>
              <h4 className="font-bold">Xác nhận tức thì</h4>
              <p className="text-sm text-gray-500">Đặt xe chỉ trong vài phút</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 flex gap-4">
            <div className="text-3xl">🤝</div>
            <div>
              <h4 className="font-bold">Dịch vụ đón khách</h4>
              <p className="text-sm text-gray-500">Tài xế đợi sẵn ở sảnh đến</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 flex gap-4">
            <div className="text-3xl">💰</div>
            <div>
              <h4 className="font-bold">Giá cố định</h4>
              <p className="text-sm text-gray-500">Không phí ẩn, không lo kẹt xe</p>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AirportTaxis;