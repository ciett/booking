import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Select, InputNumber, ConfigProvider, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import GroupIcon from '@mui/icons-material/Group';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

// Constants cho bảng màu Booking.com
const NAVY = '#003580';
const CB = '#006ce4';

const FlightAndHotel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  const [airports, setAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [departureCode, setDepartureCode] = useState(null);
  const [destination, setDestination] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [guests, setGuests] = useState(2);
  const [dates, setDates] = useState(null);

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
    if (!departureCode || !destination || !dates) {
      message.warning(t('common.pleaseSelectOriginDest') || "Vui lòng chọn điểm đi, điểm đến và lịch trình");
      return;
    }
    setLoading(true);
    setSearching(true);
    setTimeout(() => {
      setResults(generateMockPackages(departureCode, destination));
      setLoading(false);
    }, 1000);
  };

  return (
    <ConfigProvider theme={{ 
      token: { 
        colorPrimary: CB, 
        fontFamily: "'Inter', sans-serif" 
      } 
    }}>
      <div className="w-full flex flex-col items-center bg-[#f7f8fa] min-h-screen pb-20 font-sans">
        
        {/* HERO Banner */}
        <div style={{ background: NAVY, paddingBottom: '90px', paddingTop: '80px' }} className="w-full px-4 relative">
            <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight leading-tight">
                    {t('flightAndHotel.heroTitle')}
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                    {t('flightAndHotel.heroSubtitle')}
                </p>
            </div>
        </div>

        {/* SEARCH BOX */}
        <div className="max-w-[1140px] mx-auto px-4 w-full relative z-20 -mt-12">
          <div className="bg-white rounded-[24px] p-2 shadow-2xl border border-gray-100">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              {/* Điểm đi */}
              <div className="flex items-center px-5 py-4 flex-1 min-w-0 gap-3 hover:bg-gray-50 transition-colors first:rounded-l-[22px]">
                <FlightTakeoffIcon className="text-gray-300 shrink-0" />
                <Select 
                  showSearch 
                  placeholder="Thành phố hoặc sân bay"
                  variant="borderless" 
                  className="w-full font-bold text-lg min-w-0"
                  onChange={(val) => setDepartureCode(val)}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
              </div>

              {/* Điểm đến */}
              <div className="flex items-center px-5 py-4 flex-1 min-w-0 gap-3 hover:bg-gray-50 transition-colors">
                <HotelIcon className="text-gray-300 shrink-0" />
                <Select 
                  showSearch 
                  placeholder="Thành phố hoặc khách sạn"
                  variant="borderless" 
                  className="w-full font-bold text-lg min-w-0"
                  onChange={(val) => setDestination(val)}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={cities.map(city => ({ value: city, label: city }))} />
              </div>

              {/* Lịch trình */}
              <div className="flex items-center px-4 py-3 flex-[1.5] min-w-[250px] lg:min-w-0 gap-3 hover:bg-gray-50 transition-colors">
                <i className="fa-regular fa-calendar text-gray-300 text-lg shrink-0"></i>
                <ConfigProvider theme={{ token: { colorPrimary: CB, borderRadius: 12 } }}>
                  <RangePicker 
                    placeholder={['Ngày đi', 'Ngày về']}
                    disabledDate={disabledDate} 
                    variant="borderless"
                    className="w-full font-medium"
                    format="DD/MM/YYYY"
                    onChange={(d) => setDates(d)}
                    separator={<i className="fa-solid fa-arrow-right text-gray-300 text-xs shrink-0"></i>}
                  />
                </ConfigProvider>
              </div>

              {/* Số khách */}
              <div className="flex items-center px-5 py-4 w-[140px] shrink-0 gap-2 hover:bg-gray-50 transition-colors cursor-pointer">
                <GroupIcon className="text-gray-300 shrink-0" />
                <InputNumber 
                  min={1} 
                  value={guests} 
                  onChange={(val) => setGuests(val)} 
                  variant="borderless"
                  className="w-full font-bold text-lg min-w-0"
                  controls={false}
                />
              </div>

              {/* CTA */}
              <div className="shrink-0 p-2">
                <button 
                  onClick={handleSearch}
                  className="h-full min-h-[56px] px-8 text-white font-black text-lg transition-all active:scale-95 flex items-center justify-center rounded-[18px] w-full"
                  style={{ background: CB }}
                  onMouseOver={e => !loading && (e.currentTarget.style.background = '#578bfa')}
                  onMouseOut={e => !loading && (e.currentTarget.style.background = CB)}
                >
                  {searching && loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <>{t('home.searchButton') || 'Tìm kiếm'}</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results... (Phần còn lại giữ nguyên) */}
        {searching && (
          <div className="max-w-6xl mx-auto px-4 mt-12 w-full">
            <h2 className="text-2xl font-black mb-2 text-[#0a0b0d]">{t('flightAndHotel.searchResults')}</h2>
            <p className="text-gray-500 mb-6 font-medium">{t('flightAndHotel.searchDesc')}</p>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006ce4]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <img src={pkg.hotelImg} alt={pkg.hotel} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                      <span className="absolute top-4 left-4 bg-[#10b981] text-white text-[12px] font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                        <i className="fa-solid fa-bolt mr-1"></i> {t('flightAndHotel.save')} {pkg.savings}%
                      </span>
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-extrabold text-xl leading-tight mb-1 drop-shadow-lg">{pkg.hotel}</p>
                        <div className="flex text-yellow-400 text-sm gap-0.5">
                            {'★'.repeat(pkg.hotelStars)}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[#0a0b0d] font-bold mb-3">
                          <i className="fa-solid fa-plane text-[#006ce4]"></i>
                          <span>{pkg.airline}</span>
                          <span className="text-gray-300">•</span>
                          <span>{pkg.originCity} → {pkg.destCity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-xl">
                          <i className="fa-regular fa-moon text-[#003580] font-bold"></i>
                          <span className="font-medium">{pkg.nights} {t('flightAndHotel.nights')} - Bao gồm bữa sáng</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                        <div className="flex flex-col">
                          <p className="text-xs text-gray-400 line-through font-bold mb-1">{pkg.originalPrice.toLocaleString('vi-VN')} đ</p>
                          <p className="text-2xl font-black text-[#0a0b0d] leading-none mb-1">{pkg.packagePrice.toLocaleString('vi-VN')} <span className="text-sm">đ</span></p>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{t('flightAndHotel.perPerson')}</p>
                        </div>
                        <DetailOverlay
                          trigger={
                            <button className="bg-[#006ce4] text-white px-6 py-3 rounded-xl font-black hover:bg-[#003b95] transition-all duration-200 flex items-center gap-2 text-sm active:scale-95">
                              {t('flightAndHotel.viewPackage')} <i className="fa-solid fa-chevron-right text-xs"></i>
                            </button>
                          }
                          title={pkg.hotel}
                          description={`${pkg.originCity} → ${pkg.destCity} • ${pkg.airline}`}
                          content={
                            <div className="space-y-4">
                              <div className="rounded-2xl overflow-hidden h-48 shadow-inner">
                                <img src={pkg.hotelImg} alt={pkg.hotel} className="w-full h-full object-cover" />
                              </div>
                              <div className="bg-[#006ce4] bg-opacity-5 p-4 rounded-2xl border border-blue-50">
                                <p className="font-black text-[#003580] mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                                  <i className="fa-solid fa-plane-departure"></i> {t('flightAndHotel.flightInfo')}
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                                    <p>{pkg.airline}</p>
                                    <p className="text-right">{pkg.originCity} → {pkg.destCity}</p>
                                </div>
                              </div>
                            </div>
                          }
                          footer={
                            <div className="flex flex-col items-end w-full">
                                <div className="text-right mb-4">
                                    <p className="text-sm text-gray-400 line-through font-bold">{(pkg.originalPrice * guests).toLocaleString('vi-VN')} đ</p>
                                    <p className="text-3xl font-black text-[#0a0b0d]">Tổng: {(pkg.packagePrice * guests).toLocaleString('vi-VN')} <span className="text-sm">đ</span></p>
                                </div>
                                <button
                                    onClick={() => navigate(`/checkout?type=package&name=${encodeURIComponent(pkg.hotel + ' + ' + pkg.airline)}&price=${pkg.packagePrice * guests}&details=${encodeURIComponent(JSON.stringify({ [t('flightAndHotel.route')]: pkg.originCity + ' → ' + pkg.destCity, 'Khách': guests }))}`)}
                                    className="bg-[#006ce4] text-white w-full py-4 rounded-xl font-black hover:bg-[#003b95] transition shadow-lg text-lg uppercase"
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

        {/* Why Book... */}
        {!searching && (
          <div className="max-w-6xl mx-auto px-4 mt-20 w-full animate-fade-in-up">
              <h2 className="text-3xl font-black mb-10 text-[#0a0b0d] text-center">{t('flightAndHotel.whyBookLabel')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {[
                      { icon: 'fa-tags', color: '#10b981', title: t('flightAndHotel.whyBook1'), desc: 'Giá trọn gói luôn rẻ hơn 15-20% so với đặt lẻ từng dịch vụ.' },
                      { icon: 'fa-calendar-check', color: '#006ce4', title: t('flightAndHotel.whyBook2'), desc: 'Chỉ một lần đặt duy nhất cho cả vé máy bay và phòng khách sạn.' },
                      { icon: 'fa-headset', color: '#f59e0b', title: t('flightAndHotel.whyBook3'), desc: 'Hỗ trợ đồng thời cho cả hành trình bay và lưu trú của bạn.' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: item.color + '15', color: item.color }}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <h3 className="text-xl font-black text-[#0a0b0d] mb-3">{item.title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
              </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default FlightAndHotel;