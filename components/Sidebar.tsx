import React, { useMemo } from 'react';
import { CATEGORIES, YEARS, MOCK_DOCUMENTS } from '../constants';
import { FilterState, Language } from '../types';
import { Icons } from './Icon';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, language, isOpen, onClose }) => {
  const isEn = language === Language.EN;

  // Extract unique tags for the Topics section
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_DOCUMENTS.forEach(doc => {
      doc.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-[calc(100vh-64px)] overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center md:hidden mb-6">
            <h2 className="font-serif text-xl font-bold text-slate-800">
              {isEn ? 'Filters' : 'Filtros'}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <Icons.X size={20} />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icons.Grid size={14} />
              {isEn ? 'By Section' : 'Por Sección'}
            </h3>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: cat === 'All' ? null : cat }))}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      (filters.category === cat) || (cat === 'All' && !filters.category)
                        ? 'bg-brand-50 text-brand-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics / Tags */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icons.Tag size={14} />
              {isEn ? 'By Topic' : 'Por Tema'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilters(prev => ({ ...prev, tag: prev.tag === tag ? null : tag }))}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    filters.tag === tag
                      ? 'bg-brand-100 text-brand-800 border-brand-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-200 hover:text-brand-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Years */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icons.Calendar size={14} />
              {isEn ? 'By Year' : 'Por Año'}
            </h3>
            <div className="grid grid-cols-4 gap-1">
              <button
                 onClick={() => setFilters(prev => ({ ...prev, year: null }))}
                 className={`col-span-1 px-1 py-1 text-[10px] font-medium rounded border ${
                   !filters.year 
                   ? 'bg-slate-800 text-white border-slate-800' 
                   : 'border-gray-200 text-gray-500 hover:border-gray-300'
                 }`}
              >
                All
              </button>
              {YEARS.slice(0, 15).map(year => (
                <button
                  key={year}
                  onClick={() => setFilters(prev => ({ ...prev, year: year === filters.year ? null : year }))}
                  className={`px-1 py-1 text-[10px] font-medium rounded border ${
                    filters.year === year
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mt-auto pt-6 border-t border-gray-100">
            <p>Archive ID: ACH-2025-v1</p>
            <p>{MOCK_DOCUMENTS.length} Documents Indexed</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;