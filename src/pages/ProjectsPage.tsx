import React, { useState } from 'react';
import { SiteSettings, Project, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import {
  HeartHandshake,
  MapPin,
  Users,
  Target,
  ArrowRight,
  X,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface ProjectsPageProps {
  settings: SiteSettings;
  projects: Project[];
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: (projectId?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  settings,
  projects,
  onNavigate,
  onOpenDonate,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const categories = [
    'All',
    'Education',
    'Nutrition',
    'Healthcare',
    'Women Empowerment',
    'Environment',
  ];

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* 1. Dynamic Master Banner */}
      <MasterBanner
        config={settings.banners.projects}
        currentPage="projects"
        onNavigate={onNavigate}
        onOpenDonate={() => onOpenDonate()}
      />

      {/* 2. Interactive Category Filter Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0f2850] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat === 'All' ? 'All Initiatives' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Projects Catalog Grid */}
      <section className="py-16 bg-slate-50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => {
              const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#0f2850] text-white text-xs font-semibold px-3 py-1 rounded-md">
                      {project.category}
                    </div>
                    {project.status === 'Urgent' && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        Urgent Need
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => setDetailProject(project)}
                        className="font-serif font-bold text-xl text-[#0f2850] leading-snug hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                        {project.shortDesc}
                      </p>

                      <div className="space-y-1.5 mt-4 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Target: {project.beneficiaries}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                          <span className="text-[#0f2850] font-bold font-mono text-sm">
                            ₹{project.raisedAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-500">
                            Goal: ₹{project.targetAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                          <span>{percent}% Complete</span>
                          <span>{project.donorsCount} Donors</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setDetailProject(project)}
                          className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          View Mission Report
                        </button>
                        <button
                          onClick={() => onOpenDonate(project.id)}
                          className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <HeartHandshake className="w-4 h-4" />
                          <span>Donate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {detailProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="relative h-64 bg-slate-900">
              <img
                src={detailProject.imageUrl}
                alt={detailProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailProject(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 rounded-xl text-white">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  {detailProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                  {detailProject.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Location</span>
                  <span className="font-bold text-slate-800">{detailProject.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Beneficiaries</span>
                  <span className="font-bold text-slate-800">{detailProject.beneficiaries}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Funds Raised</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    ₹{detailProject.raisedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Detailed Project Plan & Objectives
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {detailProject.fullDesc}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setDetailProject(null)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = detailProject.id;
                    setDetailProject(null);
                    onOpenDonate(id);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Donate to This Cause</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
