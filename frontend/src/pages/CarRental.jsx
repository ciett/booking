import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Select, Checkbox, ConfigProvider, message } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../context/ConfigContext';

const { RangePicker } = DatePicker;

const CarRental = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getImage } = useConfig();
  const [differentLocation, setDifferentLocation] = useState(false);
  const [pickupCity, setPickupCity] = useState(null);
  const [dropoffCity, setDropoffCity] = useState(null);
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
      message.warning(t('common.pleaseSelectPickupInfo') || "Vui lòng chọn địa điểm nhận và ngày giờ");
      return;
    }
    setLoading(true);
    try {
      const pickupIso = pickupDatetime[0].format('YYYY-MM-DDTHH:mm:ss');
      const dropoffIso = pickupDatetime[1].format('YYYY-MM-DDTHH:mm:ss');
      const response = await axios.get(`/api/cars/search`, {
        params: {
          pickupCity: pickupCity,
          dropoffCity: differentLocation ? dropoffCity : pickupCity,
          pickupTime: pickupIso,
          dropoffTime: dropoffIso
        }
      });
      
      // Tinh so ngay thue
      const pickup = pickupDatetime[0];
      const dropoff = pickupDatetime[1];
      const diffHours = dropoff.diff(pickup, 'hour');
      const rentalDays = Math.max(1, Math.ceil(diffHours / 24));

      // logic tinh gia: (Gia thue ngay * so ngay) + phi mot chieu (neu co)
      const processedResults = response.data.map(car => {
        let extraFee = 0;
        if (differentLocation && dropoffCity && pickupCity && dropoffCity !== pickupCity) {
          extraFee = 500000;
        }
        const basePrice = car.pricePerDay * rentalDays;
        return {
          ...car,
          rentalDays,
          oneWayFee: extraFee,
          totalPrice: basePrice + extraFee,
          dropoffCity: differentLocation ? dropoffCity : pickupCity
        };
      });

      setResults(processedResults);
    } catch (error) {
      console.error("Error fetching cars", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ 
      token: { 
        colorPrimary: '#003b95', 
        fontFamily: "'Inter', sans-serif" 
      } 
    }}>
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen text-black">

        {/* Banner */}
        <div 
          className="bg-linear-to-br from-booking-blue via-blue-800 to-indigo-900 text-white relative w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8 shadow-inner overflow-hidden"
          style={{
            backgroundImage: getImage('img.carrentals.hero') ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${getImage('img.carrentals.hero')})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">{t('carRental.heroTitle')}</h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-sm">{t('carRental.heroSubtitle')}</p>
            </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 w-full relative z-20 -mt-12">
          <div className="bg-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden p-4 shadow-inner">

            <div className="mb-2">
              <Checkbox
                onChange={(e) => setDifferentLocation(e.target.checked)}
                className="font-medium text-black"
              >
                {t('carRental.differentLocation')}
              </Checkbox>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Điểm nhận */}
              <div className={`border rounded-lg p-2 flex items-center gap-2 bg-white ${differentLocation ? 'md:col-span-3' : 'md:col-span-5'}`}>
                <LocationOnIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase line-clamp-1">{t('carRental.pickupLocation')}</span>
                  <Select
                    showSearch
                    placeholder={t('carRental.pickupPlaceholder')}
                    variant="borderless"
                    className="w-full text-sm"
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
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{t('carRental.dropoffLocation')}</span>
                    <Select 
                      showSearch
                      placeholder={t('carRental.dropoffPlaceholder')} 
                      variant="borderless" 
                      className="w-full" 
                      value={dropoffCity}
                      onChange={(val) => setDropoffCity(val)}
                      filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                      options={locations.map(city => ({ value: city, label: city }))}
                    />
                  </div>
                </div>
              )}

              {/* Lịch trình */}
              <div className={`${differentLocation ? 'md:col-span-4' : 'md:col-span-5'} border rounded-lg p-2 bg-white`}>
                <span className="text-[10px] font-bold text-gray-400 uppercase px-3 line-clamp-1">{t('carRental.dateRange')}</span>
                <RangePicker
                  disabledDate={disabledDate}
                  variant="borderless"
                  className="w-full text-sm"
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
                  {loading ? t('carRental.searching') : t('carRental.search')}
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="section-container mt-8">
            <h2 className="text-2xl font-bold mb-6">{t('carRental.searchResults')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((car) => (
                <div key={car.id} className="result-card flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-booking-blue mb-1">{car.companyName}</h3>
                    <p className="text-lg font-semibold">{car.carModel}</p>
                    <p className="text-sm text-gray-500 mb-3"><DirectionsCarIcon fontSize="small" /> {car.seats} {t('carRental.seats')}</p>
                    <div className="text-sm bg-blue-50 text-blue-800 p-2 rounded mb-3">
                      <span className="font-bold">{t('carRental.locationLabel')}</span> {car.location?.name}, {car.location?.city}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 gap-3">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-red-600">{car.totalPrice.toLocaleString('vi-VN')} đ</span>
                      <span className="text-[10px] text-gray-500">{car.pricePerDay.toLocaleString('vi-VN')} đ x {car.rentalDays} ngày {car.oneWayFee > 0 ? `+ ${car.oneWayFee.toLocaleString('vi-VN')} đ phí` : ''}</span>
                    </div>
                    <DetailOverlay 
                      trigger={<Button variant="contained" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }}>{t('carRental.rentNow')}</Button>}
                      title={`${t('carRental.carDetails')} ${car.carModel}`}
                      description={`${t('carRental.providedBy')} ${car.companyName}`}
                      content={
                        <div className="space-y-4">
                          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">{t('carRental.carModel')}</p>
                              <p className="text-lg font-bold">{car.carModel}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{t('carRental.numberOfSeats')}</p>
                              <p className="text-lg font-bold">{car.seats} {t('carRental.numberOfSeats')}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="border p-2 rounded">
                              <p className="font-semibold"><i className="fa-solid fa-gas-pump mr-2 text-blue-500"></i> {t('carRental.fuel')}</p>
                              <p className="text-gray-600">{t('carRental.fuelDesc')}</p>
                            </div>
                            <div className="border p-2 rounded">
                              <p className="font-semibold"><i className="fa-solid fa-gear mr-2 text-blue-500"></i> {t('carRental.transmission')}</p>
                              <p className="text-gray-600">{t('carRental.transmissionDesc')}</p>
                            </div>
                            <div className="border p-2 rounded">
                              <p className="font-semibold"><i className="fa-solid fa-snowflake mr-2 text-blue-500"></i> {t('carRental.ac')}</p>
                              <p className="text-gray-600">{t('carRental.acDesc')}</p>
                            </div>
                            <div className="border p-2 rounded">
                              <p className="font-semibold"><i className="fa-solid fa-suitcase mr-2 text-blue-500"></i> {t('carRental.luggage')}</p>
                              <p className="text-gray-600">{t('carRental.luggageDesc')}</p>
                            </div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded border border-yellow-100 italic text-xs">
                            {t('carRental.driverNote')}
                          </div>
                        </div>
                      }
                      footer={
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: '#006ce4' }}
                          onClick={() => navigate(`/checkout?type=car&name=${encodeURIComponent(car.carModel + ' - ' + car.companyName)}&price=${car.totalPrice}&details=${encodeURIComponent(JSON.stringify({ [t('carRental.numberOfSeats')]: car.seats, "Số ngày thuê": car.rentalDays, "Nhận tại": car.location?.city, "Trả tại": car.dropoffCity, "Phí một chiều": car.oneWayFee + " đ" }))}`)}
                        >{t('carRental.continueBooking')}</Button>
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
              <h3 className="font-bold text-lg">{t('carRental.freeCancellation')}</h3>
              <p className="text-gray-500 text-sm">{t('carRental.freeCancellationDesc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-4xl mb-2">🏢</span>
              <h3 className="font-bold text-lg">{t('carRental.manyCompanies')}</h3>
              <p className="text-gray-500 text-sm">{t('carRental.manyCompaniesDesc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-4xl mb-2">✨</span>
              <h3 className="font-bold text-lg">{t('carRental.noHiddenFees')}</h3>
              <p className="text-gray-500 text-sm">{t('carRental.noHiddenFeesDesc')}</p>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default CarRental;