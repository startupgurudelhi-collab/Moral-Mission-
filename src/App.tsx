/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActivePage,
  SiteSettings,
  Project,
  Activity,
  GalleryItem,
  BoardMember,
  DonationRecord,
  PageContent,
} from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DonateModal } from './components/DonateModal';
import { Receipt80GModal } from './components/Receipt80GModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { DonatePage } from './pages/DonatePage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPage } from './pages/RefundPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [activeReceiptDonation, setActiveReceiptDonation] = useState<DonationRecord | null>(null);

  // App-wide reactive state synchronized with storageService
  const [settings, setSettings] = useState<SiteSettings>(() => storageService.getSettings());
  const [projects, setProjects] = useState<Project[]>(() => storageService.getProjects());
  const [activities, setActivities] = useState<Activity[]>(() => storageService.getActivities());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => storageService.getGallery());
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(() => storageService.getBoardMembers());
  const [pageContent, setPageContent] = useState<PageContent>(() => storageService.getPageContent());

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setSettings(storageService.getSettings());
      setProjects(storageService.getProjects());
      setActivities(storageService.getActivities());
      setGallery(storageService.getGallery());
      setBoardMembers(storageService.getBoardMembers());
      setPageContent(storageService.getPageContent());
    });
    return unsubscribe;
  }, []);

  const handleNavigate = (page: ActivePage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonate = (projectId?: string) => {
    setSelectedProjectId(projectId);
    setIsDonateModalOpen(true);
  };

  const handleDonationSuccess = (donation: DonationRecord) => {
    setActiveReceiptDonation(donation);
  };

  // If in Admin Dashboard mode, display the full-screen CMS
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <AdminDashboard
          onNavigate={handleNavigate}
          onOpenReceipt={(donation) => setActiveReceiptDonation(donation)}
        />
        {activeReceiptDonation && (
          <Receipt80GModal
            donation={activeReceiptDonation}
            settings={settings}
            onClose={() => setActiveReceiptDonation(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Dynamic Header */}
      <Header
        settings={settings}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDonate={() => handleOpenDonate()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            settings={settings}
            projects={projects}
            activities={activities}
            gallery={gallery}
            onNavigate={handleNavigate}
            onOpenDonate={handleOpenDonate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            settings={settings}
            boardMembers={boardMembers}
            pageContent={pageContent}
            onNavigate={handleNavigate}
            onOpenDonate={() => handleOpenDonate()}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage
            settings={settings}
            projects={projects}
            onNavigate={handleNavigate}
            onOpenDonate={handleOpenDonate}
          />
        )}

        {currentPage === 'activities' && (
          <ActivitiesPage
            settings={settings}
            activities={activities}
            onNavigate={handleNavigate}
            onOpenDonate={() => handleOpenDonate()}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            settings={settings}
            gallery={gallery}
            onNavigate={handleNavigate}
            onOpenDonate={() => handleOpenDonate()}
          />
        )}

        {currentPage === 'donate' && (
          <DonatePage
            settings={settings}
            projects={projects}
            onNavigate={handleNavigate}
            onOpenDonate={handleOpenDonate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            settings={settings}
            onNavigate={handleNavigate}
            onOpenDonate={() => handleOpenDonate()}
          />
        )}

        {currentPage === 'terms' && (
          <TermsPage
            settings={settings}
            pageContent={pageContent}
            onNavigate={handleNavigate}
            onOpenDonate={() => handleOpenDonate()}
          />
        )}

        {currentPage === 'refund' && (
          <RefundPage
            settings={settings}
            pageContent={pageContent}
            onNavigate={handleNavigate}
            onOpenDonate={() => handleOpenDonate()}
          />
        )}
      </main>

      {/* Official Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenDonate={() => handleOpenDonate()}
      />

      {/* Global Interactive Donation Modal */}
      {isDonateModalOpen && (
        <DonateModal
          settings={settings}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onClose={() => setIsDonateModalOpen(false)}
          onDonationSuccess={handleDonationSuccess}
        />
      )}

      {/* Official 80G Tax Exemption Receipt Modal */}
      {activeReceiptDonation && (
        <Receipt80GModal
          donation={activeReceiptDonation}
          settings={settings}
          onClose={() => setActiveReceiptDonation(null)}
        />
      )}
    </div>
  );
}
