import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Select, InputNumber, ConfigProvider, message } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import GroupIcon from '@mui/icons-material/Group';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../context/ConfigContext';

const { RangePicker } = DatePicker;

const FlightAndHotel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getImage } = useConfig();
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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [guests, setGuests] = useState(2);

  // Mock data cho packages
  const generateMockPackages = (origin, dest) => {
    const originAirport = airports.find(a => a.code === origin);
    const originCity = originAirport ? originAirport.city : origin;
    const airlines = ['Vietnam Airlines', 'VietJet Air', 'Bamboo Airways'];
    const hotels = [
      { name: `${dest} Grand Hotel`, stars: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500' },
      { name: `${dest} Boutique Resort`, stars: 4, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500' },
      { name: `${dest} City Center Hotel`, stars: 4, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500' },
    ];
    return hotels.map((hotel, i) => ({
      id: i + 1,
      airline: airlines[i % airlines.length],
      flightCode: `${origin}-${dest.substring(0, 3).toUpperCase()}`,
      originCity,
      destCity: dest,
      hotel: hotel.name,
      hotelStars: hotel.stars,
      hotelImg: hotel.img,
      nights: 3,
      originalPrice: 8500000 + i * 1200000,
      packagePrice: 6800000 + i * 1000000,
      savings: 15 - i * 2,
    }));
  };

  const handleSearch = () => {
    if (!departureCode || !destination) {
      message.warning(t('common.pleaseSelectOriginDest') || "Vui lòng chọn điểm đi và điểm đến");
      return;
    }
    setLoading(true);
    setSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResults(generateMockPackages(departureCode, destination));
      setLoading(false);
    }, 1000);
  };

  return (
    <ConfigProvider theme={{ 
      token: { 
        colorPrimary: '#003b95', 
        fontFamily: "'Inter', sans-serif" 
      } 
    }}>
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
        
        {/* Banner Đặc trưng cho Packages */}
        <div 
          className="bg-linear-to-br from-booking-blue via-blue-800 to-indigo-900 text-white relative w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8 shadow-inner overflow-hidden"
          style={{
            backgroundImage: getImage('img.flighthotel.hero') ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${getImage('img.flighthotel.hero')})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">{t('flightAndHotel.heroTitle')}</h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-sm">{t('flightAndHotel.heroSubtitle')}</p>
            </div>
        </div>

        {/* Search Bar kết hợp */}
        <div className="max-w-6xl mx-auto px-4 w-full relative z-20 -mt-12">
          <div className="bg-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden p-4 shadow-inner">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Điểm đi */}
              <div className="md:col-span-3 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <FlightTakeoffIcon className="text-blue-500" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase line-clamp-1">{t('flightAndHotel.origin')}</span>
                  <Select 
                    showSearch 
                    placeholder={t('flightAndHotel.originPlaceholder')} 
                    variant="borderless" 
                    className="w-full text-sm"
                    onChange={(val) => setDepartureCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* Điểm đến (Vừa là sân bay vừa là nơi ở) */}
              <div className="md:col-span-3 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <HotelIcon className="text-blue-500" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase line-clamp-1">{t('flightAndHotel.destination')}</span>
                  <Select 
                    showSearch 
                    placeholder={t('flightAndHotel.destPlaceholder')} 
                    variant="borderless" 
                    className="w-full text-sm"
                    onChange={(val) => setDestination(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={cities.map(city => ({ value: city, label: city }))} />
                </div>
              </div>

              {/* Lịch trình */}
              <div className="md:col-span-4 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-400 uppercase px-3 line-clamp-1">{t('flightAndHotel.dateRange')}</span>
                <RangePicker disabledDate={disabledDate} variant="borderless" className="w-full text-sm" />
              </div>

              {/* Số người */}
              <div className="md:col-span-2 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <GroupIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t('flightAndHotel.guests')}</span>
                  <InputNumber min={1} value={guests} onChange={(val) => setGuests(val)} variant="borderless" className="w-full" />
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
                {searching ? t('flightAndHotel.searching') : t('flightAndHotel.search')}
              </Button>
            </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searching && (
          <div className="section-container mt-8 mb-12">
            <h2 className="text-2xl font-bold mb-2">{t('flightAndHotel.searchResults')}</h2>
            <p className="text-gray-500 mb-6">{t('flightAndHotel.searchDesc')}</p>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img src={pkg.hotelImg} alt={pkg.hotel} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        <i className="fa-solid fa-tag mr-1"></i> {t('flightAndHotel.save')} {pkg.savings}%
                      </span>
                      <div className="absolute bottom-3 left-3 text-white">
                        <p className="font-bold text-lg drop-shadow">{pkg.hotel}</p>
                        <p className="text-sm opacity-90">{'⭐'.repeat(pkg.hotelStars)}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <i className="fa-solid fa-plane text-blue-500"></i>
                          <span>{pkg.airline}</span>
                          <span className="text-gray-300">|</span>
                          <span>{pkg.originCity} → {pkg.destCity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <i className="fa-solid fa-moon text-indigo-500"></i>
                          <span>{pkg.nights} {t('flightAndHotel.nights')}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-400 line-through">{pkg.originalPrice.toLocaleString('vi-VN')} đ</p>
                          <p className="text-xl font-bold text-gray-900">{pkg.packagePrice.toLocaleString('vi-VN')} đ</p>
                          <p className="text-[10px] text-gray-400">{t('flightAndHotel.perPerson')}</p>
                        </div>
                        <DetailOverlay
                          trigger={
                            <button className="bg-[#006ce4] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#003b95] transition-all duration-200 flex items-center gap-2 text-sm active:scale-95">
                              {t('flightAndHotel.viewPackage')} <i className="fa-solid fa-chevron-right text-xs"></i>
                            </button>
                          }
                          title={pkg.hotel}
                          description={`${pkg.originCity} → ${pkg.destCity} • ${pkg.airline}`}
                          content={
                            <div className="space-y-4">
                              {/* Hotel image */}
                              <div className="rounded-lg overflow-hidden h-48">
                                <img src={pkg.hotelImg} alt={pkg.hotel} className="w-full h-full object-cover" />
                              </div>
                              {/* Flight info */}
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                  <i className="fa-solid fa-plane"></i> {t('flightAndHotel.flightInfo')}
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-gray-500">{t('flightAndHotel.airline')}</p>
                                    <p className="font-semibold">{pkg.airline}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">{t('flightAndHotel.route')}</p>
                                    <p className="font-semibold">{pkg.originCity} → {pkg.destCity}</p>
                                  </div>
                                </div>
                              </div>
                              {/* Hotel info */}
                              <div className="bg-amber-50 p-4 rounded-lg">
                                <p className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                  <i className="fa-solid fa-hotel"></i> {t('flightAndHotel.hotelInfo')}
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-gray-500">{t('flightAndHotel.hotelName')}</p>
                                    <p className="font-semibold">{pkg.hotel}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">{t('flightAndHotel.duration')}</p>
                                    <p className="font-semibold">{pkg.nights} {t('flightAndHotel.nights')}</p>
                                  </div>
                                </div>
                              </div>
                              {/* Benefits */}
                              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2.5 rounded-lg">
                                  <i className="fa-solid fa-check"></i> {t('flightAndHotel.freeCancellation')}
                                </div>
                                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2.5 rounded-lg">
                                  <i className="fa-solid fa-check"></i> {t('flightAndHotel.insurance')}
                                </div>
                                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2.5 rounded-lg">
                                  <i className="fa-solid fa-shield-halved"></i> {t('flightAndHotel.securePayment')}
                                </div>
                                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2.5 rounded-lg">
                                  <i className="fa-solid fa-percent"></i> {t('flightAndHotel.bestPrice')}
                                </div>
                              </div>
                            </div>
                          }
                          footer={
                            <div className="flex flex-col items-end">
                              <p className="text-sm text-gray-400 line-through">{(pkg.originalPrice * guests).toLocaleString('vi-VN')} đ</p>
                              <p className="text-xl font-bold text-gray-900 mb-2">Tổng: {(pkg.packagePrice * guests).toLocaleString('vi-VN')} đ</p>
                              <p className="text-[10px] text-gray-500 mb-2">Cho {guests} khách</p>
                              <button
                                onClick={() => navigate(`/checkout?type=package&name=${encodeURIComponent(pkg.hotel + ' + ' + pkg.airline)}&price=${pkg.packagePrice * guests}&details=${encodeURIComponent(JSON.stringify({ [t('flightAndHotel.route')]: pkg.originCity + ' → ' + pkg.destCity, [t('flightAndHotel.airline')]: pkg.airline, [t('flightAndHotel.duration')]: pkg.nights + ' ' + t('flightAndHotel.nights'), 'Khách': guests }))}`)}
                                className="bg-[#006ce4] text-white px-8 py-2.5 rounded-md font-bold hover:bg-[#003b95] transition"
                              >
                                {t('flightAndHotel.bookPackage')}
                              </button>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phần nội dung quảng cáo gói - Ẩn đi khi đang tìm kiếm */}
        {!searching && (
          <div className="section-container mt-12 mb-20">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-center justify-between">
                  <div>
                      <h3 className="text-lg font-bold text-blue-900">{t('flightAndHotel.whyBookLabel')}</h3>
                      <ul className="mt-2 text-blue-800 list-disc list-inside space-y-1">
                          <li>{t('flightAndHotel.whyBook1')}</li>
                          <li>{t('flightAndHotel.whyBook2')}</li>
                          <li>{t('flightAndHotel.whyBook3')}</li>
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