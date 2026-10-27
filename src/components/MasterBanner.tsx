import React from 'react';
import { MasterBannerConfig, ActivePage } from '../types';
import { ShieldCheck, HeartHandshake, ChevronRight } from 'lucide-react';

interface MasterBannerProps {
  config: MasterBannerConfig;
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const MasterBanner: React.FC<MasterBannerProps> = ({
  config,
  currentPage,
  onNavigate,
  onOpenDonate,
}) => {
  const isHome = currentPage === 'home';

  return (
    <section className="relative overflow-hidden bg-[#0a1b36] text-white">
      {/* Background Photography with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={config.bgImage || '/src/assets/images/hero_ngo_education_1792839133429.jpg'}
          alt={config.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-105 transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Navy & Green Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1b36]/95 via-[#0f2850]/85 to-[#064e3b]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b36] via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 flex flex-col justify-center">
        {/* Breadcrumb & Trust Marker */}
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-emerald-200 mb-4 font-medium">
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Govt. Regd. NGO • 80G Tax Exemption</span>
          </div>
          {config.breadcrumb && !isHome && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <span
                onClick={() => onNavigate('home')}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Home
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-300 font-semibold">{config.breadcrumb.replace('Home / ', '')}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight max-w-4xl text-balance leading-tight drop-shadow-sm">
          {config.title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl leading-relaxed font-normal">
          {config.subtitle}
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onOpenDonate}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-900/30 transition-all duration-200 text-sm md:text-base cursor-pointer whitespace-nowrap"
          >
            <HeartHandshake className="w-5 h-5" />
            <span>Donate Now (Tax-Exempt)</span>
          </button>

          {isHome ? (
            <button
              onClick={() => onNavigate('projects')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 backdrop-blur-sm transition-all text-sm md:text-base cursor-pointer whitespace-nowrap"
            >
              Explore Our Projects
            </button>
          ) : (
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 backdrop-blur-sm transition-all text-sm md:text-base cursor-pointer whitespace-nowrap"
            >
              Get In Touch
            </button>
          )}
        </div>
      </div>

      {/* Subtle bottom division strip */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-[#10b981]" />
    </section>
  );
};
