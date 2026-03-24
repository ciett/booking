import React, { useState, useEffect } from 'react';
import { DatePicker, Input, TimePicker, ConfigProvider, Select, AutoComplete } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import DetailOverlay from '../components/DetailOverlay';

const AirportTaxis = () => {
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  const [airportCode, setAirportCode] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [destination, setDestination] = useState('');

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

  const handleSearch = async () => {
    if (!airportCode) {
      alert("Vui lòng nhập sân bay hoặc mã sân bay");
      return;
    }
    setLoading(true);
    try {
      const params = { airportCode: airportCode };
      if (date && time) {
        const pickupDatetime = date.hour(time.hour()).minute(time.minute()).second(0);
        params.pickupTime = pickupDatetime.format('YYYY-MM-DDTHH:mm:ss');
      }
      const response = await axios.get(`/api/airport-taxis/search`, {
        params: params
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
        <div className="search-banner">
          <div className="section-container">
            <h1 className="text-4xl font-bold mb-3">Xe đưa đón sân bay giá rẻ</h1>
            <p className="text-xl opacity-90">Taxi sân bay đáng tin cậy, giá trọn gói, tài xế đợi sẵn</p>
          </div>
        </div>

        {/* Search Bar cho Airport Taxis */}
        <div className="search-box-container">
          <div className="search-box">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

              {/* Điểm đón (Sân bay) */}
              <div className="md:col-span-4 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <i className="fa-solid fa-plane-arrival text-gray-400 ml-2"></i>
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Điểm đón</span>
                  <Select
                    showSearch
                    placeholder="Nhập sân bay..."
                    variant="borderless"
                    className="w-full"
                    value={airportCode || undefined}
                    onChange={(val) => setAirportCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))}
                  />
                </div>
              </div>

              {/* Điểm đến (Khách sạn/Địa chỉ) */}
              <div className="md:col-span-4 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <i className="fa-solid fa-location-dot text-gray-400 ml-2"></i>
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Điểm đến</span>
                  <AutoComplete
                    options={cities.map(city => ({ value: city }))}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    placeholder="Khách sạn, địa chỉ..."
                    variant="borderless"
                    className="w-full custom-home-autocomplete"
                    value={destination}
                    onChange={(val) => setDestination(val)}
                  />
                </div>
              </div>

              {/* Ngày và Giờ */}
              <div className="md:col-span-2 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-500 uppercase px-3">Ngày đón</span>
                <DatePicker disabledDate={disabledDate} variant="borderless" className="w-full" onChange={(d) => setDate(d)} />
              </div>

              <div className="md:col-span-2 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-500 uppercase px-3">Giờ đón</span>
                <TimePicker format="HH:mm" variant="borderless" className="w-full" onChange={(t) => setTime(t)} />
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
          <div className="section-container mt-8">
            <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((taxi) => (
                <div key={taxi.id} className="result-card flex flex-col">
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
                    <DetailOverlay 
                      trigger={<Button variant="contained" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }}>Đặt qua đối tác</Button>}
                      title={`Dịch vụ xe ${taxi.carType}`}
                      description={`Đón tại sân bay ${taxi.airport?.code}`}
                      content={
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg">
                            <div className="text-3xl">🚗</div>
                            <div>
                              <p className="font-bold text-lg">{taxi.carType}</p>
                              <p className="text-sm text-gray-600">Sức chứa: 4-7 người (tùy loại xe)</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b py-2">
                              <span className="text-gray-500">Điểm đón</span>
                              <span className="font-medium">{taxi.airport?.name}</span>
                            </div>
                            <div className="flex justify-between border-b py-2">
                              <span className="text-gray-500">Thành phố</span>
                              <span className="font-medium">{taxi.airport?.city}</span>
                            </div>
                            <div className="flex justify-between border-b py-2">
                              <span className="text-gray-500">Giá trọn gói</span>
                              <span className="font-bold text-green-600 italic">{taxi.basePrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                              <i className="fa-solid fa-circle-info"></i> Hướng dẫn đón khách:
                            </p>
                            <p className="text-xs text-blue-700">Tài xế sẽ đợi bạn tại sảnh đến với bảng tên. Vui lòng cung cấp số hiệu chuyến bay để chúng tôi theo dõi thời gian hạ cánh chính xác.</p>
                          </div>
                        </div>
                      }
                      footer={
                        <Button variant="contained" sx={{ backgroundColor: '#006ce4' }}>Xác nhận đặt xe</Button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lợi ích - Ẩn đi khi có kết quả tìm kiếm */}
        {results.length === 0 && (
          <div className="section-container mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
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
        )}
      </div>
    </ConfigProvider>
  );
};

export default AirportTaxis;