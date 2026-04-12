import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Input, TimePicker, ConfigProvider, Select, AutoComplete, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';

// Constants cho bảng màu Booking.com
const NAVY = '#003580';
const CB = '#006ce4';

const AirportTaxis = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  const [pickupCity, setPickupCity] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [destination, setDestination] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/hotels/cities');
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching hotel cities", error);
      }
    };
    fetchCities();
  }, []);

  const handleSearch = async () => {
    if (!pickupCity) {
      message.warning(t('common.pleaseSelectCity') || "Vui lòng nhập thành phố hoặc sân bay");
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
        colorPrimary: CB, 
        fontFamily: "'Inter', sans-serif" 
      } 
    }}>
      <div className="w-full flex flex-col items-center bg-[#f7f8fa] min-h-screen pb-20 font-sans">

        {/* HERO Banner */}
        <div style={{ background: NAVY, paddingBottom: '90px', paddingTop: '80px' }} className="w-full px-4 relative">
            <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight leading-tight">
                    {t('airportTaxis.heroTitle')}
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                    {t('airportTaxis.heroSubtitle')}
                </p>
            </div>
        </div>

        {/* SEARCH BOX */}
        <div className="max-w-[1140px] mx-auto px-4 w-full relative z-20 -mt-8">
          <div className="bg-white rounded-[24px] p-2 shadow-2xl border border-gray-100">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">

              {/* Điểm đón */}
              <div className="flex-[1.2] flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors first:rounded-l-[22px] min-w-0">
                <i className="fa-solid fa-plane-arrival text-gray-300 text-lg ml-2 mr-1 shrink-0"></i>
                <div className="flex flex-col w-full min-w-0">
                  <AutoComplete
                    options={cities.map(city => ({ value: city }))}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    placeholder={t('airportTaxis.pickupPlaceholder') || "Điểm đón (Sân bay)"}
                    variant="borderless"
                    className="w-full font-bold text-gray-900 text-lg min-w-0"
                    value={pickupCity}
                    onChange={(val) => setPickupCity(val)}
                  />
                </div>
              </div>

              {/* Điểm đến */}
              <div className="flex-1 flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors min-w-0">
                <i className="fa-solid fa-location-dot text-gray-300 text-lg ml-2 mr-1 shrink-0"></i>
                <div className="flex flex-col w-full min-w-0">
                  <AutoComplete
                    options={cities.map(city => ({ value: city }))}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    placeholder={t('airportTaxis.destPlaceholder') || "Khách sạn hoặc địa điểm"}
                    variant="borderless"
                    className="w-full font-bold text-gray-900 text-lg min-w-0"
                    value={destination}
                    onChange={(val) => setDestination(val)}
                  />
                </div>
              </div>

              {/* Ngày */}
              <div className="flex-[0.8] min-w-[200px] lg:min-w-0 flex items-center p-4 hover:bg-gray-50 transition-colors">
                <i className="fa-regular fa-calendar text-gray-300 text-lg ml-3 mr-1 shrink-0"></i>
                <ConfigProvider theme={{ token: { colorPrimary: CB, borderRadius: 12 } }}>
                  <DatePicker 
                      disabledDate={disabledDate} 
                      variant="borderless"
                      className="w-full font-bold text-lg min-w-0"
                      format="DD/MM/YYYY"
                      placeholder="Ngày đón"
                      onChange={(d) => setDate(d)} 
                  />
                </ConfigProvider>
              </div>

              {/* CTA */}
              <div className="shrink-0 p-2">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="h-full min-h-[56px] px-8 text-white font-black text-lg transition-all active:scale-95 flex items-center justify-center rounded-[18px] w-full"
                  style={{ background: CB }}
                  onMouseOver={e => !loading && (e.currentTarget.style.background = '#003b95')}
                  onMouseOut={e => !loading && (e.currentTarget.style.background = CB)}
                >
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <>{t('airportTaxis.search') || 'Tìm kiếm'}</>}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Results... */}
        {results.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-12 w-full">
            <h2 className="text-2xl font-black mb-6 text-[#0a0b0d]">{t('airportTaxis.searchResults')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((taxi) => (
                <div key={taxi.id} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <i className="fa-solid fa-taxi text-3xl text-blue-600"></i>
                            </div>
                            <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">
                                Xác nhận ngay
                            </div>
                        </div>
                        <h3 className="font-black text-xl text-[#0a0b0d] mb-2 group-hover:text-[#006ce4] transition-colors">{taxi.carType}</h3>
                        <p className="text-[13px] text-gray-400 font-bold mb-6 flex items-start gap-2 leading-tight italic">
                            {taxi.airport?.name} ({taxi.airport?.code})
                        </p>
                    </div>

                    <div className="mt-auto pt-5 border-t border-gray-50 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1">{t('airportTaxis.totalPrice')}</span>
                        <span className="text-2xl font-black text-[#0a0b0d]">{taxi.totalPrice.toLocaleString('vi-VN')} <span className="text-sm">đ</span></span>
                      </div>
                      <DetailOverlay 
                        trigger={
                            <button className="bg-[#006ce4] text-white px-8 py-3 rounded-xl font-black hover:bg-[#003b95] transition-all active:scale-95 shadow-md">
                                {t('airportTaxis.bookPartner')}
                            </button>
                        }
                        title={taxi.carType}
                        description={taxi.airport?.name}
                        content={
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-5 rounded-2xl flex items-center gap-5 border border-blue-100">
                              <div className="text-3xl">🚖</div>
                              <p className="font-black text-xl text-[#003580]">{taxi.carType}</p>
                            </div>
                          </div>
                        }
                        footer={
                          <button
                            className="bg-[#006ce4] text-white w-full py-4 rounded-xl font-black hover:bg-[#003b95] transition shadow-lg text-lg uppercase"
                            onClick={() => navigate(`/checkout?type=taxi&name=${encodeURIComponent(taxi.carType)}&price=${taxi.totalPrice}&details=${encodeURIComponent(JSON.stringify({ [t('airportTaxis.pickupPoint')]: taxi.airport?.name }))}`)}
                          >
                            {t('airportTaxis.confirmBooking')}
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

        {/* Benefits... */}
        {results.length === 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-20 w-full animate-fade-in-up">
            <h2 className="text-3xl font-black mb-10 text-[#0a0b0d] text-center">Dịch vụ đưa đón tin cậy từ sân bay</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: 'fa-bolt', title: t('airportTaxis.instantConfirm'), desc: t('airportTaxis.instantConfirmDesc'), color: '#10b981' },
                    { icon: 'fa-handshake', title: t('airportTaxis.pickupService'), desc: t('airportTaxis.pickupServiceDesc'), color: '#006ce4' },
                    { icon: 'fa-sack-dollar', title: t('airportTaxis.fixedPrice'), desc: t('airportTaxis.fixedPriceDesc'), color: '#f59e0b' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: item.color + '10', color: item.color }}>
                        <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <h4 className="font-black text-[#0a0b0d] mb-3 text-xl">{item.title}</h4>
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

export default AirportTaxis;