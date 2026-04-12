import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Input, TimePicker, ConfigProvider, Select, AutoComplete, message } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../context/ConfigContext';

const AirportTaxis = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getImage } = useConfig();
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  const [airportCode, setAirportCode] = useState('');
  const [pickupCity, setPickupCity] = useState('');
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
    if (!pickupCity) {
      message.warning(t('common.pleaseSelectCity') || "Vui lòng nhập thành phố");
      return;
    }
    setLoading(true);
    try {
      const params = { city: pickupCity };
      if (date && time) {
        const pickupDatetime = date.hour(time.hour()).minute(time.minute()).second(0);
        params.pickupTime = pickupDatetime.format('YYYY-MM-DDTHH:mm:ss');
      }
      const response = await axios.get(`/api/airport-taxis/search`, {
        params: params
      });

      // Logic tinh gia: neu co destination thi + 200k phi di chuyen
      const processedResults = response.data.map(taxi => {
        let transferFee = 0;
        if (destination && destination.trim().length > 0) {
          transferFee = 200000;
        }
        return {
          ...taxi,
          transferFee,
          totalPrice: taxi.basePrice + transferFee,
          destination: destination || t('airportTaxis.center') || "Trung tâm thành phố"
        };
      });

      setResults(processedResults);
    } catch (error) {
      console.error("Error fetching taxis", error);
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
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">

        {/* Banner */}
        <div 
          className="bg-linear-to-br from-booking-blue via-blue-800 to-indigo-900 text-white relative w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8 shadow-inner overflow-hidden"
          style={{
            backgroundImage: getImage('img.taxis.hero') ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${getImage('img.taxis.hero')})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">{t('airportTaxis.heroTitle')}</h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-sm">{t('airportTaxis.heroSubtitle')}</p>
            </div>
        </div>

        {/* Search Bar cho Airport Taxis */}
        <div className="max-w-6xl mx-auto px-4 w-full relative z-20 -mt-12">
          <div className="bg-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden p-4 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

              {/* Điểm đón (Sân bay) */}
              <div className="md:col-span-4 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <i className="fa-solid fa-plane-arrival text-gray-400 ml-2"></i>
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase line-clamp-1">{t('airportTaxis.pickupLocation')}</span>
                  <AutoComplete
                    options={cities.map(city => ({ value: city }))}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    placeholder={t('airportTaxis.pickupPlaceholder')}
                    variant="borderless"
                    className="w-full text-sm"
                    value={pickupCity}
                    onChange={(val) => setPickupCity(val)}
                  />
                </div>
              </div>

              {/* Điểm đến (Khách sạn/Địa chỉ) */}
              <div className="md:col-span-4 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <i className="fa-solid fa-location-dot text-gray-400 ml-2"></i>
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase line-clamp-1">{t('airportTaxis.destination')}</span>
                  <AutoComplete
                    options={cities.map(city => ({ value: city }))}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    placeholder={t('airportTaxis.destPlaceholder')}
                    variant="borderless"
                    className="w-full text-sm custom-home-autocomplete"
                    value={destination}
                    onChange={(val) => setDestination(val)}
                  />
                </div>
              </div>

              {/* Ngày và Giờ */}
              <div className="md:col-span-2 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-400 uppercase px-3 line-clamp-1">{t('airportTaxis.pickupDate')}</span>
                <DatePicker disabledDate={disabledDate} variant="borderless" className="w-full text-sm" onChange={(d) => setDate(d)} />
              </div>

              <div className="md:col-span-2 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-400 uppercase px-3 line-clamp-1">{t('airportTaxis.pickupTime')}</span>
                <TimePicker format="HH:mm" variant="borderless" className="w-full text-sm" onChange={(t) => setTime(t)} />
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
                {loading ? t('airportTaxis.searching') : t('airportTaxis.search')}
              </Button>
            </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="section-container mt-8">
            <h2 className="text-2xl font-bold mb-4">{t('airportTaxis.searchResults')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((taxi) => (
                <div key={taxi.id} className="result-card flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-booking-blue mb-1">{taxi.carType}</h3>
                      <p className="text-sm text-gray-500 small"><i className="fa-solid fa-plane-arrival mr-2 text-gray-400"></i>{t('airportTaxis.airportPrefix')} {taxi.airport?.name} ({taxi.airport?.code}) - {taxi.airport?.city}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
                    <div>
                      <span className="text-xs text-gray-500 block">{t('airportTaxis.totalPrice')}</span>
                      <span className="text-2xl font-bold text-green-600">{taxi.totalPrice.toLocaleString('vi-VN')} đ</span>
                      {taxi.transferFee > 0 && <span className="text-[10px] text-gray-400 block">+ {taxi.transferFee.toLocaleString('vi-VN')} đ phí địa điểm</span>}
                    </div>
                    <DetailOverlay 
                      trigger={<Button variant="contained" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }}>{t('airportTaxis.bookPartner')}</Button>}
                      title={`${t('airportTaxis.taxiService')} ${taxi.carType}`}
                      description={`${t('airportTaxis.pickupAt')} ${taxi.airport?.code}`}
                      content={
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg">
                            <div className="text-3xl">🚗</div>
                            <div>
                              <p className="font-bold text-lg">{taxi.carType}</p>
                              <p className="text-sm text-gray-600">{t('airportTaxis.capacity')}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b py-2">
                              <span className="text-gray-500">{t('airportTaxis.pickupPoint')}</span>
                              <span className="font-medium">{taxi.airport?.name}</span>
                            </div>
                            <div className="flex justify-between border-b py-2">
                              <span className="text-gray-500">{t('airportTaxis.city')}</span>
                              <span className="font-medium">{taxi.airport?.city}</span>
                            </div>
                            <div className="flex justify-between border-b py-2">
                              <span className="text-gray-500">{t('airportTaxis.packagePrice')}</span>
                              <span className="font-bold text-green-600 italic">{taxi.basePrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                              <i className="fa-solid fa-circle-info"></i> {t('airportTaxis.instructionGuide')}
                            </p>
                            <p className="text-xs text-blue-700">{t('airportTaxis.instructionDesc')}</p>
                          </div>
                        </div>
                      }
                      footer={
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: '#006ce4' }}
                          onClick={() => navigate(`/checkout?type=taxi&name=${encodeURIComponent(taxi.carType)}&price=${taxi.totalPrice}&details=${encodeURIComponent(JSON.stringify({ [t('airportTaxis.pickupPoint')]: taxi.airport?.name + ' (' + taxi.airport?.code + ')', [t('airportTaxis.destination')]: taxi.destination, [t('airportTaxis.city')]: taxi.airport?.city }))}`)}
                        >{t('airportTaxis.confirmBooking')}</Button>
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
                <h4 className="font-bold">{t('airportTaxis.instantConfirm')}</h4>
                <p className="text-sm text-gray-500">{t('airportTaxis.instantConfirmDesc')}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 flex gap-4">
              <div className="text-3xl">🤝</div>
              <div>
                <h4 className="font-bold">{t('airportTaxis.pickupService')}</h4>
                <p className="text-sm text-gray-500">{t('airportTaxis.pickupServiceDesc')}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 flex gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h4 className="font-bold">{t('airportTaxis.fixedPrice')}</h4>
                <p className="text-sm text-gray-500">{t('airportTaxis.fixedPriceDesc')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default AirportTaxis;