import React from 'react';
import { SiteSettings, Project, DonationRecord, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import {
  ShieldCheck,
  CheckCircle2,
  Building,
  QrCode,
  FileCheck,
  HeartHandshake,
  HelpCircle,
} from 'lucide-react';

interface DonatePageProps {
  settings: SiteSettings;
  projects: Project[];
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: (projectId?: string) => void;
}

export const DonatePage: React.FC<DonatePageProps> = ({
  settings,
  projects,
  onNavigate,
  onOpenDonate,
}) => {
  return (
    <div>
      {/* 1. Dynamic Master Banner */}
      <MasterBanner
        config={settings.banners.donate}
        currentPage="donate"
        onNavigate={onNavigate}
        onOpenDonate={() => onOpenDonate()}
      />

      {/* 2. Indian 80G Tax Exemption Explainer Strip */}
      <section className="bg-emerald-800 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-emerald-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">
                50% Tax Deduction under Section 80G of the Income Tax Act
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Reg Order: <span className="font-mono font-bold">{settings.section80G}</span> • NITI Aayog: <span className="font-mono font-bold">{settings.darpanId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenDonate()}
            className="px-6 py-3 bg-white text-[#0f2850] hover:bg-emerald-50 active:bg-slate-100 font-bold rounded-lg text-sm transition-colors cursor-pointer shrink-0"
          >
            Start Donation (Claim 80G)
          </button>
        </div>
      </section>

      {/* 3. Direct Contribution Channels */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Transparent Indian Banking
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#0f2850] mt-1">
              Convenient Modes of Giving
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Choose instant BHIM UPI transfer or direct NEFT/RTGS bank transfer to our official non-profit accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mode 1: UPI Transfer */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0f2850]">
                      Instant UPI / QR Code Payment
                    </h3>
                    <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center my-6">
                  <div className="text-xs text-slate-500">Official Foundation VPA / UPI ID:</div>
                  <div className="text-lg font-mono font-bold text-[#0f2850] mt-1">
                    {settings.upiId}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-1">
                    Beneficiary: {settings.beneficiaryName}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {settings.upiQrNote}
                </p>
              </div>

              <button
                onClick={() => onOpenDonate()}
                className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Open Instant UPI & 80G Form</span>
              </button>
            </div>

            {/* Mode 2: NEFT / RTGS Bank Transfer */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0f2850]/10 text-[#0f2850] flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0f2850]">
                      Direct RTGS / NEFT / IMPS Transfer
                    </h3>
                    <p className="text-xs text-slate-500">Official Non-Profit Current Account</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 my-4">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Beneficiary Name:</span>
                    <span className="font-bold text-slate-900">{settings.beneficiaryName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Bank Name:</span>
                    <span className="font-medium text-slate-900">{settings.bankName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Account Number:</span>
                    <span className="font-mono font-bold text-slate-900">{settings.accountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="font-mono font-bold text-slate-900">{settings.ifscCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Branch:</span>
                    <span className="text-slate-700">{settings.branchName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  After initiating bank transfer, kindly share transaction receipt with your PAN to <strong>{settings.donationEmail}</strong> for instant 80G certificate issuance.
                </p>
              </div>

              <button
                onClick={() => onOpenDonate()}
                className="w-full mt-6 py-3 bg-[#0f2850] hover:bg-[#163a70] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Transfer Details & PAN</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions on Section 80G */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-[#0f2850]">
              Section 80G & Indian Tax Benefits FAQ
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-sm text-[#0f2850]">
                What is Section 80G and how much can I save on tax?
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Section 80G of the Indian Income Tax Act allows individual and corporate donors to claim 50% deduction on the donated amount from their taxable income.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-sm text-[#0f2850]">
                Why is PAN Number mandatory for donation receipts?
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Under the Central Board of Direct Taxes (CBDT) notifications and Rule 11AA, all charitable trusts must submit annual Form 10BD with donor PAN numbers so that donations automatically reflect in the donor&apos;s AIS (Annual Information Statement) and Form 26AS.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-sm text-[#0f2850]">
                How quickly will I receive my 80G Tax Exemption Receipt?
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Our digital portal generates your official, verifiable 80G receipt immediately upon completing the donation form. You can preview, print, or download it right away!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
