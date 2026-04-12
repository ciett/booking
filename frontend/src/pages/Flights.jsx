import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Select, Radio, ConfigProvider, message } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../context/ConfigContext';

const { RangePicker } = DatePicker;

// Hàm chặn chọn ngày trong quá khứ (Dùng logic bạn vừa gửi)
const disabledDate = (current) => {
  // Không cho phép chọn những ngày trước ngày hôm nay
  return current && current < dayjs().startOf('day');
};

const Flights = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getImage } = useConfig();
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
    if (!departureCode || !arrivalCode || !departureDate) {
      message.warning("Vui lòng chọn đầy đủ thông tin: Điểm đi, Điểm đến và Ngày đi");
      return;
    }
    setLoading(true);
    try {
      // 1. Tìm chuyến đi
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
          message.warning("Không tìm thấy chuyến bay chiều về trong ngày bạn chọn!");
          setResults([]);
        } else {
          // Lấy chuyến về rẻ nhất để gép chung
          const cheapestReturn = retFlights.reduce((prev, curr) => (prev.price < curr.price ? prev : curr), retFlights[0]);
          
          const combined = outFlights.map(out => {
            return {
              ...out,
              returnFlight: cheapestReturn
            };
          });
          setResults(combined);
        }
      } else {
        // Một chiều
        setResults(outFlights);
      }
    } catch (error) {
      console.error("Error fetching flights", error);
      message.error("Lỗi khi tìm kiếm chuyến bay");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ 
      token: { 
        colorPrimary: '#003b95',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      } 
    }}>
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">

        {/* Banner */}
        <div 
          className="bg-linear-to-br from-booking-blue via-blue-800 to-indigo-900 text-white relative w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8 shadow-inner overflow-hidden"
          style={{
            backgroundImage: getImage('img.flights.hero') ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${getImage('img.flights.hero')})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">{t('flights.heroTitle')}</h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-sm">{t('flights.heroSubtitle')}</p>
            </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 w-full relative z-20 -mt-12">
          <div className="bg-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden p-4 shadow-inner">

            <Radio.Group value={tripType} onChange={(e) => setTripType(e.target.value)} buttonStyle="solid">
              <Radio.Button value="roundtrip">{t('flights.roundtrip')}</Radio.Button>
              <Radio.Button value="oneway">{t('flights.oneway')}</Radio.Button>
            </Radio.Group>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Điểm đi */}
              <div className="md:col-span-3 border rounded-lg p-2 hover:border-booking-blue bg-white flex items-center gap-2">
                <FlightTakeoffIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase font-sans line-clamp-1">{t('flights.from')}</span>
                  <Select
                    showSearch
                    placeholder={t('flights.originPlaceholder')}
                    variant="borderless"
                    className="w-full text-sm"
                    onChange={(val) => setDepartureCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* Điểm đến */}
              <div className="md:col-span-3 border rounded-lg p-2 hover:border-booking-blue bg-white flex items-center gap-2">
                <FlightLandIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase font-sans">{t('flights.to')}</span>
                  <Select
                    showSearch
                    placeholder={t('flights.destPlaceholder')}
                    variant="borderless"
                    className="w-full"
                    onChange={(val) => setArrivalCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* DATE SELECTION */}
              <div className="md:col-span-4 border rounded-lg p-1.5 hover:border-booking-blue bg-white">
                <span className="text-[10px] font-bold text-gray-400 uppercase px-3 font-sans line-clamp-1">{t('flights.dateRange')}</span>
                <RangePicker
                  disabledDate={disabledDate} // Áp dụng logic chặn ngày quá khứ
                  variant="borderless"
                  className="w-full text-sm"
                  format="DD/MM/YYYY"
                  placeholder={[t('flights.dateStart'), t('flights.dateEnd')]}
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
                  sx={{ borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', height: '100%', textTransform: 'none', padding: '10px 0' }}>
                  {loading ? t('flights.searching') : t('flights.search')}
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>


        {/* Lợi ích khi đặt vé */}
        {results.length === 0 && (
          <div className="section-container mt-12 mb-20 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">{t('flights.whyBookWithUs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 text-booking-blue rounded-full flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-search"></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{t('flights.hugeSelection')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t('flights.hugeSelectionDesc')}</p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 text-booking-blue rounded-full flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-tags"></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{t('flights.noHiddenFees')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t('flights.noHiddenFeesDesc')}</p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 text-booking-blue rounded-full flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{t('flights.moreFlexibility')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t('flights.moreFlexibilityDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* List vé mẫu... */}
        {results.length > 0 && (
          <div className="section-container mt-6 pb-12">
            <h2 className="text-2xl font-bold mb-4">{t('flights.searchResults')}</h2>
            <div className="flex flex-col gap-4">
              {results.map((flight) => {
                const isRound = tripType === 'roundtrip';
                const retPrice = flight.returnFlight ? flight.returnFlight.price : 0;
                
                const ecoTotal = isRound ? (flight.price + retPrice + 200000) : flight.price;
                const bizTotal = isRound ? ((flight.price * 2.5) + (retPrice * 2.5) + 200000) : (flight.price * 2.5);

                const tripLabelEco = (isRound ? ' (Khứ hồi)' : ' (Một chiều)') + ' - Phổ thông';
                const tripLabelBiz = (isRound ? ' (Khứ hồi)' : ' (Một chiều)') + ' - Thương gia';

                return (
                <div key={flight.id} className="result-card flex flex-col md:flex-row gap-6 justify-between items-center p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow">
                  {/* Cột 1: Thông tin hãng bay */}
                  <div className="flex flex-col w-full md:w-1/4 shrink-0">
                    <span className="font-bold text-xl text-booking-blue truncate">{flight.airline}</span>
                    <span className="text-sm text-gray-500 mt-1">{t('flights.flightNumber')}: {flight.flightNumber}</span>
                  </div>
                  
                  {/* Cột 2: Thời gian bay - Giữa */}
                  <div className="flex items-center justify-center gap-4 md:gap-8 w-full flex-1 text-center">
                    <div className="flex flex-col">
                      <div className="text-2xl font-extrabold text-gray-900">{dayjs(flight.departureTime).format('HH:mm')}</div>
                      <div className="text-gray-500 font-medium">{flight.departureAirport?.code}</div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center w-full max-w-[120px]">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold text-center">Bay thẳng</span>
                      <div className="w-16 md:w-full border-b-2 border-gray-300 relative flex items-center justify-center mb-5">
                          <i className="fa-solid fa-plane absolute bg-white px-1 text-gray-400 text-sm"></i>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-2xl font-extrabold text-gray-900">{dayjs(flight.arrivalTime).format('HH:mm')}</div>
                      <div className="text-gray-500 font-medium">{flight.arrivalAirport?.code}</div>
                    </div>
                  </div>

                  {/* Cột 3: Giá và Nút bấm */}
                  <div className="flex flex-col items-center md:items-end w-full md:w-auto shrink-0">
                    <span className="text-sm text-gray-500 mb-1">Từ</span>
                    <span className="text-2xl font-extrabold text-red-600 mb-3 whitespace-nowrap">{ecoTotal.toLocaleString('vi-VN')} VND</span>
                    <DetailOverlay 
                      trigger={<Button variant="contained" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }}>{t('flights.selectFlight')}</Button>}
                      title={`${t('flights.flightDetails')} ${flight.flightNumber}`}
                      description={`${t('flights.journeyFrom')} ${flight.departureAirport?.city} ${t('flights.journeyTo')} ${flight.arrivalAirport?.city}`}
                      content={
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
                             <span className="font-bold text-booking-blue">{flight.airline} {isRound ? '(Khứ hồi)' : '(Một chiều)'}</span>
                            <span className="text-sm font-medium">#{flight.flightNumber}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="border-l-2 border-blue-200 pl-3">
                              <p className="text-xs text-gray-400">{t('flights.departure')}</p>
                              <p className="font-bold text-lg">{dayjs(flight.departureTime).format('HH:mm')}</p>
                              <p className="text-sm">{flight.departureAirport?.name} ({flight.departureAirport?.code})</p>
                              <p className="text-xs text-gray-500">{dayjs(flight.departureTime).format('DD/MM/YYYY')}</p>
                            </div>
                            <div className="border-l-2 border-green-200 pl-3">
                              <p className="text-xs text-gray-400">{t('flights.arrival')}</p>
                              <p className="font-bold text-lg">{dayjs(flight.arrivalTime).format('HH:mm')}</p>
                              <p className="text-sm">{flight.arrivalAirport?.name} ({flight.arrivalAirport?.code})</p>
                              <p className="text-xs text-gray-500">{dayjs(flight.arrivalTime).format('DD/MM/YYYY')}</p>
                            </div>
                          </div>
                          {flight.returnFlight && (
                            <div className="mt-4 border-t pt-4">
                              <p className="font-bold text-booking-blue mb-2">Chuyến về: {flight.returnFlight.airline} #{flight.returnFlight.flightNumber}</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border-l-2 border-blue-200 pl-3">
                                  <p className="text-xs text-gray-400">{t('flights.departure')}</p>
                                  <p className="font-bold text-lg">{dayjs(flight.returnFlight.departureTime).format('HH:mm')}</p>
                                  <p className="text-sm">{flight.returnFlight.departureAirport?.code}</p>
                                </div>
                                <div className="border-l-2 border-green-200 pl-3">
                                  <p className="text-xs text-gray-400">{t('flights.arrival')}</p>
                                  <p className="font-bold text-lg">{dayjs(flight.returnFlight.arrivalTime).format('HH:mm')}</p>
                                  <p className="text-sm">{flight.returnFlight.arrivalAirport?.code}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <p className="font-semibold mb-1">{t('flights.baggagePolicy')}</p>
                            <ul className="list-disc list-inside text-gray-600">
                              <li>{t('flights.carryOn')}</li>
                              <li>{t('flights.checkedBag')}</li>
                              <li>{t('flights.meal')}</li>
                              <li>{t('flights.wifi')}</li>
                            </ul>
                          </div>
                        </div>
                      }
                      footer={
                        <div className="flex flex-col gap-3 w-full">
                          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex flex-col items-center md:items-start mb-2 md:mb-0">
                              <p className="font-bold text-lg text-gray-800">Hạng Phổ thông</p>
                              <p className="text-sm text-gray-500">Balo + 7kg xách tay</p>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <span className="text-xl font-bold text-red-600">{ecoTotal.toLocaleString('vi-VN')} đ</span>
                              <Button 
                                variant="contained" 
                                sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }} 
                                onClick={() => navigate(`/checkout?type=flight&name=${encodeURIComponent(flight.airline + ' ' + flight.flightNumber + tripLabelEco)}&price=${ecoTotal}&details=${encodeURIComponent(JSON.stringify({ [t('flights.departure')]: flight.departureAirport?.city + ' (' + flight.departureAirport?.code + ')', [t('flights.arrival')]: flight.arrivalAirport?.city + ' (' + flight.arrivalAirport?.code + ')' }))}`)}
                              >CHỌN</Button>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="flex flex-col items-center md:items-start mb-2 md:mb-0">
                              <p className="font-bold text-lg text-blue-800">Hạng Thương gia</p>
                              <p className="text-sm text-blue-600">32kg ký gửi + Phòng chờ Business</p>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <span className="text-xl font-bold text-red-600">{bizTotal.toLocaleString('vi-VN')} đ</span>
                              <Button 
                                variant="contained" 
                                sx={{ backgroundColor: '#003b95', fontWeight: 'bold' }} 
                                onClick={() => navigate(`/checkout?type=flight&name=${encodeURIComponent(flight.airline + ' ' + flight.flightNumber + tripLabelBiz)}&price=${bizTotal}&details=${encodeURIComponent(JSON.stringify({ [t('flights.departure')]: flight.departureAirport?.city + ' (' + flight.departureAirport?.code + ')', [t('flights.arrival')]: flight.arrivalAirport?.city + ' (' + flight.arrivalAirport?.code + ')' }))}`)}
                              >CHỌN</Button>
                            </div>
                          </div>
                        </div>
                      }
                    />
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