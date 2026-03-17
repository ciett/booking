import React from 'react';
import { DatePicker, Input, ConfigProvider } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Attractions = () => {
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#003b95' } }}>
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
        
        {/* Banner */}
        <div className="w-full bg-[#003b95] text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">Địa điểm tham quan, hoạt động và trải nghiệm</h1>
            <p className="text-xl opacity-90">Khám phá những điều tuyệt vời nhất tại điểm đến của bạn</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl w-full -mt-10 px-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 border rounded-lg p-2 flex items-center gap-2 bg-white">
              <i className="fa-solid fa-location-dot text-gray-400 ml-2"></i>
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Bạn muốn đi đâu?</span>
                <Input placeholder="Thành phố, điểm tham quan..." variant="borderless" className="w-full" />
              </div>
            </div>
            <div className="md:col-span-4 border rounded-lg p-2 bg-white">
              <span className="text-[10px] font-bold text-gray-500 uppercase px-3">Thời gian</span>
              <RangePicker disabledDate={disabledDate} variant="borderless" className="w-full" placeholder={['Từ ngày', 'Đến ngày']} />
            </div>
            <div className="md:col-span-3">
              <Button variant="contained" fullWidth sx={{ height: '100%', backgroundColor: '#006ce4', fontWeight: 'bold', textTransform: 'none', fontSize: '16px', borderRadius: '4px' }}>
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl w-full mt-16 px-4 mb-20">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Các điểm tham quan nổi bật tại Việt Nam</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            
            {/* Ảnh lớn 1 - Vịnh Hạ Long (Chiếm 3 cột) */}
            <div className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80" alt="Hạ Long" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-2xl flex items-center">Vịnh Hạ Long</h3>
                <p className="text-white text-sm opacity-90">Kỳ quan thiên nhiên thế giới</p>
              </div>
            </div>

            {/* Ảnh lớn 2 - Hội An (Chiếm 3 cột) */}
            <div className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80" alt="Hội An" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-2xl flex items-center">Phố Cổ Hội An</h3>
                <p className="text-white text-sm opacity-90">Di sản văn hóa UNESCO</p>
              </div>
            </div>

            {/* Các ảnh nhỏ ở hàng dưới (Mỗi cái chiếm 2 cột) */}
            <div className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1599708153386-62e200ec806f?w=800&q=80" alt="Huế" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-xl">Cố Đô Huế</h3>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80" alt="Phú Quốc" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-xl">Đảo Phú Quốc</h3>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 rounded-xl overflow-hidden relative cursor-pointer group h-64 shadow-md">
              <img src="https://images.unsplash.com/photo-1559592443-7f87a79f6527?w=800&q=80" alt="Đà Nẵng" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
                <h3 className="text-white font-bold text-xl">Đà Nẵng</h3>
              </div>
            </div>

          </div>
        </div>

        {/* Thông báo Footer */}
        <div className="max-w-6xl w-full mt-10 px-4 text-center pb-10">
            <p className="text-gray-400 italic">Nhập địa điểm để bắt đầu tìm kiếm các hoạt động thú vị.</p>
        </div>

      </div>
    </ConfigProvider>
  );
};

export default Attractions;