import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Select, Radio, ConfigProvider, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

// Constants cho bảng màu Booking.com
const NAVY = '#003580';
const CB = '#006ce4';

const disabledDate = (current) => {
  return current && current < dayjs().startOf('day');
};

const Flights = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [departureCode, setDepartureCode] = useState(null);
  const [arrivalCode, setArrivalCode] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [tripType, setTripType] = useState('roundtrip');
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
    if (!departureCode || !arrivalCode || !departureDate || departureDate.length === 0) {
      if (tripType === 'roundtrip' && (!departureDate || departureDate.length !== 2)) {
          message.warning(t('flights.selectRoundtripDates'));
          return;
      }
      message.warning(t('flights.fillSearchInfo'));
      return;
    }
    setLoading(true);
    try {
      // Tìm chuyến đi
      const outStart = departureDate[0].startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const outEnd = departureDate[0].endOf('day').format('YYYY-MM-DDTHH:mm:ss');
      
      const responseOut = await axios.get(`/api/flights/search`, {
        params: { departureCode, arrivalCode, startDate: outStart, endDate: outEnd }
      });
      let outFlights = responseOut.data;

      if (tripType === 'roundtrip') {
        const retStart = departureDate[1].startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const retEnd = departureDate[1].endOf('day').format('YYYY-MM-DDTHH:mm:ss');
        
        const responseRet = await axios.get(`/api/flights/search`, {
          params: { departureCode: arrivalCode, arrivalCode: departureCode, startDate: retStart, endDate: retEnd }
        });
        const retFlights = responseRet.data;

        if (retFlights.length === 0) {
          message.warning(t('flights.noReturnFlight'));
          setResults([]);
        } else {
          const cheapestReturn = retFlights.reduce((prev, curr) => (prev.price < curr.price ? prev : curr), retFlights[0]);
          const combined = outFlights.map(out => ({ ...out, returnFlight: cheapestReturn }));
          setResults(combined);
        }
      } else {
        setResults(outFlights);
      }
    } catch (error) {
      console.error("Error fetching flights", error);
      message.error(t('flights.searchError'));
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
                    {t('flights.heroTitle')}
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                    {t('flights.heroSubtitle')}
                </p>
            </div>
        </div>

        {/* SEARCH BOX */}
        <div className="max-w-[1140px] mx-auto px-4 w-full relative z-20 -mt-8">
          <div className="bg-white rounded-[24px] p-2 shadow-2xl border border-gray-100">
            <div className="px-5 py-2 border-b border-gray-50 flex items-center">
                <Radio.Group value={tripType} onChange={(e) => setTripType(e.target.value)} buttonStyle="solid">
                    <Radio.Button value="roundtrip" className="font-bold">{t('flights.roundtrip')}</Radio.Button>
                    <Radio.Button value="oneway" className="font-bold">{t('flights.oneway')}</Radio.Button>
                </Radio.Group>
            </div>
            
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Điểm đi */}
                <div className="flex items-center px-5 py-4 flex-1 min-w-0 gap-3 hover:bg-gray-50 transition-colors first:rounded-bl-[22px]">
                    <FlightTakeoffIcon className="text-gray-300 shrink-0" />
                    <Select
                        showSearch
                        placeholder={t('flights.originPlaceholder') || "T.phố khởi hành"}
                        variant="borderless"
                        className="w-full font-bold text-lg min-w-0"
                        onChange={(val) => setDepartureCode(val)}
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>

                {/* Điểm đến */}
                <div className="flex items-center px-5 py-4 flex-1 min-w-0 gap-3 hover:bg-gray-50 transition-colors">
                    <FlightLandIcon className="text-gray-300 shrink-0" />
                    <Select
                        showSearch
                        placeholder={t('flights.destPlaceholder') || "T.phố hạ cánh"}
                        variant="borderless"
                        className="w-full font-bold text-lg min-w-0"
                        onChange={(val) => setArrivalCode(val)}
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>

                {/* DATE */}
                <div className="flex items-center px-4 py-3 flex-[1.5] min-w-[250px] lg:min-w-0 gap-3 hover:bg-gray-50 transition-colors">
                    <i className="fa-regular fa-calendar text-gray-300 text-lg shrink-0"></i>
                    <ConfigProvider theme={{ token: { colorPrimary: CB, borderRadius: 12 } }}>
                      <RangePicker
                          disabledDate={disabledDate} 
                          variant="borderless"
                          className="w-full font-medium"
                          format="DD/MM/YYYY"
                          placeholder={[t('home.searchDateCheckIn') || 'Ngày đi', t('home.searchDateCheckOut') || 'Ngày về']}
                          onChange={(dates) => setDepartureDate(dates)}
                          separator={<i className="fa-solid fa-arrow-right text-gray-300 text-xs shrink-0"></i>}
                      />
                    </ConfigProvider>
                </div>

                {/* CTA */}
                <div className="shrink-0 p-2">
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="h-full min-h-[56px] px-8 text-white font-black text-lg transition-all active:scale-95 flex items-center justify-center rounded-[18px] w-full"
                        style={{ background: loading ? '#94a3b8' : CB }}
                        onMouseOver={e => !loading && (e.currentTarget.style.background = '#578bfa')}
                        onMouseOut={e => !loading && (e.currentTarget.style.background = CB)}
                    >
                        {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <>{t('home.searchButton') || 'Tìm kiếm'}</>}
                    </button>
                </div>
            </div>

          </div>
        </div>

        {/* Lợi ích */}
        {results.length === 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-20 w-full animate-fade-in-up">
            <h2 className="text-3xl font-black mb-8 text-[#0a0b0d] text-center">{t('flights.whyBookWithUs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { icon: 'fa-magnifying-glass', title: t('flights.hugeSelection'), desc: t('flights.hugeSelectionDesc') },
                  { icon: 'fa-tags', title: t('flights.noHiddenFees'), desc: t('flights.noHiddenFeesDesc') },
                  { icon: 'fa-calendar-check', title: t('flights.moreFlexibility'), desc: t('flights.moreFlexibilityDesc') }
              ].map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center text-center bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform" style={{ background: CB + '12', color: CB }}>
                    <i className={`fa-solid ${feature.icon}`}></i>
                  </div>
                  <h3 className="font-black text-xl mb-3 text-[#0a0b0d]">{feature.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List vé */}
        {results.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-12 w-full">
            <h2 className="text-2xl font-black mb-6 text-[#0a0b0d]">{t('flights.searchResults')}</h2>
            <div className="flex flex-col gap-5">
              {results.map((flight) => {
                const isRound = tripType === 'roundtrip';
                const retPrice = flight.returnFlight ? flight.returnFlight.price : 0;
                const ecoTotal = isRound ? (flight.price + retPrice + 200000) : flight.price;
                const bizTotal = isRound ? ((flight.price * 2.5) + (retPrice * 2.5) + 200000) : (flight.price * 2.5);
                const tripLabelEco = (isRound ? ` (${t('flights.roundtrip')})` : ` (${t('flights.oneway')})`) + ` - ${t('flights.economy')}`;
                const tripLabelBiz = (isRound ? ` (${t('flights.roundtrip')})` : ` (${t('flights.oneway')})`) + ` - ${t('flights.business')}`;

                return (
                <div key={flight.id} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group">
                  <div className="p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex flex-col w-full md:w-1/4 shrink-0">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                <i className="fa-solid fa-plane-departure text-[#006ce4]"></i>
                            </div>
                            <span className="font-black text-xl text-[#0a0b0d] truncate">{flight.airline}</span>
                        </div>
                        <span className="text-sm text-gray-400 font-bold ml-13">{t('flights.flightNumber')}: {flight.flightNumber}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 md:gap-8 w-full flex-1 text-center">
                        <div className="flex flex-col">
                            <div className="text-3xl font-black text-[#0a0b0d]">{dayjs(flight.departureTime).format('HH:mm')}</div>
                            <div className="text-gray-400 font-bold text-sm tracking-widest">{flight.departureAirport?.code}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center w-full max-w-[150px]">
                            <span className="text-[11px] text-[#006ce4] font-black uppercase tracking-widest mb-1">{t('flights.directFlight')}</span>
                            <div className="w-full border-b-2 border-dashed border-gray-200 relative flex items-center justify-center mb-4">
                                <i className="fa-solid fa-plane absolute bg-white px-2 text-gray-300 text-xs"></i>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-3xl font-black text-[#0a0b0d]">{dayjs(flight.arrivalTime).format('HH:mm')}</div>
                            <div className="text-gray-400 font-bold text-sm tracking-widest">{flight.arrivalAirport?.code}</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                        <span className="text-xs text-gray-400 mb-1 font-black uppercase tracking-widest">{t('flights.pricePerPassenger')}</span>
                        <span className="text-3xl font-black text-[#0a0b0d] mb-3">{ecoTotal.toLocaleString('vi-VN')} <span className="text-sm">VND</span></span>
                        <DetailOverlay 
                        trigger={
                            <button className="px-10 py-3 rounded-xl text-white font-black text-base transition-all active:scale-95 shadow-md"
                                    style={{ background: CB }}
                                    onMouseOver={e => e.currentTarget.style.background = '#003b95'}
                                    onMouseOut={e => e.currentTarget.style.background = CB}>
                                {t('flights.selectFlight')}
                            </button>
                        }
                        title={flight.airline}
                        description={`${t('flights.journeyLabel')} ${flight.flightNumber}`}
                        content={
                            <div className="space-y-4">
                                <div className="bg-[#006ce4] bg-opacity-5 p-4 rounded-2xl border border-blue-100 flex justify-between items-center">
                                    <span className="font-black text-[#003580]">{flight.airline} {isRound ? t('flights.roundtrip') : t('flights.oneway')}</span>
                                    <span className="bg-white px-3 py-1 rounded-lg text-sm font-black shadow-sm">#{flight.flightNumber}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('flights.departure')}</p>
                                        <p className="font-black text-2xl text-[#0a0b0d] mb-1">{dayjs(flight.departureTime).format('HH:mm')}</p>
                                        <p className="font-bold text-sm text-gray-700">{flight.departureAirport?.city} ({flight.departureAirport?.code})</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('flights.arrival')}</p>
                                        <p className="font-black text-2xl text-[#0a0b0d] mb-1">{dayjs(flight.arrivalTime).format('HH:mm')}</p>
                                        <p className="font-bold text-sm text-gray-700">{flight.arrivalAirport?.city} ({flight.arrivalAirport?.code})</p>
                                    </div>
                                </div>
                                {flight.returnFlight && (
                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                        <p className="font-black text-[#006ce4] mb-3 flex items-center gap-2">
                                            <i className="fa-solid fa-plane fa-flip-horizontal"></i> {t('flights.returnFlight')}: {flight.returnFlight.airline}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-blue-50 p-3 rounded-2xl">
                                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{dayjs(flight.returnFlight.departureTime).format('HH:mm')}</p>
                                                <p className="font-bold text-xs">{flight.returnFlight.departureAirport?.code}</p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-2xl">
                                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{dayjs(flight.returnFlight.arrivalTime).format('HH:mm')}</p>
                                                <p className="font-bold text-xs">{flight.returnFlight.arrivalAirport?.code}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                        footer={
                            <div className="flex flex-col gap-3 w-full">
                                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <div>
                                        <p className="font-black text-[#0a0b0d]">{t('flights.economyClass')}</p>
                                        <p className="text-xs text-gray-400 font-bold">{t('flights.carryOn')}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-black text-[#0a0b0d]">{ecoTotal.toLocaleString('vi-VN')} đ</span>
                                        <button className="bg-[#006ce4] text-white px-6 py-2 rounded-xl font-black text-sm active:scale-95"
                                            onClick={() => navigate(`/checkout?type=flight&name=${encodeURIComponent(flight.airline + ' ' + flight.flightNumber + tripLabelEco)}&price=${ecoTotal}&details=${encodeURIComponent(JSON.stringify({ [t('flights.departure')]: flight.departureAirport?.city, [t('flights.arrival')]: flight.arrivalAirport?.city }))}`)}>
                                            {t('flights.selectFlight')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        />
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Flights;