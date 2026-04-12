import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Input, ConfigProvider, AutoComplete, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DetailOverlay from '../components/DetailOverlay';

const { RangePicker } = DatePicker;

// Constants cho bảng màu Booking.com
const NAVY = '#003580';
const CB = '#006ce4';

const Attractions = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [dates, setDates] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('/api/attractions/cities');
                setCities(response.data);
            } catch (error) {
                console.error("Error fetching attraction cities", error);
            }
        };
        fetchCities();
    }, []);

    const disabledDate = (current) => current && current < dayjs().startOf('day');

    const handleSearch = async (cityName) => {
        const searchCity = typeof cityName === 'string' ? cityName : city;
        if (!searchCity) {
            message.warning(t('common.pleaseSelectCity') || "Vui lòng nhập thành phố bạn muốn đến");
            return;
        }
        setLoading(true);
        setSearched(true);
        try {
            const response = await axios.get(`/api/attractions/search`, {
                params: { city: searchCity }
            });
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching attractions", error);
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
                            {t('attractions.heroTitle')}
                        </h1>
                        <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                            {t('attractions.heroSubtitle')}
                        </p>
                    </div>
                </div>

                {/* SEARCH BOX */}
                <div className="max-w-[1140px] mx-auto px-4 w-full relative z-20 -mt-8">
                  <div className="bg-white rounded-[24px] p-2 shadow-2xl border border-gray-100">
                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    
                    {/* Địa điểm */}
                    <div className="flex-[1.2] flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors first:rounded-l-[22px] min-w-0">
                      <i className="fa-solid fa-location-dot text-gray-300 text-lg ml-2 mr-1 shrink-0"></i>
                      <div className="flex flex-col w-full min-w-0">
                        <AutoComplete
                          options={cities.map(city => ({ value: city }))}
                          filterOption={(inputValue, option) =>
                              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                          placeholder={t('attractions.destPlaceholder') || 'Điểm tham quan'}
                          variant="borderless"
                          className="w-full font-bold text-gray-900 text-lg min-w-0"
                          value={city}
                          onChange={(val) => setCity(val)}
                          onSelect={(val) => setCity(val)}
                        />
                      </div>
                    </div>

                    {/* Lịch trình */}
                    <div className="flex-1 min-w-[250px] lg:min-w-0 flex items-center p-4 hover:bg-gray-50 transition-colors">
                      <i className="fa-regular fa-calendar text-gray-300 text-lg ml-3 mr-1 shrink-0"></i>
                      <ConfigProvider theme={{ token: { colorPrimary: CB, borderRadius: 12 } }}>
                        <RangePicker
                          disabledDate={disabledDate}
                          variant="borderless"
                          className="w-full font-bold text-lg min-w-0"
                          format="DD/MM/YYYY"
                          placeholder={[t('attractions.dateStart') || 'Ngày đi', t('attractions.dateEnd') || 'Ngày về']}
                          onChange={(d) => setDates(d)}
                          separator={<i className="fa-solid fa-arrow-right text-gray-300 text-xs shrink-0"></i>}
                        />
                      </ConfigProvider>
                    </div>

                    {/* CTA */}
                    <div className="shrink-0 p-2">
                      <button
                        onClick={() => handleSearch()}
                        disabled={loading}
                        className="h-full min-h-[56px] px-8 text-white font-black text-lg transition-all active:scale-95 flex items-center justify-center rounded-[18px] w-full"
                        style={{ background: CB }}
                        onMouseOver={e => !loading && (e.currentTarget.style.background = '#003b95')}
                        onMouseOut={e => !loading && (e.currentTarget.style.background = CB)}
                      >
                        {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <>{t('attractions.search') || 'Tìm kiếm'}</>}
                      </button>
                    </div>

                    </div>
                  </div>
                </div>

                {/* Results Section... */}
                {searched && (
                    <div className="max-w-6xl mx-auto px-4 mt-12 w-full">
                        <h2 className="text-2xl font-black mb-6 text-[#0a0b0d]">
                            {loading 
                                ? (t('attractions.searching') || 'Đang tìm kiếm...') 
                                : `${city}: ${t('attractions.foundResults', { count: results.length }) || `Tìm thấy ${results.length} hoạt động`}`
                            }
                        </h2>
                        
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006ce4]"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {results.map((attraction) => (
                                    <AttractionCard key={attraction.id} attraction={attraction} t={t} navigate={navigate} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Popular Places... */}
                {!searched && (
                    <div className="max-w-6xl mx-auto px-4 mt-20 w-full animate-fade-in-up">
                        <h2 className="text-3xl font-black mb-2 text-[#0a0b0d] text-center">{t('attractions.popularAttractions')}</h2>
                        <p className="text-gray-500 font-medium mb-10 text-center">Khám phá các hoạt động được yêu thích nhất từ du khách Việt Nam</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                            {[
                                { city: 'Hạ Long', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', size: 'col-span-3', title: t('attractions.halong') },
                                { city: 'Hội An', img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800', size: 'col-span-3', title: t('attractions.hoian') },
                                { city: 'Huế', img: 'https://images.unsplash.com/photo-1599708153386-62e200ec806f?w=800', size: 'col-span-2', title: t('attractions.hue') },
                                { city: 'Phú Quốc', img: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800', size: 'col-span-2', title: t('attractions.phuquoc') },
                                { city: 'Đà Nẵng', img: 'https://images.unsplash.com/photo-1559592443-7f87a79f6527?w=800', size: 'col-span-2', title: t('attractions.danang') }
                            ].map((place, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => handleSearch(place.city)}
                                    className={`${place.size} rounded-[32px] overflow-hidden relative cursor-pointer group h-64 shadow-sm hover:shadow-2xl transition-all duration-500`}
                                >
                                    <img src={place.img} alt={place.city} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                                        <h3 className="font-black text-2xl mb-1">{place.title}</h3>
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

const AttractionCard = ({ attraction, t, navigate }) => {
    const [visitDate, setVisitDate] = useState(dayjs().add(1, 'day'));
    const [tickets, setTickets] = useState(1);
    const basePrice = attraction.price || 0;
    const totalPrice = basePrice * tickets;

    const handleBook = () => {
        navigate(`/checkout?type=attraction&name=${encodeURIComponent(attraction.name)}&price=${totalPrice}&details=${encodeURIComponent(JSON.stringify({ 
            [t('attractions.destination')]: attraction.city, 
            'Ngày tham quan': visitDate.format('DD/MM/YYYY'),
            'Số lượng vé': tickets
        }))}`);
    };

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={attraction.imageUrl || `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500`} 
                    alt={attraction.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                
                {attraction.category && (
                    <span className="absolute top-4 left-4 bg-white text-[#006ce4] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm border border-blue-50">
                        {attraction.category}
                    </span>
                )}
                
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-sm font-black shadow-lg">
                    {parseFloat(attraction.rating || 4.5).toFixed(1)}
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-white text-sm font-bold flex items-center gap-1.5 drop-shadow-md">
                        <i className="fa-solid fa-location-dot text-blue-100"></i>
                        {attraction.city}
                    </p>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-black text-xl text-[#0a0b0d] mb-2 line-clamp-2 leading-tight group-hover:text-[#006ce4] transition-colors">
                        {attraction.name}
                    </h3>
                    <p className="text-[13px] text-gray-400 font-medium leading-relaxed line-clamp-2 mb-6 italic">
                        {attraction.description || 'Khám phá vẻ đẹp và những hoạt động thú vị tại địa điểm này cùng gói dịch vụ cao cấp.'}
                    </p>
                </div>

                <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-1">{t('attractions.priceFrom')}</p>
                        <p className="text-2xl font-black text-[#0a0b0d]">
                            {attraction.price ? `${Number(attraction.price).toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                        </p>
                    </div>
                    <DetailOverlay
                        trigger={
                            <button className="bg-[#006ce4] text-white px-8 py-3 rounded-xl font-black hover:bg-[#003b95] transition-all duration-200 text-sm active:scale-95 shadow-md">
                                {t('attractions.viewDetails')}
                            </button>
                        }
                        title={attraction.name}
                        description={attraction.city}
                        content={
                            <div className="space-y-4">
                                <div className="rounded-2xl overflow-hidden h-48 shadow-inner">
                                    <img src={attraction.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'} className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-4">
                                    <label className="text-[11px] font-black text-[#003580] uppercase tracking-widest">Chọn ngày & số lượng</label>
                                    <DatePicker value={visitDate} onChange={setVisitDate} className="w-full h-12 rounded-xl border-blue-100 font-bold" format="DD/MM/YYYY" allowClear={false} />
                                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm">
                                        <button onClick={() => setTickets(Math.max(1, tickets - 1))} className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 font-black">-</button>
                                        <span className="font-black text-lg text-[#0a0b0d] flex-1 text-center">{tickets} Vé</span>
                                        <button onClick={() => setTickets(tickets + 1)} className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 font-black text-blue-600">+</button>
                                    </div>
                                </div>
                            </div>
                        }
                        footer={
                            <div className="flex flex-col items-end w-full">
                                <div className="text-right mb-4">
                                    <p className="text-3xl font-black text-[#0a0b0d]">{totalPrice.toLocaleString('vi-VN')} đ</p>
                                </div>
                                <button onClick={handleBook} className="bg-[#006ce4] text-white w-full py-4 rounded-xl font-black hover:bg-[#003b95] transition shadow-lg text-lg uppercase tracking-tight">
                                    {t('attractions.bookNow')}
                                </button>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Attractions;