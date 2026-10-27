import React, { useState } from 'react';
import { SiteSettings, Activity, ActivePage } from '../types';
import { MasterBanner } from '../components/MasterBanner';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  X,
  FileCheck,
} from 'lucide-react';

interface ActivitiesPageProps {
  settings: SiteSettings;
  activities: Activity[];
  onNavigate: (page: ActivePage) => void;
  onOpenDonate: () => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  settings,
  activities,
  onNavigate,
  onOpenDonate,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  return (
    <div>
      {/* 1. Dynamic Master Banner */}
      <MasterBanner
        config={settings.banners.activities}
        currentPage="activities"
        onNavigate={onNavigate}
        onOpenDonate={onOpenDonate}
      />

      {/* 2. Activities Timeline & Cards */}
      <section className="py-16 bg-slate-50 min-h-[600px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Grassroots Relief Log
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#0f2850] mt-1">
              Field Reports & Community Interventions
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Real-time documented activity log of our volunteers working on the ground in rural and slum communities.
            </p>
          </div>

          <div className="space-y-8">
            {activities.map((act, index) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12"
              >
                {/* Photo Column */}
                <div className="md:col-span-5 relative h-60 md:h-full min-h-[220px] bg-slate-900">
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0f2850] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    {act.category}
                  </div>
                </div>

                {/* Content Column */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{act.date}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.location}</span>
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#0f2850] leading-snug">
                      {act.title}
                    </h3>

                    <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                      {act.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div>
                        <span className="text-slate-400 block">Beneficiaries</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {act.beneficiariesCount}+
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Volunteers</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {act.volunteersCount}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedActivity(act)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0f2850] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Read Full Report & Photos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedActivity.imageUrl}
                alt={selectedActivity.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 rounded-xl text-white">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {selectedActivity.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  {selectedActivity.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Date: {selectedActivity.date}</span>
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Location: {selectedActivity.location}</span>
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Volunteers: {selectedActivity.volunteersCount}</span>
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Official Event Overview & Outcomes
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedActivity.details || selectedActivity.summary}
                </p>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-5 py-2.5 bg-[#0f2850] hover:bg-[#163a70] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
