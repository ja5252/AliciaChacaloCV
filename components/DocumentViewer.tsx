import React, { useState, useEffect } from 'react';
import { DocumentMetadata, Language } from '../types';
import { Icons } from './Icon';
import { translateText } from '../services/geminiService';

interface DocumentViewerProps {
  document: DocumentMetadata;
  language: Language;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, language, onClose }) => {
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  const isEn = language === Language.EN;

  // Reset state when document changes
  useEffect(() => {
    setTranslatedContent(null);
    setTranslatedDesc(null);
    setShowOriginal(true);
  }, [document]);

  const handleTranslate = async () => {
    if (translatedContent && translatedDesc) {
      setShowOriginal(!showOriginal);
      return;
    }

    setIsTranslating(true);
    // Determine target language based on current UI language. 
    // If UI is English, we translate content to English.
    const targetLang = language; 

    try {
      const [newContent, newDesc] = await Promise.all([
        translateText(document.content, targetLang),
        translateText(document.description, targetLang)
      ]);
      
      setTranslatedContent(newContent);
      setTranslatedDesc(newDesc);
      setShowOriginal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  const displayDesc = showOriginal ? document.description : translatedDesc;
  const displayContent = showOriginal ? document.content : translatedContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in">
        
        {/* Left: Image Preview */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gray-100 flex items-center justify-center p-8 border-r border-gray-200">
           <img 
             src={document.thumbnailUrl} 
             alt={document.title} 
             className="max-w-full max-h-full object-contain shadow-lg border border-gray-200"
           />
        </div>

        {/* Right: Metadata & Actions */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 text-sm text-brand-600 font-medium mb-2">
                 <span className="px-2 py-0.5 bg-brand-50 rounded-full">{document.category}</span>
                 <span>•</span>
                 <span>{document.year}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-800 leading-tight">
                {document.title}
              </h2>
              {document.originalTitle && (
                <p className="text-sm text-gray-400 mt-1 italic">{document.originalTitle}</p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icons.X className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Description Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                {isEn ? 'Description' : 'Descripción'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {displayDesc}
              </p>
            </div>

            {/* Content/OCR Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
               <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Icons.FileText size={16} />
                  {isEn ? 'Document Content (OCR)' : 'Contenido (OCR)'}
                </h3>
               </div>
               <p className="font-mono text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                 {displayContent}
               </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {document.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm
                ${isTranslating 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : showOriginal 
                    ? 'bg-white border border-gray-300 text-slate-700 hover:bg-gray-50'
                    : 'bg-brand-500 text-white hover:bg-brand-600'
                }
              `}
            >
              {isTranslating ? (
                <Icons.Sparkles size={18} className="animate-spin" />
              ) : (
                <Icons.Globe size={18} />
              )}
              {isTranslating 
                ? (isEn ? 'Translating...' : 'Traduciendo...') 
                : showOriginal 
                  ? (isEn ? 'Translate to English' : 'Traducir a Español')
                  : (isEn ? 'Show Original' : 'Ver Original')
              }
            </button>

            <button className="flex items-center gap-2 text-brand-600 hover:text-brand-800 font-medium text-sm">
              <Icons.Download size={18} />
              {isEn ? 'Download' : 'Descargar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
