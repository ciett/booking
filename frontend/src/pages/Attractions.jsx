import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Input, ConfigProvider, AutoComplete, message } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DetailOverlay from '../components/DetailOverlay';
import { useConfig } from '../context/ConfigContext';

const { RangePicker } = DatePicker;

const Attractions = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getImage } = useConfig();
    const [city, setCity] = useState('');
    const [dates, setDates] = useState(null);

    const disabledDate = (current) => current && current < dayjs().startOf('day');

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

    // Helper to get a category icon
    const getCategoryIcon = (category) => {
        if (!category) return 'fa-solid fa-star';
        const cat = category.toLowerCase();
        if (cat.includes('thiên nhiên') || cat.includes('nature')) return 'fa-solid fa-mountain-sun';
        if (cat.includes('văn hóa') || cat.includes('culture') || cat.includes('lịch sử') || cat.includes('history')) return 'fa-solid fa-landmark';
        if (cat.includes('giải trí') || cat.includes('entertainment') || cat.includes('vui chơi')) return 'fa-solid fa-masks-theater';
        if (cat.includes('ẩm thực') || cat.includes('food')) return 'fa-solid fa-utensils';
        if (cat.includes('biển') || cat.includes('beach')) return 'fa-solid fa-umbrella-beach';
        if (cat.includes('mua sắm') || cat.includes('shopping')) return 'fa-solid fa-bag-shopping';
        return 'fa-solid fa-location-dot';
    };

    // Helper to get category color
    const getCategoryColor = (category) => {
        if (!category) return { bg: 'bg-blue-50', text: 'text-blue-700' };
        const cat = category.toLowerCase();
        if (cat.includes('thiên nhiên') || cat.includes('nature')) return { bg: 'bg-green-50', text: 'text-green-700' };
        if (cat.includes('văn hóa') || cat.includes('culture') || cat.includes('lịch sử')) return { bg: 'bg-amber-50', text: 'text-amber-700' };
        if (cat.includes('giải trí') || cat.includes('entertainment')) return { bg: 'bg-purple-50', text: 'text-purple-700' };
        if (cat.includes('ẩm thực') || cat.includes('food')) return { bg: 'bg-orange-50', text: 'text-orange-700' };
        if (cat.includes('biển') || cat.includes('beach')) return { bg: 'bg-cyan-50', text: 'text-cyan-700' };
        return { bg: 'bg-blue-50', text: 'text-blue-700' };
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
            backgroundImage: getImage('img.attractions.hero') ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${getImage('img.attractions.hero')})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">{t('attractions.heroTitle')}</h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-sm">{t('attractions.heroSubtitle')}</p>
            </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 w-full relative z-20 -mt-12">
          <div className="bg-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden p-4 shadow-inner grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Địa điểm */}
            <div className="md:col-span-5 border rounded-lg p-2 flex items-center gap-2 bg-white">
              <i className="fa-solid fa-location-dot text-gray-400 ml-2"></i>
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-bold text-gray-400 uppercase line-clamp-1">{t('attractions.destination')}</span>
                <AutoComplete
                  options={cities.map(city => ({ value: city }))}
                  filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  placeholder={t('attractions.destPlaceholder')}
                  variant="borderless"
                  className="w-full text-sm"
                  value={city}
                  onChange={(val) => setCity(val)}
                  onSelect={(val) => {
                      setCity(val);
                      handleSearch(val);
                  }}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                          handleSearch();
                      }
                  }}
                />
              </div>
            </div>
            <div className="md:col-span-4 border rounded-lg p-2 bg-white">
              <span className="text-[10px] font-bold text-gray-400 uppercase px-3 line-clamp-1">{t('attractions.dateRange')}</span>
              <RangePicker
                disabledDate={disabledDate}
                variant="borderless"
                className="w-full text-sm"
                placeholder={[t('attractions.dateStart'), t('attractions.dateEnd')]}
              />
            </div>
            <div className="md:col-span-3">
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  height: '100%',
                  backgroundColor: '#006ce4',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '16px',
                  borderRadius: '4px'
                }}
              >
                {loading ? t('attractions.searching') : t('attractions.search')}
              </Button>
            </div>
            </div>
          </div>
        </div>

                {/* Search Results Section */}
                {searched && (
                    <div className="section-container mt-8 mb-8 w-full max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">
                            {loading 
                                ? (t('attractions.searching') || 'Đang tìm kiếm...') 
                                : `${city}: ${t('attractions.foundResults', { count: results.length }) || `tìm thấy ${results.length} hoạt động`}`
                            }
                        </h2>
                        
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                                <i className="fa-solid fa-magnifying-glass text-5xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500 text-lg">{t('attractions.noResults') || `Không tìm thấy hoạt động nào tại ${city}.`}</p>
                                <p className="text-gray-400 text-sm mt-2">{t('attractions.tryOtherCity') || 'Hãy thử tìm kiếm thành phố khác.'}</p>
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

                {/* Danh sách địa điểm phổ biến - Ẩn khi có kết quả tìm kiếm */}
                {!searched && (
                    <>
                    <div className="section-container mt-16 mb-20">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('attractions.popularAttractions')}</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            
                            {/* Vịnh Hạ Long */}
                            <div 
                                onClick={() => handleSearch('Hạ Long')}
                                className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                            >
                                <img src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800" alt="Hạ Long" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 p-4 text-white">
                                    <h3 className="font-bold text-2xl">{t('attractions.halong')}</h3>
                                    <p className="text-sm opacity-90">{t('attractions.halongDesc')}</p>
                                </div>
                            </div>

                            {/* Hội An */}
                            <div 
                                onClick={() => handleSearch('Hội An')}
                                className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                            >
                                <img src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800" alt="Hội An" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 p-4 text-white">
                                    <h3 className="font-bold text-2xl">{t('attractions.hoian')}</h3>
                                    <p className="text-sm opacity-90">{t('attractions.hoianDesc')}</p>
                                </div>
                            </div>

                            {/* Cố Đô Huế */}
                            <div 
                                onClick={() => handleSearch('Huế')}
                                className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                            >
                                <img src="https://images.unsplash.com/photo-1599708153386-62e200ec806f?w=800" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Huế" />
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 p-4 text-white">
                                    <h3 className="font-bold text-xl">{t('attractions.hue')}</h3>
                                </div>
                            </div>

                            {/* Phú Quốc */}
                            <div 
                                onClick={() => handleSearch('Phú Quốc')}
                                className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                            >
                                <img src="https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Phú Quốc" />
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 p-4 text-white">
                                    <h3 className="font-bold text-xl">{t('attractions.phuquoc')}</h3>
                                </div>
                            </div>

                            {/* Đà Nẵng */}
                            <div 
                                onClick={() => handleSearch('Đà Nẵng')}
                                className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md"
                            >
                                <img src="https://images.unsplash.com/photo-1559592443-7f87a79f6527?w=800" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Đà Nẵng" />
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 p-4 text-white">
                                    <h3 className="font-bold text-xl">{t('attractions.danang')}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section-container text-center pb-20">
                        <p className="text-gray-400 italic">{t('attractions.instruction')}</p>
                    </div>
                    </>
                )}
            </div>
        </ConfigProvider>
    );
};

