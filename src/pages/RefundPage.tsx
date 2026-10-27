import React from 'react';
import { SiteSettings, PageContent, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import { RefreshCw, ShieldAlert, Mail, HelpCircle } from 'lucide-react';

interface RefundPageProps {
  settings: SiteSettings;
  pageContent: PageContent;
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const RefundPage: React.FC<RefundPageProps> = ({
  settings,
  pageContent,
  onNavigate,
  onOpenDonate,
}) => {
  return (
    <div>
      {/* 1. Dynamic Master Banner */}
      <MasterBanner
        config={settings.banners.refund}
        currentPage="refund"
        onNavigate={onNavigate}
        onOpenDonate={onOpenDonate}
      />

      {/* 2. Refund Document */}
      <section className="py-16 bg-white min-h-[500px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-[#0f2850]">
                  Donation Refund & Cancellation Policy
                </h3>
                <p className="text-xs text-slate-500">
                  Indian Non-Profit Regulatory Compliance
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Statutory Notice regarding Section 80G Receipts:</strong> Under Central Board of Direct Taxes (CBDT) regulations, once an official 80G tax deduction receipt has been issued and reported to the Income Tax Department, the donation becomes final and non-refundable. For transaction errors, please write within 7 days.
              </div>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line font-sans">
              {pageContent.refundContent}
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Dedicated Refund Desk: <strong>{settings.donationEmail}</strong></span>
              </div>
              <span>Support SLA: 48 Working Hours</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
