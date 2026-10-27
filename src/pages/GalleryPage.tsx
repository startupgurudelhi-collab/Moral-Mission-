import React, { useState } from 'react';
import { SiteSettings, GalleryItem, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import {
  X,
  MapPin,
  Calendar,
  Maximize2,
} from 'lucide-react';

interface GalleryPageProps {
  settings: SiteSettings;
  gallery: GalleryItem[];
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  settings,
  gallery,
  onNavigate,
  onOpenDonate,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Education',
    'Healthcare',
    'Nutrition',
    'Environment',
    'Women Empowerment',
  ];

  const filtered = activeCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* 1. Dynamic Master Banner */}
      <MasterBanner
        config={settings.banners.gallery}
        currentPage="gallery"
        onNavigate={onNavigate}
        onOpenDonate={onOpenDonate}
      />

      {/* 2. Category Filter */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0f2850] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat === 'All' ? 'All Visuals' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Gallery Grid */}
      <section className="py-16 bg-slate-50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-64 bg-slate-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-3 left-3 bg-[#0f2850]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs">
                    {item.category}
                  </div>

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif font-bold text-base leading-snug drop-shadow-xs">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2 pt-2 border-t border-white/20">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{item.location}</span>
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 cursor-default"
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
                  {activeItem.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                  {activeItem.title}
                </h3>
              </div>
              <div className="text-xs text-slate-400 space-y-1 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeItem.location}</span>
                </div>
                <div>Documented on: {activeItem.date}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
