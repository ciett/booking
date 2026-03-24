import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Checkbox, ConfigProvider } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DetailOverlay from '../components/DetailOverlay';

const { RangePicker } = DatePicker;

const CarRental = () => {
  const [differentLocation, setDifferentLocation] = useState(false);
  const [pickupCity, setPickupCity] = useState(null);
  const [pickupDatetime, setPickupDatetime] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/api/cars/locations');
        const uniqueCities = [...new Set(response.data.map(item => item.city))];
        setLocations(uniqueCities);
      } catch (error) {
        console.error("Error fetching locations", error);
      }
    };
    fetchLocations();
  }, []);

  // Vô hiệu hóa các ngày đã qua
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSearch = async () => {
    if (!pickupCity || !pickupDatetime) {
      alert("Vui lòng chọn địa điểm nhận và ngày giờ");
      return;
    }
    setLoading(true);
    try {
      const pickupIso = pickupDatetime[0].format('YYYY-MM-DDTHH:mm:ss');
      const dropoffIso = pickupDatetime[1].format('YYYY-MM-DDTHH:mm:ss');
      const response = await axios.get(`/api/cars/search`, {
        params: {
          pickupCity: pickupCity,
          pickupTime: pickupIso,
          dropoffTime: dropoffIso
        }
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching cars", error);
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
            <h1 className="text-4xl font-bold mb-3">Thuê xe cho mọi loại hành trình</h1>
            <p className="text-xl opacity-90">Ưu đãi cực lớn từ các thương hiệu hàng đầu thế giới</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-box-container">
          <div className="search-box">

            <div className="mb-2">
              <Checkbox
                onChange={(e) => setDifferentLocation(e.target.checked)}
                className="font-medium text-black"
              >
                Trả xe tại địa điểm khác
              </Checkbox>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Điểm nhận */}
              <div className={`border rounded-lg p-2 flex items-center gap-2 bg-white ${differentLocation ? 'md:col-span-3' : 'md:col-span-5'}`}>
                <LocationOnIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Địa điểm nhận xe</span>
                  <Select
                    showSearch
                    placeholder="Sân bay, thành phố..."
                    variant="borderless"
                    className="w-full"
                    onChange={(val) => setPickupCity(val)}
                    filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={locations.map(city => ({ value: city, label: city }))}
                  />
                </div>
              </div>

              {/* Điểm trả (Nếu có) */}
              {differentLocation && (
                <div className="md:col-span-3 border rounded-lg p-2 flex items-center gap-2 bg-white transition-all">
                  <LocationOnIcon className="text-red-500" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Địa điểm trả xe</span>
                    <Select 
                      showSearch
                      placeholder="Địa điểm trả..." 
                      variant="borderless" 
                      className="w-full" 
                      filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                      options={locations.map(city => ({ value: city, label: city }))}
                    />
                  </div>
                </div>
              )}

              {/* Lịch trình */}
              <div className={`${differentLocation ? 'md:col-span-4' : 'md:col-span-5'} border rounded-lg p-2 bg-white`}>
                <span className="text-[10px] font-bold text-gray-500 uppercase px-3">Ngày nhận & trả</span>
                <RangePicker
                  disabledDate={disabledDate}
                  variant="borderless"
                  className="w-full"
                  format="DD/MM/YYYY HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  onChange={(dates) => setPickupDatetime(dates)}
                />
              </div>

              {/* Nút tìm kiếm */}
              <div className="md:col-span-2">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{
                    height: '100%',
                    backgroundColor: '#006ce4',
                    '&:hover': { backgroundColor: '#005bb8' },
                    fontWeight: 'bold',
                    textTransform: 'none'
                  }}
                >
                  {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="section-container mt-8">
            <h2 className="text-2xl font-bold mb-6">Kết quả tìm kiếm xe tốt nhất</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((car) => (
                <div key={car.id} className="result-card flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-booking-blue mb-1">{car.companyName}</h3>
                    <p className="text-lg font-semibold">{car.carModel}</p>
                    <p className="text-sm text-gray-500 mb-3"><DirectionsCarIcon fontSize="small" /> {car.seats} chỗ ngồi</p>
                    <div className="text-sm bg-blue-50 text-blue-800 p-2 rounded mb-3">
                      <span className="font-bold">Vị trí:</span> {car.location?.name}, {car.location?.city}
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-xl font-bold text-red-600">{car.pricePerDay.toLocaleString('vi-VN')} đ <span className="text-sm text-gray-500 font-normal">/ ngày</span></span>
                    <DetailOverlay 
                      trigger={<Button variant="contained" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }}>Thuê ngay</Button>}
                      title={`Chi tiết xe ${car.carModel}`}
                      description={`Cung cấp bởi đối tác ${car.companyName}`}
                      content={
                        <div className="space-y-4">
                          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Mẫu xe</p>
                              <p className="text-lg font-bold">{car.carModel}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Số chỗ</p>
                              <p className="text-lg font-bold">{car.seats} chỗ</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="border p-2 rounded">
                              <p className="font-semibold"><i className="fa-solid fa-gas-pump mr-2 text-blue-500"></i> Nhiên liệu</p>
                              <p className="text-gray-600">Xăng / Full-to-Full</p>
                            </div>
                            <div className="border p-2 rounded">
                              <p className="font-semibold"><i className="fa-solid fa-gear mr-2 text-blue-500"></i> Hộp số</p>
                              <p className="text-gray-600">Tự động</p>
                            </div>
                            <div className="border p-2 rounded">
                              <p className="font-semibold"><i className="fa-solid fa-snowflake mr-2 text-blue-500"></i> Điều hòa</p>
                              <p className="text-gray-600">Có sẵn</p>
                            </div>
                            <div className="border p-2 rounded">
                              <p className="font-semibold"><i className="fa-solid fa-suitcase mr-2 text-blue-500"></i> Hành lý</p>
                              <p className="text-gray-600">2 Vali lớn, 1 Vali nhỏ</p>
                            </div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded border border-yellow-100 italic text-xs">
                            * Lưu ý: Người lái cần mang theo bằng lái xe hợp lệ và căn cước công dân khi nhận xe.
                          </div>
                        </div>
                      }
                      footer={
                        <Button variant="contained" sx={{ backgroundColor: '#006ce4' }}>Tiếp tục đặt xe</Button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Blocks - Ẩn đi khi có kết quả tìm kiếm */}
        {results.length === 0 && (
          <div className="section-container mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-black">
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-4xl mb-2">✔️</span>
              <h3 className="font-bold text-lg">Hủy miễn phí</h3>
              <p className="text-gray-500 text-sm">Hầu hết các đơn đặt xe đều có thể hủy trước 48 giờ</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-4xl mb-2">🏢</span>
              <h3 className="font-bold text-lg">Hơn 900 công ty</h3>
              <p className="text-gray-500 text-sm">Kết nối với các đối tác uy tín như Hertz, Avis, Europcar</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-4xl mb-2">✨</span>
              <h3 className="font-bold text-lg">Không phí ẩn</h3>
              <p className="text-gray-500 text-sm">Giá hiển thị là giá cuối cùng bạn phải trả</p>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default CarRental;