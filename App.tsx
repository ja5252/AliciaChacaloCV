import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_DOCUMENTS } from './constants';
import { DocumentMetadata, FilterState, Language } from './types';
import Sidebar from './components/Sidebar';
import DocumentViewer from './components/DocumentViewer';
import { Icons } from './components/Icon';
import { semanticSearch } from './services/geminiService';

function App() {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMetadata | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    year: null,
    tag: null
  });

  // State for AI search results (list of IDs)
  const [aiMatchIds, setAiMatchIds] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const isEn = language === Language.EN;

  // Handle Search Execution
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setAiMatchIds(null);
      return;
    }
    
    setIsSearching(true);
    // Call Gemini API
    const matches = await semanticSearch(searchQuery, MOCK_DOCUMENTS);
    setAiMatchIds(matches);
    setIsSearching(false);
  };

  // Filter & Sort Logic
  const filteredDocuments = useMemo(() => {
    let docs = [...MOCK_DOCUMENTS];

    // 1. AI Search Matches (Filter & Sort by Relevance/Order)
    if (aiMatchIds !== null) {
      // Filter to only matches
      docs = docs.filter(doc => aiMatchIds.includes(doc.id));
      // Sort by the order they appeared in aiMatchIds (Relevance)
      docs.sort((a, b) => {
        return aiMatchIds.indexOf(a.id) - aiMatchIds.indexOf(b.id);
      });
    }

    // 2. Sidebar Filters
    if (filters.category) {
      docs = docs.filter(doc => doc.category === filters.category);
    }
    if (filters.year) {
      docs = docs.filter(doc => doc.year === filters.year);
    }
    if (filters.tag) {
      docs = docs.filter(doc => doc.tags.includes(filters.tag!));
    }

    return docs;
  }, [filters, aiMatchIds]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- Header --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Icons.Menu size={24} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-brand-900 rounded-full flex items-center justify-center text-white font-serif font-bold shadow-sm">
                A
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-serif font-bold text-slate-900 leading-none">Alicia Chacalo Hilú</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Digital Archive</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4">
             <form onSubmit={handleSearch} className="relative group">
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={isEn ? "AI Search: 'Show me projects from 2008'..." : "Búsqueda IA: 'Proyectos del 2008'..."}
                 className="w-full pl-10 pr-12 py-2.5 bg-gray-100 border-transparent border focus:border-brand-300 rounded-full text-sm focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all shadow-sm"
               />
               <Icons.Search className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
               {searchQuery && (
                  <button type="submit" className="absolute right-2 top-2 p-1 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors shadow-sm">
                    {isSearching ? <Icons.Sparkles size={16} className="animate-spin" /> : <Icons.ChevronLeft size={16} className="rotate-180" />}
                  </button>
               )}
             </form>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-4 w-[1px] bg-gray-200 hidden sm:block"></div>
            <button 
              onClick={() => setLanguage(language === Language.EN ? Language.ES : Language.EN)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-slate-600"
            >
              <Icons.Globe size={14} />
              {language === Language.EN ? 'English' : 'Español'}
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Layout --- */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar 
          filters={filters} 
          setFilters={setFilters} 
          language={language}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Active Filters Display */}
          {(filters.category || filters.year || filters.tag || aiMatchIds) && (
             <div className="mb-6 flex flex-wrap gap-2 items-center animate-fade-in">
                <span className="text-sm text-gray-500 mr-2 font-medium">
                  {isEn ? 'Active Filters:' : 'Filtros Activos:'}
                </span>
                
                {aiMatchIds && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 shadow-sm">
                    <Icons.Sparkles size={12} />
                    "{searchQuery}"
                    <button onClick={() => { setAiMatchIds(null); setSearchQuery(''); }} className="ml-1 hover:text-purple-900 hover:bg-purple-200 rounded-full p-0.5 transition-colors"><Icons.X size={12}/></button>
                  </span>
                )}
                
                {filters.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 shadow-sm">
                    {filters.category}
                    <button onClick={() => setFilters(prev => ({...prev, category: null}))} className="ml-1 hover:text-blue-900 hover:bg-blue-200 rounded-full p-0.5 transition-colors"><Icons.X size={12}/></button>
                  </span>
                )}
                
                {filters.tag && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 shadow-sm">
                    #{filters.tag}
                    <button onClick={() => setFilters(prev => ({...prev, tag: null}))} className="ml-1 hover:text-emerald-900 hover:bg-emerald-200 rounded-full p-0.5 transition-colors"><Icons.X size={12}/></button>
                  </span>
                )}

                {filters.year && (
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200 shadow-sm">
                   {filters.year}
                   <button onClick={() => setFilters(prev => ({...prev, year: null}))} className="ml-1 hover:text-orange-900 hover:bg-orange-200 rounded-full p-0.5 transition-colors"><Icons.X size={12}/></button>
                 </span>
                )}
                
                <button 
                  onClick={() => { setFilters({category: null, year: null, tag: null}); setAiMatchIds(null); setSearchQuery(''); }}
                  className="text-xs text-gray-400 hover:text-gray-700 hover:underline ml-2 transition-colors"
                >
                  {isEn ? 'Clear all' : 'Limpiar todo'}
                </button>
             </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map(doc => (
              <article 
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <img 
                    src={doc.thumbnailUrl} 
                    alt={doc.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-gray-700 shadow-sm uppercase tracking-wider">
                    {doc.type}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      {doc.year}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-brand-700 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {doc.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-gray-50">
                    {doc.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
                        #{tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="text-[10px] text-gray-400 px-1 py-0.5">+{doc.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 animate-bounce-slow">
                <Icons.Search className="text-gray-400" size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-800">
                {isEn ? 'No documents found' : 'No se encontraron documentos'}
              </h3>
              <p className="text-gray-500 mt-2 text-sm max-w-xs text-center">
                {isEn ? 'Try adjusting your search or filters.' : 'Intenta ajustar tu búsqueda o filtros.'}
              </p>
              <button 
                onClick={() => { setFilters({category: null, year: null, tag: null}); setAiMatchIds(null); setSearchQuery(''); }}
                className="mt-6 px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
              >
                {isEn ? 'Clear all filters' : 'Limpiar todos los filtros'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {selectedDoc && (
        <DocumentViewer 
          document={selectedDoc} 
          language={language} 
          onClose={() => setSelectedDoc(null)} 
        />
      )}
    </div>
  );
}

export default App;