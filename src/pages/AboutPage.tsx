import React from 'react';
import { SiteSettings, BoardMember, PageContent, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import {
  ShieldCheck,
  Award,
  Users,
  Compass,
  FileText,
  Heart,
  CheckCircle,
} from 'lucide-react';

interface AboutPageProps {
  settings: SiteSettings;
  boardMembers: BoardMember[];
  pageContent: PageContent;
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  boardMembers,
  pageContent,
  onNavigate,
  onOpenDonate,
}) => {
  return (
    <div>
      {/* 1. Dynamic Master Banner */}
      <MasterBanner
        config={settings.banners.about}
        currentPage="about"
        onNavigate={onNavigate}
        onOpenDonate={onOpenDonate}
      />

      {/* 2. Story / Genesis Narrative */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-md">
              <Compass className="w-3.5 h-3.5" />
              <span>Genesis & Moral Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f2850] leading-tight">
              A Mission Consecrated to Grassroots Seva & Justice
            </h2>

            <div className="text-slate-700 leading-relaxed text-base space-y-4 whitespace-pre-line border-l-2 border-emerald-600 pl-6 py-2 bg-slate-50/50 rounded-r-xl">
              {pageContent.aboutStory}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vision, Mission & Values Grid */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Vision */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#0f2850]">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {pageContent.aboutVision}
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0f2850]/10 text-[#0f2850] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#0f2850]">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {pageContent.aboutMission}
              </p>
            </div>
          </div>

          {/* 4 Pillars of Integrity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <CheckCircle className="w-5 h-5 text-emerald-600 mb-2" />
              <h4 className="font-semibold text-sm text-[#0f2850]">Moral Compassion</h4>
              <p className="text-xs text-slate-500 mt-1">
                Rooted in unconditional kindness and respect for individual human dignity across all communities.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
              <h4 className="font-semibold text-sm text-[#0f2850]">100% Transparency</h4>
              <p className="text-xs text-slate-500 mt-1">
                Every rupee audited under Indian CA standards with downloadable annual financial disclosures.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <Heart className="w-5 h-5 text-emerald-600 mb-2" />
              <h4 className="font-semibold text-sm text-[#0f2850]">Grassroots Direct Action</h4>
              <p className="text-xs text-slate-500 mt-1">
                Active ground volunteers executing field relief rather than bureaucratic theoretical initiatives.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <Users className="w-5 h-5 text-emerald-600 mb-2" />
              <h4 className="font-semibold text-sm text-[#0f2850]">Community Empowerment</h4>
              <p className="text-xs text-slate-500 mt-1">
                Equipping beneficiaries with vocational skills and schooling so they become self-reliant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Board of Trustees & Leadership */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Governance & Oversight
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#0f2850] mt-1">
              Board of Trustees & Leadership
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Distinguished educationists, doctors, retired civil servants, and social practitioners guiding our moral charter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-emerald-500/40 overflow-hidden mb-4 flex items-center justify-center">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0f2850] to-[#0a1b36] flex items-center justify-center text-white font-serif font-bold text-2xl">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-[#0f2850]">
                  {member.name}
                </h3>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {member.role}
                </div>
                <div className="text-[11px] text-slate-500 italic mt-0.5">
                  {member.qualification}
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Statutory Indian Registrations Table */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Legal Integrity & Accountability
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#0f2850] mt-1">
              Official Indian NGO Registrations
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm divide-y divide-slate-200">
              <thead className="bg-[#0f2850] text-white text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Statutory Authority / Agency</th>
                  <th className="px-6 py-3.5">Registration / License Number</th>
                  <th className="px-6 py-3.5">Status & Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    NITI Aayog NGO DARPAN
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[#0f2850] font-bold">
                    {settings.darpanId}
                  </td>
                  <td className="px-6 py-3.5 text-emerald-700 font-semibold">Verified Active NGO</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    Income Tax Section 80G Exemption
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[#0f2850] font-bold">
                    {settings.section80G}
                  </td>
                  <td className="px-6 py-3.5 text-emerald-700 font-semibold">50% Donor Tax Relief</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    Income Tax Section 12A Registration
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[#0f2850] font-bold">
                    {settings.section12A}
                  </td>
                  <td className="px-6 py-3.5 text-emerald-700 font-semibold">Charitable Organization</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    Ministry of Corporate Affairs (MCA) CSR-1
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[#0f2850] font-bold">
                    {settings.csrNumber}
                  </td>
                  <td className="px-6 py-3.5 text-emerald-700 font-semibold">CSR Grant Eligible</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    Societies Registration Act
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[#0f2850] font-bold">
                    {settings.registrationNumber}
                  </td>
                  <td className="px-6 py-3.5 text-emerald-700 font-semibold">Registered Society</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    Permanent Account Number (PAN)
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[#0f2850] font-bold">
                    {settings.panNumber}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">Trust / Foundation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
