import React from 'react';
import { SiteSettings, Project, Activity, GalleryItem, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  settings: SiteSettings;
  projects: Project[];
  activities: Activity[];
  gallery: GalleryItem[];
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: (projectId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  projects,
  activities,
  gallery,
  onNavigate,
  onOpenDonate,
}) => {
  const featuredProjects = projects.filter((p) => p.featured || p.status === 'Urgent').slice(0, 3);
  const recentActivities = activities.slice(0, 3);
  const galleryPreview = gallery.slice(0, 4);

  return (
    <div>
      {/* 1. Dynamic Master Hero Banner */}
      <MasterBanner
        config={settings.banners.home}
        currentPage="home"
        onNavigate={onNavigate}
        onOpenDonate={() => onOpenDonate()}
      />

      {/* 2. Impact Statistics Strip (Tabular, clean, high-contrast) */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-[#0f2850] tabular-nums">
                ₹1.85 Cr+
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Humanitarian Aid Deployed
              </div>
            </div>

            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-emerald-700 tabular-nums">
                48,000+
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Children & Youths Supported
              </div>
            </div>

            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-[#0f2850] tabular-nums">
                1.4 Lakh+
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Nutritious Meals Served
              </div>
            </div>

            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-emerald-700 tabular-nums">
                100%
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Audited 80G Tax Exemption
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who We Are & Moral Pillar */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-md">
                <span>Who We Are • Seva Paramo Dharma</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f2850] leading-tight text-balance">
                Upholding Moral Responsibility Towards India&apos;s Forgotten Communities
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                Founded under Indian charitable statutes, <strong>Moral Mission Foundation (नैतिक मिशन फाउंडेशन)</strong> is driven by an unyielding ethical commitment: ensuring that every marginalized family receives the fundamental rights of nutrition, healthcare, and education with utmost dignity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="font-semibold text-sm text-[#0f2850] mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Administrative Wastage</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    More than 88% of every donor rupee goes directly into on-ground patient care, school kits, and food supplies.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="font-semibold text-sm text-[#0f2850] mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full Statutory Transparency</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Registered with NITI Aayog DARPAN ({settings.darpanId}) and Income Tax 12A/80G exemptions.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 group cursor-pointer"
                >
                  <span>Read our story, trustees, and statutory charter</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900">
                <img
                  src="/src/assets/images/hero_ngo_education_1792839133429.jpg"
                  alt="Children learning in classroom"
                  referrerPolicy="no-referrer"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
                    Field Center #4 • East Delhi
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">
                    Nurturing Bright Minds from Urban Slums
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                    Our free remedial centers ensure daily supplementary classes, computer skills, and hot mid-day snacks for over 1,200 children.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Urgent Projects */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Direct Grassroots Action
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#0f2850] mt-1">
                Featured Humanitarian Causes
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Every project is verified on the ground with strict milestone budgeting and direct beneficiary verification.
              </p>
            </div>

            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer shrink-0"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => {
              const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#0f2850] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {project.category}
                    </div>
                    {project.status === 'Urgent' && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Urgent Need
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#0f2850] leading-snug hover:text-emerald-700 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {project.shortDesc}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{project.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      {/* Progress Bar */}
                      <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                        <span className="text-[#0f2850] font-bold font-mono">
                          ₹{project.raisedAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-500">
                          Target: ₹{project.targetAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span>{percent}% Funded</span>
                        <span>{project.donorsCount} Kind Donors</span>
                      </div>

                      <button
                        onClick={() => onOpenDonate(project.id)}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>Donate to This Cause</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Recent Field Work & Activities */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Ground Reality
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#0f2850] mt-1">
                Recent On-Ground Activities
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Photographic reports and summaries from our weekend health camps, food relief drives, and community workshops.
              </p>
            </div>

            <button
              onClick={() => onNavigate('activities')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer shrink-0"
            >
              <span>View All Activities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{act.date}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                      {act.category}
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#0f2850] leading-snug">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                      {act.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{act.location}</span>
                    </span>
                    <span className="font-medium text-[#0f2850]">
                      {act.beneficiariesCount} Beneficiaries
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Indian Statutory Trust & Governance Badges */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Highest Standards of Compliance
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#0f2850] mt-1">
              Statutory Indian Non-Profit Credentials
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Fully compliant with Central Board of Direct Taxes, Ministry of Corporate Affairs, and NITI Aayog.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">NITI Aayog DARPAN ID</span>
              <span className="font-mono font-bold text-sm text-[#0f2850] mt-1 block">
                {settings.darpanId}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Verified Active NGO</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">Income Tax 80G Approval</span>
              <span className="font-mono font-bold text-sm text-[#0f2850] mt-1 block">
                {settings.section80G}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">50% Tax Exemption</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">Section 12A Registration</span>
              <span className="font-mono font-bold text-sm text-[#0f2850] mt-1 block">
                {settings.section12A}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Charitable Trust</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">MCA CSR-1 Registration</span>
              <span className="font-mono font-bold text-sm text-[#0f2850] mt-1 block">
                {settings.csrNumber}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Eligible for Corporate CSR</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Gallery Snapshot */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Visual Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f2850] mt-1">
                Field Impressions & Lives Touched
              </h2>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryPreview.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('gallery')}
                className="group relative h-48 rounded-xl overflow-hidden cursor-pointer shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] text-emerald-300 font-medium uppercase">{item.category}</div>
                  <div className="text-xs font-semibold truncate text-white">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Bottom Direct Donation & Volunteer CTA */}
      <section className="bg-gradient-to-br from-[#0f2850] to-[#0a1b36] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join the Movement of Moral Action</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold max-w-3xl mx-auto leading-tight text-balance">
            Your Contribution Directly Transforms Destitution into Hope
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Whether ₹500 for a child&apos;s nutritional care or a CSR grant for our healthcare clinics, your generosity saves lives and builds a morally strong India.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenDonate()}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all text-base cursor-pointer"
            >
              Donate Now (UPI / Bank)
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-all text-base cursor-pointer"
            >
              Volunteer With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
