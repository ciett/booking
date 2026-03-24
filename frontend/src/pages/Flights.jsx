import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Radio, ConfigProvider } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import DetailOverlay from '../components/DetailOverlay';

const { RangePicker } = DatePicker;

// Hàm chặn chọn ngày trong quá khứ (Dùng logic bạn vừa gửi)
const disabledDate = (current) => {
  // Không cho phép chọn những ngày trước ngày hôm nay
  return current && current < dayjs().startOf('day');
};

const Flights = () => {
  const [departureCode, setDepartureCode] = useState(null);
  const [arrivalCode, setArrivalCode] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get('/api/flights/airports');
        setAirports(response.data);
      } catch (error) {
        console.error("Error fetching airports", error);
      }
    };
    fetchAirports();
  }, []);

  const handleSearch = async () => {
    if (!departureCode || !arrivalCode || !departureDate) {
      alert("Vui lòng chọn đầy đủ thông tin: Điểm đi, Điểm đến và Ngày đi");
      return;
    }
    setLoading(true);
    try {
      // Format required by Spring @DateTimeFormat(iso)
      const startDate = departureDate[0].startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const endDate = departureDate[1].endOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const response = await axios.get(`/api/flights/search`, {
        params: {
          departureCode: departureCode,
          arrivalCode: arrivalCode,
          startDate: startDate,
          endDate: endDate
        }
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching flights", error);
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
            <h1 className="text-4xl font-bold mb-3">Tìm chuyến bay tiếp theo</h1>
            <p className="text-xl opacity-90">Đặt vé nhanh chóng, an toàn và tiết kiệm.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-box-container">
          <div className="search-box">

            <Radio.Group defaultValue="roundtrip" buttonStyle="solid">
              <Radio.Button value="roundtrip">Khứ hồi</Radio.Button>
              <Radio.Button value="oneway">Một chiều</Radio.Button>
            </Radio.Group>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Điểm đi */}
              <div className="md:col-span-3 border rounded-lg p-2 hover:border-booking-blue bg-white flex items-center gap-2">
                <FlightTakeoffIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase font-sans">Từ đâu?</span>
                  <Select
                    showSearch
                    placeholder="Sân bay đi"
                    variant="borderless"
                    className="w-full"
                    onChange={(val) => setDepartureCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* Điểm đến */}
              <div className="md:col-span-3 border rounded-lg p-2 hover:border-booking-blue bg-white flex items-center gap-2">
                <FlightLandIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase font-sans">Đến đâu?</span>
                  <Select
                    showSearch
                    placeholder="Sân bay đến"
                    variant="borderless"
                    className="w-full"
                    onChange={(val) => setArrivalCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* Ô CHỌN NGÀY XỊN BẠN VỪA GỬI */}
              <div className="md:col-span-4 border rounded-lg p-2 hover:border-booking-blue bg-white">
                <span className="text-[10px] font-bold text-gray-500 uppercase px-3 font-sans">Ngày đi - Ngày về</span>
                <RangePicker
                  disabledDate={disabledDate} // Áp dụng logic chặn ngày quá khứ
                  variant="borderless"
                  className="w-full"
                  format="DD/MM/YYYY"
                  placeholder={['Ngày đi', 'Ngày về']}
                  onChange={(dates) => setDepartureDate(dates)}
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  variant="contained"
                  fullWidth
                  className="h-full bg-booking-blue hover:bg-booking-dark"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{ borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', height: '100%', textTransform: 'none' }}>
                  {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hướng dẫn/Phổ biến - Ẩn đi khi có kết quả tìm kiếm */}
        {results.length === 0 && (
          <div className="section-container mt-12 mb-20">
            <h2 className="text-2xl font-bold mb-6">Các chặng bay phổ biến</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow border overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://images.unsplash.com/photo-1555505012-1c4b6992d9ec?w=500" alt="HN-HCM" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold">Hà Nội - TP. Hồ Chí Minh</h4>
                  <p className="text-sm text-gray-500">Từ 1.200.000 VND</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow border overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://images.unsplash.com/photo-1559592413-7ece70199464?w=500" alt="HCM-DN" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold">TP. Hồ Chí Minh - Đà Nẵng</h4>
                  <p className="text-sm text-gray-500">Từ 850.000 VND</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow border overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://images.unsplash.com/photo-1506634064465-7dab4de896ed?w=500" alt="HN-PQ" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold">Hà Nội - Phú Quốc</h4>
                  <p className="text-sm text-gray-500">Từ 1.800.000 VND</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List vé mẫu... */}
        {results.length > 0 && (
          <div className="section-container mt-6 pb-12">
            <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h2>
            <div className="flex flex-col gap-4">
              {results.map((flight) => (
                <div key={flight.id} className="result-card flex flex-col md:flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-booking-blue">{flight.airline}</span>
                    <span className="text-sm text-gray-500">Chuyến bay: {flight.flightNumber}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0 text-center">
                    <div>
                      <div className="text-xl font-bold">{dayjs(flight.departureTime).format('HH:mm')}</div>
                      <div className="text-gray-500">{flight.departureAirport?.code}</div>
                    </div>
                    <div className="text-gray-400 border-b border-gray-300 w-16 mb-6"></div>
                    <div>
                      <div className="text-xl font-bold">{dayjs(flight.arrivalTime).format('HH:mm')}</div>
                      <div className="text-gray-500">{flight.arrivalAirport?.code}</div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                    <span className="text-2xl font-bold text-red-600 mb-2">{flight.price.toLocaleString('vi-VN')} VND</span>
                    <DetailOverlay 
                      trigger={<Button variant="contained" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }}>Chọn chuyến</Button>}
                      title={`Chi tiết chuyến bay ${flight.flightNumber}`}
                      description={`Hành trình từ ${flight.departureAirport?.city} đến ${flight.arrivalAirport?.city}`}
                      content={
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
                            <span className="font-bold text-booking-blue">{flight.airline}</span>
                            <span className="text-sm font-medium">#{flight.flightNumber}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="border-l-2 border-blue-200 pl-3">
                              <p className="text-xs text-gray-400">KHỞI HÀNH</p>
                              <p className="font-bold text-lg">{dayjs(flight.departureTime).format('HH:mm')}</p>
                              <p className="text-sm">{flight.departureAirport?.name} ({flight.departureAirport?.code})</p>
                              <p className="text-xs text-gray-500">{dayjs(flight.departureTime).format('DD/MM/YYYY')}</p>
                            </div>
                            <div className="border-l-2 border-green-200 pl-3">
                              <p className="text-xs text-gray-400">HẠ CÁNH</p>
                              <p className="font-bold text-lg">{dayjs(flight.arrivalTime).format('HH:mm')}</p>
                              <p className="text-sm">{flight.arrivalAirport?.name} ({flight.arrivalAirport?.code})</p>
                              <p className="text-xs text-gray-500">{dayjs(flight.arrivalTime).format('DD/MM/YYYY')}</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <p className="font-semibold mb-1">Chính sách hành lý & Dịch vụ:</p>
                            <ul className="list-disc list-inside text-gray-600">
                              <li>Hành lý xách tay: 7kg</li>
                              <li>Hành lý ký gửi: Tùy hạng vé</li>
                              <li>Suất ăn nhẹ trên máy bay</li>
                              <li>Wifi (Tùy tàu bay)</li>
                            </ul>
                          </div>
                        </div>
                      }
                      footer={
                        <Button variant="contained" sx={{ backgroundColor: '#006ce4' }}>Xác nhận chọn</Button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Flights;