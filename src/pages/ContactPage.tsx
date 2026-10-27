import React, { useState } from 'react';
import { SiteSettings, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import { storageService } from '../services/storageService';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  MessageCircle,
} from 'lucide-react';

interface ContactPageProps {
  settings: SiteSettings;
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  settings,
  onNavigate,
  onOpenDonate,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    storageService.addInquiry({
      id: 'inq-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: 'New',
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div>
      {/* 1. Dynamic Master Banner */}
      <MasterBanner
        config={settings.banners.contact}
        currentPage="contact"
        onNavigate={onNavigate}
        onOpenDonate={onOpenDonate}
      />

      {/* 2. Contact Details & Inquiry Form */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Connect With Moral Mission Foundation
                </span>
                <h2 className="text-3xl font-serif font-bold text-[#0f2850] mt-1">
                  We Welcome Your Voice & Collaboration
                </h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  Whether you wish to sponsor a remedial classroom, explore CSR partnerships, or volunteer in our health camps, our team is eager to connect.
                </p>
              </div>

              {/* Office Locations */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#0f2850]">Registered Head Office</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {settings.registeredAddress}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0f2850]/10 text-[#0f2850] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#0f2850]">Delhi NCR Operations Hub</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {settings.workOfficeAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-500 block">Helpline Numbers</span>
                    <a href={`tel:${settings.phone}`} className="font-bold text-sm text-[#0f2850] hover:text-emerald-700 block">
                      {settings.phone}
                    </a>
                    <span className="text-slate-500 text-[11px]">{settings.altPhone}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-500 block">Direct Inquiries</span>
                    <a href={`mailto:${settings.email}`} className="font-bold text-sm text-[#0f2850] hover:text-emerald-700 block">
                      {settings.email}
                    </a>
                    <span className="text-slate-500 text-[11px]">{settings.donationEmail}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-500 block">Visiting & Field Hours</span>
                    <span className="font-medium text-slate-800">Monday to Saturday: 9:30 AM – 6:30 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-2xl font-serif font-bold text-[#0f2850]">
                  Send a Message or Partnership Request
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Fill in your requirements. Our foundation secretariat will respond within 24 business hours.
                </p>

                {submitted && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-start gap-3 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm text-emerald-900">Message Received With Gratitude!</div>
                      <div className="mt-0.5">
                        Your inquiry has been logged in our system. A project coordinator will reach out to you shortly.
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Your Full Name*
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikramaditya Roy"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vikram@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Inquiry Category
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="CSR Partnership">Corporate CSR Grant</option>
                        <option value="Volunteering">Weekend Volunteering</option>
                        <option value="80G Certificate Query">80G Tax Receipt Support</option>
                        <option value="School / Health Camp Request">Organize Camp in Our Village</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Your Message / Proposal*
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please share details of your query, partnership proposal, or volunteering interests..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Foundation</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
