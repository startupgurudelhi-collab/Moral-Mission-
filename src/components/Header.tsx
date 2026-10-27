import React, { useState } from 'react';
import { SiteSettings, ActivePage } from '../types';
import {
  HeartHandshake,
  Menu,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  settings: SiteSettings;
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentPage,
  onNavigate,
  onOpenDonate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: ActivePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Our Projects', page: 'projects' },
    { label: 'Our Activities', page: 'activities' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Contact Us', page: 'contact' },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Utility Ribbon - Indian NGO Standard */}
      <div className="bg-[#0f2850] text-slate-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.email}</span>
            </a>
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>80G / 12A Certified • NITI Aayog: {settings.darpanId}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">Reg: {settings.registrationNumber}</span>
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded transition-colors cursor-pointer"
              title="Admin CMS Dashboard"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Identity / Dynamic Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.orgName}
                referrerPolicy="no-referrer"
                className="h-12 w-auto object-contain rounded"
              />
            ) : (
              /* Custom Authentic Emblem for Moral Mission Foundation */
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2850] to-[#0a1b36] flex items-center justify-center p-2 shadow-sm border border-emerald-600/30 group-hover:border-emerald-500 transition-colors">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Outer circle */}
                  <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="3" />
                  {/* Two hands forming a protective leaf/flame */}
                  <path
                    d="M50 20 C65 35 75 55 50 82 C25 55 35 35 50 20 Z"
                    fill="#10b981"
                    opacity="0.9"
                  />
                  {/* Inner heart/sun */}
                  <circle cx="50" cy="46" r="10" fill="#f59e0b" />
                  <path
                    d="M32 60 C32 60 40 70 50 70 C60 70 68 60 68 60"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#0f2850] tracking-tight group-hover:text-emerald-700 transition-colors leading-tight">
                {settings.orgName}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-emerald-700 tracking-wide">
                {settings.orgHindiName || 'नैतिक मिशन फाउंडेशन'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-sm font-medium transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'text-[#0f2850] border-emerald-600 font-semibold'
                      : 'text-slate-600 border-transparent hover:text-[#0f2850] hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Donate Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDonate}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm shadow-emerald-700/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Donate Now</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1 divide-y divide-slate-100">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`py-3 px-2 text-left text-base font-medium flex items-center justify-between rounded-md transition-colors ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                </button>
              );
            })}

            {/* Additional Mobile Links */}
            <div className="pt-4 flex flex-col gap-2.5">
              <button
                onClick={() => handleNavClick('admin')}
                className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Admin CMS Portal
                </span>
                <span className="text-xs text-slate-500">Edit Website</span>
              </button>

              <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900 space-y-1">
                <div className="font-semibold text-emerald-950">Helpline / Support:</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{settings.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{settings.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
