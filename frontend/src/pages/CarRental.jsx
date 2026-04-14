import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Select, Checkbox, ConfigProvider, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

// Constants cho bảng màu Booking.com
const NAVY = '#003580';
const CB = '#006ce4';

const CarRental = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSearch = async () => {
    if (!pickupCity || !pickupDatetime) {
      message.warning(t('carRental.fillSearchInfo') || t('common.pleaseSelectPickupInfo') || "Vui lòng chọn địa điểm nhận và ngày giờ");
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
      
      const pickup = pickupDatetime[0];
      const dropoff = pickupDatetime[1];
      const diffHours = dropoff.diff(pickup, 'hour');
      const rentalDays = Math.max(1, Math.ceil(diffHours / 24));

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
        colorPrimary: CB, 
        fontFamily: "'Inter', sans-serif" 
      } 
    }}>
      <div className="w-full flex flex-col items-center bg-[#f7f8fa] min-h-screen pb-20 font-sans">

        {/* HERO Banner */}
        <div style={{ background: NAVY, paddingBottom: '90px', paddingTop: '80px' }} className="w-full px-4 relative">
            <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight leading-tight">
                    {t('carRental.heroTitle')}
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                    {t('carRental.heroSubtitle')}
                </p>
            </div>
        </div>

        {/* SEARCH BOX */}
        <div className="max-w-[1140px] mx-auto px-4 w-full relative z-20 -mt-8">
          <div className="bg-white rounded-[24px] p-2 shadow-2xl border border-gray-100">
            
            <div className="px-5 py-3 border-b border-gray-50 flex items-center">
              <Checkbox onChange={(e) => setDifferentLocation(e.target.checked)} className="font-bold text-[#0a0b0d]">
                {t('carRental.differentLocation')}
              </Checkbox>
            </div>

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Điểm nhận */}
              <div className={`${differentLocation ? 'flex-1' : 'flex-[1.5]'} flex items-center min-w-0 gap-3 p-4 hover:bg-gray-50 transition-colors first:rounded-bl-[22px]`}>
                <LocationOnIcon className="text-gray-300 shrink-0" />
                <Select
                  showSearch
                  placeholder={t('carRental.pickupPlaceholder') || "Thành phố nhận xe"}
                  variant="borderless"
                  className="w-full font-bold text-lg min-w-0"
                  onChange={(val) => setPickupCity(val)}
                  filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={locations.map(city => ({ value: city, label: city }))}
                />
              </div>

              {/* Điểm trả */}
              {differentLocation && (
                <div className="flex-1 flex items-center min-w-0 gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <LocationOnIcon className="text-red-300 shrink-0" />
                  <Select
                    showSearch
                    placeholder={t('carRental.dropoffPlaceholder') || "Thành phố trả xe"}
                    variant="borderless"
                    className="w-full font-bold text-lg min-w-0"
                    value={dropoffCity}
                    onChange={(val) => setDropoffCity(val)}
                    filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={locations.map(city => ({ value: city, label: city }))}
                  />
                </div>
              )}

              {/* Lịch trình */}
              <div className="flex-[1.5] min-w-[250px] lg:min-w-0 flex items-center px-4 py-3 gap-3 hover:bg-gray-50 transition-colors">
                <i className="fa-regular fa-calendar text-gray-300 text-lg shrink-0"></i>
                <ConfigProvider theme={{ token: { colorPrimary: CB, borderRadius: 12 } }}>
                  <RangePicker
                    disabledDate={disabledDate}
                    variant="borderless"
                    className="w-full font-medium"
                    format="DD/MM/YYYY HH:mm"
                    showTime={{ format: 'HH:mm' }}
                    placeholder={[t('carRental.pickupDateTime') || 'Ngày & giờ nhận xe', t('carRental.dropoffDateTime') || 'Ngày & giờ trả xe']}
                    onChange={(dates) => setPickupDatetime(dates)}
                    separator={<i className="fa-solid fa-arrow-right text-gray-300 text-xs shrink-0"></i>}
                  />
                </ConfigProvider>
              </div>

              {/* CTA */}
              <div className="shrink-0 p-2">
                <button
                  onClick={handleSearch}
                  className="h-full min-h-[56px] px-8 text-white font-black text-lg transition-all active:scale-95 flex items-center justify-center rounded-[18px] w-full"
                  style={{ background: CB }}
                  onMouseOver={e => e.currentTarget.style.background = '#003b95'}
                  onMouseOut={e => e.currentTarget.style.background = CB}
                >
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <>{t('carRental.search') || 'Tìm kiếm'}</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results... */}
        {results.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-12 w-full">
            <h2 className="text-2xl font-black mb-6 text-[#0a0b0d]">{t('carRental.searchResults')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((car) => (
                <div key={car.id} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col group">
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-lg text-[#003580] mb-0.5">{car.companyName}</h3>
                            <p className="text-2xl font-black text-[#0a0b0d] group-hover:text-[#006ce4] transition-colors">{car.carModel}</p>
                        </div>
                        <div className="bg-blue-50 text-[#006ce4] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-blue-50">
                            {t('carRental.bestValue') || 'Đảm bảo nhất'}
                        </div>
                      </div>
                      
                      <div className="flex gap-4 mb-4 font-bold text-gray-400">
                        <span className="flex items-center gap-1.5"><i className="fa-solid fa-user-group text-xs"></i> {car.seats} Ghế</span>
                        <span className="flex items-center gap-1.5"><i className="fa-solid fa-gear text-xs"></i> {t('carRental.automatic') || 'Tự động'}</span>
                      </div>

                      <div className="text-[13px] bg-gray-50 text-gray-500 p-3 rounded-xl mb-6 font-medium italic">
                        <i className="fa-solid fa-location-dot text-[#006ce4] mr-2"></i> {car.location?.name}, {car.location?.city}
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-gray-50 pt-5">
                      <div className="flex flex-col">
                        <p className="text-2xl font-black text-[#0a0b0d] leading-none mb-1">{car.totalPrice.toLocaleString('vi-VN')} <span className="text-sm">đ</span></p>
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{car.pricePerDay.toLocaleString('vi-VN')} đ × {car.rentalDays} ngày</span>
                      </div>
                      <DetailOverlay 
                        trigger={
                            <button className="bg-[#006ce4] text-white px-8 py-3 rounded-xl font-black hover:bg-[#003b95] transition-all active:scale-95 shadow-md">
                                {t('carRental.rentNow')}
                            </button>
                        }
                        title={car.carModel}
                        description={car.companyName}
                        content={
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-5 rounded-2xl flex items-center justify-between border border-blue-100">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('carRental.providedBy') || 'Dịch vụ bởi'}</p>
                                    <p className="text-xl font-black text-[#003580]">{car.companyName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('carRental.total') || 'Tổng cộng'}</p>
                                    <p className="text-xl font-black text-[#0a0b0d]">{car.totalPrice.toLocaleString('vi-VN')} đ</p>
                                </div>
                            </div>
                          </div>
                        }
                        footer={
                          <button
                            className="bg-[#006ce4] text-white w-full py-4 rounded-xl font-black hover:bg-[#003b95] transition shadow-lg text-lg uppercase"
                            onClick={() => navigate(`/checkout?type=car&name=${encodeURIComponent(car.carModel + ' - ' + car.companyName)}&price=${car.totalPrice}&details=${encodeURIComponent(JSON.stringify({ [t('carRental.pickupAt') || "Nhận tại"]: car.location?.city }))}`)}
                          >
                            {t('carRental.continueBooking')}
                          </button>
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why Us... */}
        {results.length === 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-20 w-full animate-fade-in-up">
            <h2 className="text-3xl font-black mb-10 text-[#0a0b0d] text-center">{t('carRental.heroSectionTitle') || 'Hành trình thoải mái hơn cùng Booking.com'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { icon: 'fa-calendar-xmark', title: t('carRental.freeCancellation'), desc: t('carRental.freeCancellationDesc'), color: '#10b981' },
                  { icon: 'fa-building-shield', title: t('carRental.manyCompanies'), desc: t('carRental.manyCompaniesDesc'), color: '#006ce4' },
                  { icon: 'fa-comment-dollar', title: t('carRental.noHiddenFees'), desc: t('carRental.noHiddenFeesDesc'), color: '#f59e0b' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform shadow-inner" style={{ backgroundColor: item.color + '10', color: item.color }}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h3 className="font-black text-[#0a0b0d] mb-4 text-xl">{item.title}</h3>
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

export default CarRental;