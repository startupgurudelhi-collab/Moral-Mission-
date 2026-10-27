import React from 'react';
import { SiteSettings, ActivePage } from '../types';
import {
  Heart,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Lock,
  ArrowUpRight,
} from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenDonate,
}) => {
  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a1b36] text-slate-300 border-t border-slate-800">
      {/* Upper Pre-Footer Highlight */}
      <div className="bg-gradient-to-r from-emerald-800 to-[#0f2850] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-emerald-600/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
              Tax Benefits Under Section 80G
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Every Rupee You Give Brings Dignity & Sustenance
            </h3>
            <p className="text-emerald-100 text-sm mt-2">
              All domestic Indian donations to Moral Mission Foundation are 50% tax exempt under Section 80G of the Income Tax Act. Instant 80G receipts issued with Indian PAN.
            </p>
          </div>
          <button
            onClick={onOpenDonate}
            className="px-6 py-3.5 bg-white text-[#0f2850] hover:bg-emerald-50 active:bg-slate-100 font-bold rounded-lg shadow-md transition-all text-sm md:text-base cursor-pointer shrink-0"
          >
            Donate Today • Claim 80G
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Organization Identity & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.orgName}
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain rounded"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center p-1.5 shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h4 className="text-lg font-serif font-bold text-white leading-tight">
                  {settings.orgName}
                </h4>
                <p className="text-xs text-emerald-400 font-medium">
                  {settings.orgHindiName || 'नैतिक मिशन फाउंडेशन'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.tagline}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">NITI Aayog DARPAN:</span>
                <span className="font-mono text-slate-300">{settings.darpanId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">80G Reg:</span>
                <span className="font-mono text-slate-300">{settings.section80G}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">12A Reg:</span>
                <span className="font-mono text-slate-300">{settings.section12A}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">MCA CSR-1:</span>
                <span className="font-mono text-slate-300">{settings.csrNumber}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore Pages
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About Our Foundation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('projects')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Our Projects & Causes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('activities')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Field Activities & Camps
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Photo & Video Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Contact Us & Locations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal, Governance & Policy */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Governance & Policies
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleNav('terms')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Terms & Conditions</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('refund')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Refund & Cancellation Policy</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Annual Reports & Transparency
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('donate')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  80G Exemption Receipt Process
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => handleNav('admin')}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-xs bg-amber-950/40 border border-amber-600/30 px-3 py-1.5 rounded transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin CMS Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Bank Details */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Official Contact
            </h5>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.registeredAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>

              {/* Direct Bank Transfer Box */}
              <div className="mt-4 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>Official Bank Account</span>
                </div>
                <div>A/C: <span className="font-mono text-white">{settings.accountNumber}</span></div>
                <div>IFSC: <span className="font-mono text-white">{settings.ifscCode}</span></div>
                <div>Bank: {settings.bankName}</div>
                <div>UPI: <span className="text-emerald-300 font-mono">{settings.upiId}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.orgName} ({settings.orgHindiName}). All Rights Reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Non-Profit Registered under Indian Societies Registration Act</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Heart className="w-3 h-3 fill-emerald-500 text-emerald-500" />
              Seva Paramo Dharma
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
