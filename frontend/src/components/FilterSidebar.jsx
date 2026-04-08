import React from 'react';
import { useTranslation } from 'react-i18next';

const FilterSidebar = ({ filters, onFilterChange }) => {
    const { t } = useTranslation();

    const handleRatingChange = (val) => {
        const newRating = filters.rating.includes(val)
            ? filters.rating.filter(r => r !== val)
            : [...filters.rating, val];
        onFilterChange({ ...filters, rating: newRating });
    };

    const handleTypeChange = (val) => {
        const newType = filters.type.includes(val)
            ? filters.type.filter(t => t !== val)
            : [...filters.type, val];
        onFilterChange({ ...filters, type: newType });
    };

    return (
        <aside className="w-[280px] shrink-0 font-sans hidden md:block">
            {/* 1. Phần Bản đồ */}
            <div className="relative h-[140px] mb-4 rounded-md overflow-hidden border border-gray-300 shadow-sm">
                <img 
                    src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=300" 
                    alt="Map" 
                    className="w-full h-full object-cover opacity-70"
                />
                <button className="absolute inset-0 m-auto w-fit h-fit bg-[#006ce4] text-white px-4 py-2 rounded shadow-lg text-sm font-bold hover:bg-[#003b95] transition">
                    {t('filterSidebar.showOnMap')}
                </button>
            </div>

            {/* 2. Khung các bộ lọc */}
            <div className="border border-gray-200 rounded-md">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <h2 className="font-bold text-sm text-gray-900">{t('filterSidebar.filterBy')}</h2>
                    {(filters.rating.length > 0 || filters.type.length > 0) && (
                        <button onClick={() => onFilterChange({ rating: [], type: [] })} className="text-xs text-[#006ce4] font-semibold hover:underline">Xóa tất cả</button>
                    )}
                </div>

                {/* Nhóm: Điểm đánh giá */}
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-bold mb-3">{t('filterSidebar.guestRating')}</h3>
                    <div className="space-y-2">
                        {[
                            { label: t('filterSidebar.superb'), val: 'superb', count: 803 },
                            { label: t('filterSidebar.veryGood'), val: 'veryGood', count: 1882 },
                            { label: t('filterSidebar.good'), val: 'good', count: 2612 }
                        ].map((item, i) => (
                            <label key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        checked={filters.rating.includes(item.val)}
                                        onChange={() => handleRatingChange(item.val)}
                                        className="w-5 h-5 border-gray-300 rounded accent-[#006ce4] cursor-pointer" 
                                    />
                                    <span className="text-sm text-gray-700 group-hover:underline">{item.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{item.count}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Nhóm: Loại chỗ ở */}
                <div className="p-4">
                    <h3 className="text-sm font-bold mb-3">{t('filterSidebar.propertyType')}</h3>
                    <div className="space-y-2">
                        {[
                            { label: t('filterSidebar.apartment'), val: 'apartment' }, 
                            { label: t('filterSidebar.hotel'), val: 'hotel' }, 
                            { label: t('filterSidebar.villa'), val: 'villa' }, 
                            { label: t('filterSidebar.resort'), val: 'resort' }
                        ].map((item, i) => (
                            <label key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        checked={filters.type.includes(item.val)}
                                        onChange={() => handleTypeChange(item.val)}
                                        className="w-5 h-5 border-gray-300 rounded accent-[#006ce4] cursor-pointer" 
                                    />
                                    <span className="text-sm text-gray-700 group-hover:underline">{item.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{150 + i * 45}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;