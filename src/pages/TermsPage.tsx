import React from 'react';
import { SiteSettings, PageContent, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import { FileText, ShieldCheck, Scale } from 'lucide-react';

interface TermsPageProps {
  settings: SiteSettings;
  pageContent: PageContent;
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  settings,
  pageContent,
  onNavigate,
  onOpenDonate,
}) => {
  return (
    <div>
      {/* 1. Dynamic Master Banner */}
      <MasterBanner
        config={settings.banners.terms}
        currentPage="terms"
        onNavigate={onNavigate}
        onOpenDonate={onOpenDonate}
      />

      {/* 2. Terms Document */}
      <section className="py-16 bg-white min-h-[500px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-[#0f2850]">
                  Legal Terms & Conditions
                </h3>
                <p className="text-xs text-slate-500">
                  {settings.orgName} • Reg No: {settings.registrationNumber}
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line font-sans">
              {pageContent.termsContent}
            </div>

            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span>Jurisdiction: High Court of Delhi, New Delhi, India</span>
              <span>Last Updated: October 2026</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
