import React from 'react';
import { DonationRecord, SiteSettings } from '../types';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Receipt80GModalProps {
  donation: DonationRecord;
  settings: SiteSettings;
  onClose: () => void;
}

// Convert amount in INR to words (Indian Numbering System)
function numberToIndianWords(num: number): string {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  function inWords(n: number): string {
    let str = '';
    if (n > 9999999) {
      str += inWords(Math.floor(n / 10000000)) + 'Crore ';
      n %= 10000000;
    }
    if (n > 99999) {
      str += inWords(Math.floor(n / 100000)) + 'Lakh ';
      n %= 100000;
    }
    if (n > 999) {
      str += inWords(Math.floor(n / 1000)) + 'Thousand ';
      n %= 1000;
    }
    if (n > 99) {
      str += inWords(Math.floor(n / 100)) + 'Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) {
        str += a[n];
      } else {
        str += b[Math.floor(n / 10)] + (n % 10 > 0 ? ' ' + a[n % 10] : ' ');
      }
    }
    return str;
  }

  return 'Rupees ' + inWords(Math.floor(num)).trim() + ' Only';
}

export const Receipt80GModal: React.FC<Receipt80GModalProps> = ({
  donation,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-[#0f2850] text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold">Official 80G Tax Exemption Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div id="receipt-print-area" className="p-8 sm:p-12 text-slate-800 bg-white">
          {/* Header */}
          <div className="border-b-2 border-[#0f2850] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f2850]">
                {settings.orgName}
              </h2>
              <p className="text-sm font-semibold text-emerald-700">
                {settings.orgHindiName || 'नैतिक मिशन फाउंडेशन'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                {settings.registeredAddress}
              </p>
            </div>
            <div className="text-right text-xs text-slate-600 font-mono space-y-1">
              <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-sans font-semibold">
                Form 10BE / Section 80G
              </div>
              <div>PAN: <span className="font-bold text-slate-900">{settings.panNumber}</span></div>
              <div>80G Reg: <span className="font-bold text-slate-900">{settings.section80G}</span></div>
              <div>12A Reg: <span className="font-bold text-slate-900">{settings.section12A}</span></div>
              <div>DARPAN ID: <span className="font-bold text-slate-900">{settings.darpanId}</span></div>
            </div>
          </div>

          {/* Receipt Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Receipt Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{donation.receiptNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date of Receipt</span>
              <span className="font-medium text-slate-900">{donation.date}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Mode of Payment</span>
              <span className="font-medium text-slate-900">{donation.paymentMethod}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Transaction Reference</span>
              <span className="font-mono text-slate-900 text-[11px] truncate block" title={donation.transactionId}>
                {donation.transactionId}
              </span>
            </div>
          </div>

          {/* Donor Details */}
          <div className="my-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Received With Deep Gratitude From:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-slate-500 text-xs block">Donor Name:</span>
                <span className="font-bold text-slate-900 text-base">{donation.donorName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Donor PAN Number (Permanent Account No):</span>
                <span className="font-mono font-bold text-emerald-800 text-base tracking-wider bg-emerald-100/60 px-2 py-0.5 rounded">
                  {donation.donorPan || 'Not Specified'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 text-xs block">Donor Address:</span>
                <span className="text-slate-800">{donation.donorAddress}, {donation.donorState}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Contact Phone:</span>
                <span className="text-slate-800">{donation.donorPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Email Address:</span>
                <span className="text-slate-800">{donation.donorEmail}</span>
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div className="my-6 p-5 rounded-lg bg-emerald-50/60 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-emerald-800 font-medium">Donation Amount:</div>
              <div className="text-3xl font-bold font-serif text-[#0f2850]">
                ₹{donation.amount.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-600 italic mt-0.5">
                ({numberToIndianWords(donation.amount)})
              </div>
            </div>

            {donation.projectName && (
              <div className="text-right sm:max-w-xs">
                <span className="text-xs text-slate-500 block">Allocated Towards Cause:</span>
                <span className="text-xs font-semibold text-slate-800">{donation.projectName}</span>
              </div>
            )}
          </div>

          {/* Statutory Tax Exemption Clause */}
          <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4 space-y-1">
            <p className="font-medium text-slate-700">
              * Statutory Declaration under Section 80G of the Income Tax Act, 1961:
            </p>
            <p>
              Donations to Moral Mission Foundation are entitled to deduction under Section 80G of the Income Tax Act, 1961 vide Order No. {settings.section80G}. This document serves as valid proof of charitable donation for the donor&apos;s annual Income Tax computation.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-end justify-between">
            <div className="text-xs text-slate-400">
              <div>Computer Generated E-Receipt</div>
              <div>Moral Mission Foundation Finance & Accounts Wing</div>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-dashed border-slate-400 w-44 mb-1 flex items-center justify-center text-xs font-serif italic text-slate-600">
                Dr. R. N. Sharma
              </div>
              <div className="text-xs font-semibold text-slate-800">Authorized Signatory</div>
              <div className="text-[10px] text-slate-500">For Moral Mission Foundation</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between print:hidden">
          <span>Need updates or corrections? Email: {settings.donationEmail}</span>
          <button
            onClick={handlePrint}
            className="text-emerald-700 hover:text-emerald-800 font-medium underline cursor-pointer"
          >
            Click here to Print or Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};