const AttractionCard = ({ attraction, t, navigate }) => {
    // Helper to get a category icon
    const getCategoryIcon = (category) => {
        if (!category) return 'fa-solid fa-star';
        const cat = category.toLowerCase();
        if (cat.includes('thiên nhiên') || cat.includes('nature')) return 'fa-solid fa-mountain-sun';
        if (cat.includes('văn hóa') || cat.includes('culture') || cat.includes('lịch sử') || cat.includes('history')) return 'fa-solid fa-landmark';
        if (cat.includes('giải trí') || cat.includes('entertainment') || cat.includes('vui chơi')) return 'fa-solid fa-masks-theater';
        if (cat.includes('ẩm thực') || cat.includes('food')) return 'fa-solid fa-utensils';
        if (cat.includes('biển') || cat.includes('beach')) return 'fa-solid fa-umbrella-beach';
        if (cat.includes('mua sắm') || cat.includes('shopping')) return 'fa-solid fa-bag-shopping';
        return 'fa-solid fa-location-dot';
    };

    // Helper to get category color
    const getCategoryColor = (category) => {
        if (!category) return { bg: 'bg-blue-50', text: 'text-blue-700' };
        const cat = category.toLowerCase();
        if (cat.includes('thiên nhiên') || cat.includes('nature')) return { bg: 'bg-green-50', text: 'text-green-700' };
        if (cat.includes('văn hóa') || cat.includes('culture') || cat.includes('lịch sử')) return { bg: 'bg-amber-50', text: 'text-amber-700' };
        if (cat.includes('giải trí') || cat.includes('entertainment')) return { bg: 'bg-purple-50', text: 'text-purple-700' };
        if (cat.includes('ẩm thực') || cat.includes('food')) return { bg: 'bg-orange-50', text: 'text-orange-700' };
        if (cat.includes('biển') || cat.includes('beach')) return { bg: 'bg-cyan-50', text: 'text-cyan-700' };
        return { bg: 'bg-blue-50', text: 'text-blue-700' };
    };

    const catColor = getCategoryColor(attraction.category);
    const disabledDate = (current) => current && current < dayjs().startOf('day');

    const [visitDate, setVisitDate] = useState(dayjs().add(1, 'day'));
    const [tickets, setTickets] = useState(1);
    
    const basePrice = attraction.price || 0;
    const totalPrice = basePrice * tickets;

    const handleBook = () => {
        if (!visitDate) {
            message.warning("Vui lòng chọn ngày tham quan");
            return;
        }
        navigate(`/checkout?type=attraction&name=${encodeURIComponent(attraction.name)}&price=${totalPrice}&details=${encodeURIComponent(JSON.stringify({ 
            [t('attractions.destination')]: attraction.city, 
            ...(attraction.category ? { 'Danh mục': attraction.category } : {}),
            'Ngày tham quan': visitDate.format('DD/MM/YYYY'),
            'Số lượng vé': tickets
        }))}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={attraction.imageUrl || `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500`} 
                    alt={attraction.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500';
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                {/* Category badge */}
                {attraction.category && (
                    <span className={`absolute top-3 left-3 ${catColor.bg} ${catColor.text} text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm`}>
                        <i className={`${getCategoryIcon(attraction.category)} mr-1`}></i>
                        {attraction.category}
                    </span>
                )}
                {/* Rating badge */}
                {attraction.rating && (
                    <div className="absolute top-3 right-3 bg-[#003580] text-white px-2 py-1 rounded-md text-sm font-bold shadow-md">
                        {parseFloat(attraction.rating).toFixed(1)}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-[#006ce4] transition-colors">
                        {attraction.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-[#006ce4]"></i>
                        {attraction.city}
                    </p>
                    {attraction.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{attraction.description}</p>
                    )}
                </div>

                <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400">{t('attractions.priceFrom') || 'Giá vé từ'}</p>
                        <p className="text-xl font-bold text-gray-900">
                            {attraction.price ? `${Number(attraction.price).toLocaleString('vi-VN')} đ` : (t('attractions.contactPrice') || 'Liên hệ')}
                        </p>
                    </div>
                    <DetailOverlay
                        trigger={
                            <button className="bg-[#006ce4] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#003b95] transition-all duration-200 flex items-center gap-2 text-sm active:scale-95">
                                {t('attractions.viewDetails') || 'Xem chi tiết'} <i className="fa-solid fa-chevron-right text-xs"></i>
                            </button>
                        }
                        title={attraction.name}
                        description={`${attraction.city} ${attraction.category ? '• ' + attraction.category : ''}`}
                        content={
                            <div className="space-y-4">
                                {/* Image and Rating */}
                                <div className="rounded-lg overflow-hidden h-40">
                                    <img 
                                        src={attraction.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'}
                                        className="w-full h-full object-cover"
                                        alt={attraction.name}
                                    />
                                </div>
                                {/* Booking Inputs */}
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4 space-y-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-blue-900 mb-1">Ngày tham quan</label>
                                        <DatePicker 
                                            value={visitDate} 
                                            onChange={(date) => setVisitDate(date)} 
                                            disabledDate={disabledDate}
                                            className="w-full h-10 rounded-lg border-blue-200"
                                            format="DD/MM/YYYY"
                                            allowClear={false}
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                        <label className="text-sm font-bold text-blue-900">Số lượng vé</label>
                                        <div className="flex items-center gap-4 bg-white px-1 py-1 rounded-lg border border-blue-200">
                                            <button 
                                                onClick={() => setTickets(Math.max(1, tickets - 1))}
                                                className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
                                            >-</button>
                                            <span className="font-bold text-gray-800 w-4 text-center">{tickets}</span>
                                            <button 
                                                onClick={() => setTickets(tickets + 1)}
                                                className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 text-[#006ce4] flex items-center justify-center font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                                {/* Description */}
                                <div className="prose prose-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="font-bold text-gray-900 mb-1">{t('attractions.aboutAttraction') || 'Thông tin hoạt động:'}</p>
                                    <p>{attraction.description || (t('attractions.noDescription') || 'Chưa có mô tả chi tiết.')}</p>
                                </div>
                                {/* Info grid */}
                                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                        <i className="fa-solid fa-check"></i> {t('attractions.instantConfirmation') || 'Xác nhận tức thì'}
                                    </div>
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                        <i className="fa-solid fa-check"></i> {t('attractions.freeCancellation') || 'Miễn phí hủy'}
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                                        <i className="fa-solid fa-clock"></i> {t('attractions.flexibleSchedule') || 'Lịch trình linh hoạt'}
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                                        <i className="fa-solid fa-shield-halved"></i> {t('attractions.safePayment') || 'Thanh toán an toàn'}
                                    </div>
                                </div>
                            </div>
                        }
                        footer={
                            <div className="flex flex-col items-end">
                                <p className="text-xl font-bold text-gray-900 mb-2">
                                    Tổng: {totalPrice ? `${Number(totalPrice).toLocaleString('vi-VN')} đ` : (t('attractions.contactPrice') || 'Liên hệ')}
                                </p>
                                <button
                                    onClick={handleBook}
                                    className="bg-[#006ce4] text-white px-8 py-2.5 rounded-md font-bold hover:bg-[#003b95] transition"
                                >
                                    {t('attractions.bookNow') || 'Đặt ngay'}
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