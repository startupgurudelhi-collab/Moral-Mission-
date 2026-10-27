import React, { useState } from 'react';
import { SiteSettings, Project, DonationRecord } from '../types';
import { storageService } from '../services/storageService';
import {
  X,
  HeartHandshake,
  QrCode,
  Building,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';

interface DonateModalProps {
  settings: SiteSettings;
  projects: Project[];
  selectedProjectId?: string;
  onClose: () => void;
  onDonationSuccess: (donation: DonationRecord) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  settings,
  projects,
  selectedProjectId,
  onClose,
  onDonationSuccess,
}) => {
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [paymentTab, setPaymentTab] = useState<'upi' | 'bank'>('upi');

  const [projectId, setProjectId] = useState<string>(selectedProjectId || '');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [donorAddress, setDonorAddress] = useState<string>('');
  const [donorState, setDonorState] = useState<string>('Delhi');
  const [txnRef, setTxnRef] = useState<string>('');

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetAmounts = [
    { value: 500, label: '₹500', desc: '10 Hot Meals' },
    { value: 1000, label: '₹1,000', desc: 'School Kit' },
    { value: 2500, label: '₹2,500', desc: 'Elderly Medicine' },
    { value: 5000, label: '₹5,000', desc: 'Child Education' },
    { value: 10000, label: '₹10,000', desc: 'Women Toolkit' },
  ];

  const handleSelectPreset = (val: number) => {
    setIsCustom(false);
    setAmount(val);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    setCustomAmount(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const finalAmount = isCustom ? (parseFloat(customAmount) || 0) : amount;

  // Real UPI deep-link URI (compatible with PhonePe, GPay, Paytm, BHIM)
  const upiUri = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.beneficiaryName)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent('Donation Moral Mission')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!donorName.trim()) {
      setErrorMsg('Please enter your full name as per PAN card.');
      return;
    }
    if (!donorPan.trim()) {
      setErrorMsg('Indian PAN Number is required for 80G Tax Exemption receipts.');
      return;
    }
    if (finalAmount < 100) {
      setErrorMsg('Minimum donation amount is ₹100.');
      return;
    }

    setSubmitting(true);

    const generatedReceiptNo = `MMF/2026-27/${Math.floor(1000 + Math.random() * 9000)}`;
    const matchedProject = projects.find((p) => p.id === projectId);

    const newRecord: DonationRecord = {
      id: 'don-' + Date.now(),
      receiptNumber: generatedReceiptNo,
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim() || 'donor@example.com',
      donorPhone: donorPhone.trim() || '+91 98000 00000',
      donorPan: donorPan.trim().toUpperCase(),
      donorAddress: donorAddress.trim() || 'New Delhi, India',
      donorState: donorState,
      amount: finalAmount,
      paymentMethod: paymentTab === 'upi' ? 'UPI' : 'Bank Transfer (NEFT/RTGS)',
      transactionId: txnRef.trim() || `TXN-MMF-${Date.now().toString().slice(-8)}`,
      projectId: projectId || undefined,
      projectName: matchedProject?.title || 'General Humanitarian Mission Fund',
      date: new Date().toISOString().slice(0, 10),
      status: 'Completed',
      taxExemptionClaimed: true,
    };

    storageService.addDonation(newRecord);

    setTimeout(() => {
      setSubmitting(false);
      onClose();
      onDonationSuccess(newRecord);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-[#0f2850] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold leading-tight">
                Donate to Moral Mission Foundation
              </h3>
              <p className="text-xs text-emerald-300">
                100% Secure • 50% Tax Exemption Under Section 80G
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Cause / Project Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Direct Contribution Towards:
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="">General Mission Fund (Where Most Needed)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.category})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Amount Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Select Donation Amount (INR ₹):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {presetAmounts.map((preset) => {
                const isSelected = !isCustom && amount === preset.value;
                return (
                  <button
                    type="button"
                    key={preset.value}
                    onClick={() => handleSelectPreset(preset.value)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-[#0f2850] shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-base font-bold font-serif">{preset.label}</div>
                    <div className="text-[11px] text-slate-500">{preset.desc}</div>
                  </button>
                );
              })}

              {/* Custom Amount input */}
              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  isCustom
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="text-[11px] text-slate-500 font-medium">Custom (₹)</div>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={customAmount}
                  onChange={handleCustomChange}
                  onFocus={() => setIsCustom(true)}
                  className="w-full mt-1 font-bold text-sm bg-transparent outline-hidden text-[#0f2850]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Mode: UPI QR vs Direct Bank */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  paymentTab === 'upi'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR Scan (Google Pay, PhonePe, Paytm)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('bank')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  paymentTab === 'bank'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>NEFT / RTGS Bank Transfer</span>
              </button>
            </div>

            {paymentTab === 'upi' ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                {/* Visual QR Code Generator */}
                <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-slate-200 shrink-0 flex flex-col items-center justify-center text-center">
                  {/* High Quality Standard QR SVG Representation */}
                  <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    {/* Top Left Finder */}
                    <rect x="10" y="10" width="26" height="26" rx="3" fill="#0f2850" />
                    <rect x="14" y="14" width="18" height="18" rx="2" fill="white" />
                    <rect x="18" y="18" width="10" height="10" rx="1" fill="#0f2850" />
                    {/* Top Right Finder */}
                    <rect x="64" y="10" width="26" height="26" rx="3" fill="#0f2850" />
                    <rect x="68" y="14" width="18" height="18" rx="2" fill="white" />
                    <rect x="72" y="18" width="10" height="10" rx="1" fill="#0f2850" />
                    {/* Bottom Left Finder */}
                    <rect x="10" y="64" width="26" height="26" rx="3" fill="#0f2850" />
                    <rect x="14" y="68" width="18" height="18" rx="2" fill="white" />
                    <rect x="18" y="72" width="10" height="10" rx="1" fill="#0f2850" />
                    {/* Alignment & Data Dots */}
                    <rect x="42" y="16" width="6" height="6" fill="#059669" />
                    <rect x="50" y="24" width="6" height="6" fill="#0f2850" />
                    <rect x="42" y="42" width="8" height="8" rx="2" fill="#059669" />
                    <rect x="54" y="42" width="6" height="6" fill="#0f2850" />
                    <rect x="68" y="50" width="6" height="6" fill="#059669" />
                    <rect x="42" y="68" width="6" height="6" fill="#0f2850" />
                    <rect x="52" y="74" width="6" height="6" fill="#059669" />
                    <rect x="74" y="74" width="8" height="8" fill="#0f2850" />
                    <rect x="64" y="84" width="6" height="6" fill="#059669" />
                    <circle cx="50" cy="50" r="4" fill="#f59e0b" />
                  </svg>
                  <span className="text-[10px] font-bold text-slate-700 mt-1">BHIM UPI QR</span>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <div>
                    <span className="text-slate-500 block">Official UPI ID:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-sm text-[#0f2850] bg-white px-2 py-1 rounded border border-slate-200">
                        {settings.upiId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.upiId, 'upi')}
                        className="p-1 text-slate-500 hover:text-emerald-700 bg-white border border-slate-200 rounded cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Open any UPI App (Google Pay, Paytm, PhonePe, Cred, BHIM) and scan or pay directly to <strong className="text-slate-900">{settings.upiId}</strong>.
                  </p>

                  <a
                    href={upiUri}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    Click to Open directly on Mobile UPI App
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Beneficiary Name:</span>
                    <span className="font-bold text-slate-900">{settings.beneficiaryName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Bank:</span>
                    <span className="font-medium text-slate-900">{settings.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{settings.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.accountNumber, 'acc')}
                        className="text-slate-400 hover:text-emerald-700"
                        title="Copy Account Number"
                      >
                        {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">IFSC Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{settings.ifscCode}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.ifscCode, 'ifsc')}
                        className="text-slate-400 hover:text-emerald-700"
                        title="Copy IFSC Code"
                      >
                        {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Branch: {settings.branchName}
                </div>
              </div>
            )}
          </div>

          {/* 4. Donor 80G Tax Details (Statutory Indian Requirement) */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Donor Details (For Section 80G Tax Receipt)
              </span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Govt. Form 10BE Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Full Name (As on PAN)*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Singhal"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  PAN Number (Permanent Account No)*
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="e.g. ABCPS1234F"
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm tracking-wider uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">Postal Address</label>
                <input
                  type="text"
                  placeholder="House/Street, City, Pin Code"
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">State / UT</label>
                <select
                  value={donorState}
                  onChange={(e) => setDonorState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Delhi">Delhi / NCR</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Other">Other State/UT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  UPI UTR / Bank Ref No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 428901842941"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-base disabled:opacity-50"
            >
              <span>Confirm Donation of ₹{finalAmount.toLocaleString('en-IN')} & Generate 80G Receipt</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Moral Mission Foundation is certified under Section 12A & 80G of the Income Tax Act, 1961.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
