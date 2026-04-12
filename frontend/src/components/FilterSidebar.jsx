import React from 'react';
import { useTranslation } from 'react-i18next';

const CB = '#006ce4';

const FilterSidebar = ({ filters, onFilterChange }) => {
    const { t } = useTranslation();

    const handleRatingChange = (val) => {
        const next = filters.rating.includes(val)
            ? filters.rating.filter(r => r !== val)
            : [...filters.rating, val];
        onFilterChange({ ...filters, rating: next });
    };

    const handleTypeChange = (val) => {
        const next = filters.type.includes(val)
            ? filters.type.filter(x => x !== val)
            : [...filters.type, val];
        onFilterChange({ ...filters, type: next });
    };

    const hasFilters = filters.rating.length > 0 || filters.type.length > 0;

    const ratingOpts = [
        { label: t('filterSidebar.superb'),   val: 'superb',   score: '4.5+', color: CB },
        { label: t('filterSidebar.veryGood'), val: 'veryGood', score: '4.0+', color: '#10b981' },
        { label: t('filterSidebar.good'),     val: 'good',     score: '3.5+', color: '#f59e0b' },
    ];

    const typeOpts = [
        { label: t('filterSidebar.apartment'), val: 'apartment', icon: 'fa-building' },
        { label: t('filterSidebar.hotel'),     val: 'hotel',     icon: 'fa-hotel' },
        { label: t('filterSidebar.villa'),     val: 'villa',     icon: 'fa-house' },
        { label: t('filterSidebar.resort'),    val: 'resort',    icon: 'fa-umbrella-beach' },
    ];

    const Section = ({ title, children }) => (
        <div className="py-4" style={{ borderBottom: '1px solid rgba(91,97,110,0.12)' }}>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#0a0b0d' }}>{title}</h3>
            {children}
        </div>
    );

    return (
        <aside className="w-[260px] shrink-0 hidden md:block" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Map preview */}
            <div className="relative rounded-2xl overflow-hidden mb-4" style={{ height: 130 }}>
                <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=300"
                    alt="Map" className="w-full h-full object-cover" style={{ opacity: 0.6 }} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button className="font-bold text-white text-xs px-4 py-2.5 rounded-[56px] transition-all"
                        style={{ background: CB, backdropFilter: 'blur(8px)' }}
                        onMouseOver={e => e.currentTarget.style.background = '#578bfa'}
                        onMouseOut={e => e.currentTarget.style.background = CB}>
                        <i className="fa-solid fa-map mr-2"></i>{t('filterSidebar.showOnMap')}
                    </button>
                </div>
            </div>

            {/* Filter box */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(91,97,110,0.15)' }}>
                <div className="px-5 py-4 flex items-center justify-between"
                    style={{ borderBottom: '1px solid rgba(91,97,110,0.12)' }}>
                    <h2 className="font-black text-sm text-[#0a0b0d]">{t('filterSidebar.filterBy')}</h2>
                    {hasFilters && (
                        <button onClick={() => onFilterChange({ rating: [], type: [] })}
                            className="text-xs font-bold transition-colors"
                            style={{ color: CB }}
                            onMouseOver={e => e.currentTarget.style.color = '#578bfa'}
                            onMouseOut={e => e.currentTarget.style.color = CB}>
                            Xóa tất cả
                        </button>
                    )}
                </div>

                <div className="px-5">
                    {/* Rating */}
                    <Section title={t('filterSidebar.guestRating')}>
                        <div className="space-y-2">
                            {ratingOpts.map(item => {
                                const checked = filters.rating.includes(item.val);
                                return (
                                    <label key={item.val}
                                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all"
                                        style={{ background: checked ? item.color + '10' : 'transparent' }}
                                        onMouseOver={e => { if (!checked) e.currentTarget.style.background = '#f7f8fa'; }}
                                        onMouseOut={e => { if (!checked) e.currentTarget.style.background = 'transparent'; }}>
                                        <div className="w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-all"
                                            style={{
                                                background: checked ? item.color : 'transparent',
                                                border: `2px solid ${checked ? item.color : 'rgba(91,97,110,0.3)'}`
                                            }}>
                                            {checked && <i className="fa-solid fa-check text-white" style={{ fontSize: 8 }}></i>}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={checked}
                                            onChange={() => handleRatingChange(item.val)} />
                                        <span className="text-sm font-semibold flex-1" style={{ color: checked ? item.color : '#374151' }}>{item.label}</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: item.color + '15', color: item.color }}>{item.score}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </Section>

                    {/* Property type */}
                    <Section title={t('filterSidebar.propertyType')}>
                        <div className="space-y-2 pb-2">
                            {typeOpts.map(item => {
                                const checked = filters.type.includes(item.val);
                                return (
                                    <label key={item.val}
                                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all"
                                        style={{ background: checked ? CB + '10' : 'transparent' }}
                                        onMouseOver={e => { if (!checked) e.currentTarget.style.background = '#f7f8fa'; }}
                                        onMouseOut={e => { if (!checked) e.currentTarget.style.background = 'transparent'; }}>
                                        <div className="w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-all"
                                            style={{
                                                background: checked ? CB : 'transparent',
                                                border: `2px solid ${checked ? CB : 'rgba(91,97,110,0.3)'}`
                                            }}>
                                            {checked && <i className="fa-solid fa-check text-white" style={{ fontSize: 8 }}></i>}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={checked}
                                            onChange={() => handleTypeChange(item.val)} />
                                        <i className={`fa-solid ${item.icon} text-xs shrink-0`} style={{ color: checked ? CB : '#9ca3af' }}></i>
                                        <span className="text-sm font-semibold" style={{ color: checked ? CB : '#374151' }}>{item.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </Section>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;