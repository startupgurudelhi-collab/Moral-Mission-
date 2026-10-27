import React, { useState, useEffect } from 'react';
import {
  SiteSettings,
  Project,
  Activity,
  GalleryItem,
  BoardMember,
  DonationRecord,
  ContactInquiry,
  PageContent,
  ActivePage,
  MasterBannerConfig,
} from '../../types';
import { storageService } from '../../services/storageService';
import { generateMysqlDump, downloadMysqlDumpFile } from '../../services/mysqlExportService';
import { Receipt80GModal } from '../../components/Receipt80GModal';
import {
  Lock,
  LogOut,
  Settings as SettingsIcon,
  Layers,
  FolderPlus,
  Calendar,
  Image as ImageIcon,
  Users,
  HeartHandshake,
  MessageSquare,
  FileText,
  Database,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: ActivePage) => void;
  onOpenReceipt: (donation: DonationRecord) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenReceipt,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    storageService.isAuthenticated()
  );
  const [loginEmail, setLoginEmail] = useState('admin@moralmission.org');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active tab in CMS
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'settings'
    | 'banners'
    | 'projects'
    | 'activities'
    | 'gallery'
    | 'board'
    | 'donations'
    | 'inquiries'
    | 'content'
    | 'mysql'
  >('overview');

  // Live state
  const [settings, setSettings] = useState<SiteSettings>(() => storageService.getSettings());
  const [projects, setProjects] = useState<Project[]>(() => storageService.getProjects());
  const [activities, setActivities] = useState<Activity[]>(() => storageService.getActivities());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => storageService.getGallery());
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(() => storageService.getBoardMembers());
  const [donations, setDonations] = useState<DonationRecord[]>(() => storageService.getDonations());
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => storageService.getInquiries());
  const [pageContent, setPageContent] = useState<PageContent>(() => storageService.getPageContent());

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form states for adding/editing items
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingBoard, setEditingBoard] = useState<BoardMember | null>(null);
  const [viewingReceiptDonation, setViewingReceiptDonation] = useState<DonationRecord | null>(null);

  // Preset images helper for easy selection in dashboard
  const presetPhotos = [
    { label: 'Education Classroom', url: '/src/assets/images/hero_ngo_education_1792839133429.jpg' },
    { label: 'Food & Ration Drive', url: '/src/assets/images/ngo_food_distribution_1792839134126.jpg' },
    { label: 'Tree Afforestation Drive', url: '/src/assets/images/ngo_tree_plantation_1792839135677.jpg' },
    { label: 'Free Medical Checkup Camp', url: '/src/assets/images/ngo_health_camp_1792839136060.jpg' },
    { label: 'Women Skill & Sewing Center', url: '/src/assets/images/ngo_women_empowerment_1792839135528.jpg' },
  ];

  // Subscribe to storage changes
  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setSettings(storageService.getSettings());
      setProjects(storageService.getProjects());
      setActivities(storageService.getActivities());
      setGallery(storageService.getGallery());
      setBoardMembers(storageService.getBoardMembers());
      setDonations(storageService.getDonations());
      setInquiries(storageService.getInquiries());
      setPageContent(storageService.getPageContent());
    });
    return unsub;
  }, []);

  const triggerToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    // Accepts admin@moralmission.org / admin123 or any reasonable admin password
    if (loginEmail.toLowerCase().includes('admin') && (loginPassword === 'admin123' || loginPassword.length >= 4)) {
      storageService.setAuthenticated(true);
      setIsAuthenticated(true);
      triggerToast('Logged in successfully to Moral Mission Foundation CMS');
    } else {
      setLoginError('Invalid credentials. Use admin@moralmission.org / admin123 or click Quick Demo Login.');
    }
  };

  const handleDemoLogin = () => {
    setLoginEmail('admin@moralmission.org');
    setLoginPassword('admin123');
    storageService.setAuthenticated(true);
    setIsAuthenticated(true);
    triggerToast('Authenticated via Quick Demo Bypass');
  };

  const handleLogout = () => {
    storageService.setAuthenticated(false);
    setIsAuthenticated(false);
  };

  // ----------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-[#0f2850] p-6 text-white text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center mb-3 shadow-md">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold">Moral Mission Foundation</h2>
            <p className="text-xs text-emerald-300 mt-1">Admin Content Management & MySQL Control</p>
          </div>

          <div className="p-8">
            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0f2850] hover:bg-[#163a70] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Secure Log In
                </button>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>⚡ 1-Click Instant Demo Login</span>
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1">
              <div>Default Email: <strong className="text-slate-800">admin@moralmission.org</strong></div>
              <div>Default Password: <strong className="text-slate-800">admin123</strong></div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('home')}
                  className="text-emerald-700 hover:text-emerald-800 font-medium underline"
                >
                  Return to Public Website
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

type AdminTabId =
  | 'overview'
  | 'settings'
  | 'banners'
  | 'projects'
  | 'activities'
  | 'gallery'
  | 'board'
  | 'donations'
  | 'inquiries'
  | 'content'
  | 'mysql';

interface SidebarItem {
  id: AdminTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number | string;
  countClass?: string;
  badge?: string;
}

interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

  const totalRaised = donations.reduce((acc, curr) => acc + curr.amount, 0);
  const newInquiriesCount = inquiries.filter((i) => i.status === 'New').length;

  const sidebarGroups: SidebarGroup[] = [
    {
      group: 'Core Administration',
      items: [
        { id: 'overview', label: 'Dashboard Overview', icon: Layers },
        { id: 'settings', label: 'Site Settings & Logo', icon: SettingsIcon },
        { id: 'banners', label: 'Master Page Banners', icon: ImageIcon },
      ],
    },
    {
      group: 'Humanitarian Operations',
      items: [
        { id: 'projects', label: 'Projects & Causes', icon: FolderPlus, count: projects.length },
        { id: 'activities', label: 'Ground Activities', icon: Calendar, count: activities.length },
        { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, count: gallery.length },
        { id: 'board', label: 'Board & Trustees', icon: Users, count: boardMembers.length },
      ],
    },
    {
      group: 'Donations & Compliance',
      items: [
        { id: 'donations', label: 'Donations & 80G Receipts', icon: HeartHandshake, count: donations.length },
        {
          id: 'inquiries',
          label: 'Contact Inquiries',
          icon: MessageSquare,
          count: newInquiriesCount > 0 ? `${newInquiriesCount} New` : inquiries.length,
          countClass: newInquiriesCount > 0 ? 'bg-amber-500 text-white font-bold' : 'bg-slate-700 text-slate-300',
        },
        { id: 'content', label: 'Page Content CMS', icon: FileText },
      ],
    },
    {
      group: 'Relational Database',
      items: [
        { id: 'mysql', label: 'Database - MySQL', icon: Database, badge: '.sql' },
      ],
    },
  ];

  const allItems: SidebarItem[] = sidebarGroups.flatMap((g) => g.items);
  const activeTabMeta = allItems.find((item) => item.id === activeTab);

  const handleSelectTab = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl border border-emerald-500 flex items-center gap-2 text-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* VERTICAL SIDEBAR NAVIGATION */}
      {/* ---------------------------------------------------- */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-[#0a1b36] text-slate-300 flex flex-col justify-between border-r border-slate-800 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out shrink-0 h-screen overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0f2850]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-sm text-white leading-tight">
                  Moral Mission
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">
                    Admin CMS & MySQL
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Menu Items by Groups */}
          <nav className="p-4 space-y-6">
            {sidebarGroups.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {section.group}
                </div>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/40'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {/* Count or badge */}
                        {'count' in item && item.count !== undefined && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full tabular-nums ${
                              item.countClass
                                ? item.countClass
                                : isActive
                                ? 'bg-emerald-700 text-white font-semibold'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}

                        {'badge' in item && item.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/10 bg-[#08152b] space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] text-slate-400">Preview</span>
          </button>

          <button
            onClick={downloadMysqlDumpFile}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export MySQL .sql</span>
            </div>
            <Download className="w-3 h-3 text-emerald-300" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out Admin</span>
          </button>

          <div className="pt-2 text-[10px] text-slate-500 text-center">
            Moral Mission Foundation • CMS v2.4
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Admin Portal</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="font-semibold text-slate-800">{activeTabMeta?.label}</span>
              </div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-[#0f2850] leading-tight">
                {activeTabMeta?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('home')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Live Website</span>
            </button>

            <button
              onClick={downloadMysqlDumpFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export MySQL</span>
              <span className="sm:hidden">.sql</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Tabs Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {/* ========================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 uppercase font-semibold">Total Funds Received</span>
                <div className="text-3xl font-bold font-serif text-[#0f2850] mt-1 tabular-nums">
                  ₹{totalRaised.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-1">
                  {donations.length} Verified Donations
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 uppercase font-semibold">Active Humanitarian Causes</span>
                <div className="text-3xl font-bold font-serif text-emerald-700 mt-1 tabular-nums">
                  {projects.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {projects.filter((p) => p.status === 'Urgent').length} Marked as Urgent
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 uppercase font-semibold">Field Ground Activities</span>
                <div className="text-3xl font-bold font-serif text-[#0f2850] mt-1 tabular-nums">
                  {activities.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {activities.reduce((a, c) => a + c.beneficiariesCount, 0).toLocaleString('en-IN')} Beneficiaries
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 uppercase font-semibold">Citizen Inquiries</span>
                <div className="text-3xl font-bold font-serif text-[#0f2850] mt-1 tabular-nums">
                  {inquiries.length}
                </div>
                <div className="text-xs text-amber-700 font-medium mt-1">
                  {inquiries.filter((i) => i.status === 'New').length} New Pending Response
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-lg font-serif font-bold text-[#0f2850] mb-3">
                Quick Administration Controls
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                All updates made in this dashboard immediately reflect on the frontend website and are synchronized to your MySQL schema generator.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-colors cursor-pointer"
                >
                  <SettingsIcon className="w-5 h-5 text-emerald-700 mb-2" />
                  <div>Edit Site Settings & Logo</div>
                  <span className="text-[11px] font-normal text-slate-500">Update branding & bank info</span>
                </button>

                <button
                  onClick={() => setActiveTab('banners')}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-emerald-700 mb-2" />
                  <div>Edit Master Banners</div>
                  <span className="text-[11px] font-normal text-slate-500">Change titles & hero images</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-colors cursor-pointer"
                >
                  <FolderPlus className="w-5 h-5 text-emerald-700 mb-2" />
                  <div>Manage Projects</div>
                  <span className="text-[11px] font-normal text-slate-500">Update raised funds & targets</span>
                </button>

                <button
                  onClick={() => setActiveTab('mysql')}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-colors cursor-pointer"
                >
                  <Database className="w-5 h-5 text-emerald-700 mb-2" />
                  <div>MySQL Database Tools</div>
                  <span className="text-[11px] font-normal text-slate-500">Export SQL schema & data</span>
                </button>
              </div>
            </div>

            {/* Recent Inquiries Quick Preview */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif font-bold text-[#0f2850]">
                  Latest Inquiries from Contact Form
                </h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  View All ({inquiries.length})
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {inquiries.slice(0, 3).map((inq) => (
                  <div key={inq.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-slate-900">{inq.name} ({inq.email})</div>
                      <div className="text-slate-600 font-medium mt-0.5">{inq.subject}</div>
                      <p className="text-slate-500 mt-1 line-clamp-1">{inq.message}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inq.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: SITE SETTINGS & LOGO */}
        {/* ========================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                Organization Profile & Branding Settings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize your Foundation name, Hindi logo tagline, contact details, registration numbers, and bank UPI accounts.
              </p>
            </div>

            <div className="space-y-6">
              {/* Branding */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Branding & Dynamic Header Logo
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Organization English Name</label>
                    <input
                      type="text"
                      value={settings.orgName}
                      onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Organization Hindi Subtitle Name</label>
                    <input
                      type="text"
                      value={settings.orgHindiName}
                      onChange={(e) => setSettings({ ...settings, orgHindiName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">
                      Header Logo URL (Leave empty to use the official Indian SVG emblem)
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com/logo.png"
                      value={settings.logoUrl}
                      onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Indian Statutory Reg Numbers */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Indian Statutory Non-Profit Registrations
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">NITI Aayog DARPAN ID</label>
                    <input
                      type="text"
                      value={settings.darpanId}
                      onChange={(e) => setSettings({ ...settings, darpanId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">80G Approval Number</label>
                    <input
                      type="text"
                      value={settings.section80G}
                      onChange={(e) => setSettings({ ...settings, section80G: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Section 12A Reg Number</label>
                    <input
                      type="text"
                      value={settings.section12A}
                      onChange={(e) => setSettings({ ...settings, section12A: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">MCA CSR-1 Registration</label>
                    <input
                      type="text"
                      value={settings.csrNumber}
                      onChange={(e) => setSettings({ ...settings, csrNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Society Reg. Number</label>
                    <input
                      type="text"
                      value={settings.registrationNumber}
                      onChange={(e) => setSettings({ ...settings, registrationNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Foundation PAN</label>
                    <input
                      type="text"
                      value={settings.panNumber}
                      onChange={(e) => setSettings({ ...settings, panNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Official Banking & UPI */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Bank Account & UPI Payment Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Beneficiary Name</label>
                    <input
                      type="text"
                      value={settings.beneficiaryName}
                      onChange={(e) => setSettings({ ...settings, beneficiaryName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={settings.bankName}
                      onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={settings.accountNumber}
                      onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={settings.ifscCode}
                      onChange={(e) => setSettings({ ...settings, ifscCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={settings.branchName}
                      onChange={(e) => setSettings({ ...settings, branchName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">UPI VPA Handle</label>
                    <input
                      type="text"
                      value={settings.upiId}
                      onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Public Contact & Addresses
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Primary Phone</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Inquiry Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">Registered Head Office Address</label>
                    <input
                      type="text"
                      value={settings.registeredAddress}
                      onChange={(e) => setSettings({ ...settings, registeredAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">Operational Field Office Address</label>
                    <input
                      type="text"
                      value={settings.workOfficeAddress}
                      onChange={(e) => setSettings({ ...settings, workOfficeAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    storageService.updateSettings(settings);
                    triggerToast('Site settings updated successfully');
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: MASTER PAGE BANNERS */}
        {/* ========================================================== */}
        {activeTab === 'banners' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                  Master Banners Management
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Every page has a dynamic master banner. Edit the title, subtitle, breadcrumb, and backdrop image for each view.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  storageService.updateSettings(settings);
                  triggerToast('Master banners updated successfully');
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save All Banners</span>
              </button>
            </div>

            <div className="space-y-6">
              {(Object.keys(settings.banners) as (keyof typeof settings.banners)[]).map((pageKey) => {
                const banner = settings.banners[pageKey];
                return (
                  <div
                    key={pageKey}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-sm font-serif font-bold text-[#0f2850] capitalize">
                        {pageKey} Page Banner
                      </span>
                      <span className="text-xs text-emerald-800 font-mono bg-emerald-100 px-2 py-0.5 rounded">
                        /{pageKey}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Image Preview */}
                      <div className="md:col-span-4 relative h-36 bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                        <img
                          src={banner.bgImage}
                          alt={banner.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[11px] font-medium">
                          Current Background
                        </div>
                      </div>

                      {/* Text Controls */}
                      <div className="md:col-span-8 space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Banner Headline</label>
                          <input
                            type="text"
                            value={banner.title}
                            onChange={(e) => {
                              const updated = {
                                ...settings,
                                banners: {
                                  ...settings.banners,
                                  [pageKey]: { ...banner, title: e.target.value },
                                },
                              };
                              setSettings(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Banner Subtitle</label>
                          <textarea
                            rows={2}
                            value={banner.subtitle}
                            onChange={(e) => {
                              const updated = {
                                ...settings,
                                banners: {
                                  ...settings.banners,
                                  [pageKey]: { ...banner, subtitle: e.target.value },
                                },
                              };
                              setSettings(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">
                            Background Image URL or Pick Preset
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={banner.bgImage}
                              onChange={(e) => {
                                const updated = {
                                ...settings,
                                banners: {
                                  ...settings.banners,
                                  [pageKey]: { ...banner, bgImage: e.target.value },
                                },
                              };
                              setSettings(updated);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                          />
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {presetPhotos.map((p, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  const updated = {
                                    ...settings,
                                    banners: {
                                      ...settings.banners,
                                      [pageKey]: { ...banner, bgImage: p.url },
                                    },
                                  };
                                  setSettings(updated);
                                }}
                                className="px-2 py-0.5 rounded bg-white hover:bg-emerald-100 text-[10px] text-slate-700 border border-slate-200 cursor-pointer"
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: PROJECTS & CAUSES CRUD */}
        {/* ========================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                  Humanitarian Projects & Causes
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Add, update, adjust funding targets, and mark urgent campaigns.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingProject({
                    id: 'proj-' + Date.now(),
                    title: '',
                    category: 'Education',
                    shortDesc: '',
                    fullDesc: '',
                    targetAmount: 500000,
                    raisedAmount: 0,
                    donorsCount: 0,
                    beneficiaries: '',
                    location: 'Delhi-NCR, India',
                    imageUrl: presetPhotos[0].url,
                    status: 'Active',
                    startDate: new Date().toISOString().slice(0, 10),
                    featured: false,
                  })
                }
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Editing/Adding Modal */}
            {editingProject && (
              <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#0f2850]">
                    {editingProject.title ? `Edit: ${editingProject.title}` : 'Add New Project'}
                  </h3>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Project Title*</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Environment">Environment</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Disaster Relief">Disaster Relief</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Status</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Urgent">Urgent Need</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Target Funding Amount (₹)*</label>
                    <input
                      type="number"
                      value={editingProject.targetAmount}
                      onChange={(e) => setEditingProject({ ...editingProject, targetAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Currently Raised Amount (₹)*</label>
                    <input
                      type="number"
                      value={editingProject.raisedAmount}
                      onChange={(e) => setEditingProject({ ...editingProject, raisedAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Beneficiaries Description</label>
                    <input
                      type="text"
                      placeholder="e.g. 1,200 Children"
                      value={editingProject.beneficiaries}
                      onChange={(e) => setEditingProject({ ...editingProject, beneficiaries: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Location</label>
                    <input
                      type="text"
                      value={editingProject.location}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Short Summary (For Card)</label>
                    <input
                      type="text"
                      value={editingProject.shortDesc}
                      onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.fullDesc}
                      onChange={(e) => setEditingProject({ ...editingProject, fullDesc: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingProject.imageUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {presetPhotos.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, imageUrl: p.url })}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-[10px] text-slate-700 border border-slate-200"
                        >
                          Use {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!editingProject.title.trim()) return;
                      storageService.saveProject(editingProject);
                      setEditingProject(null);
                      triggerToast('Project saved successfully');
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Project</span>
                  </button>
                </div>
              </div>
            )}

            {/* Projects Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-[#0f2850] text-white uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Project Title</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Target (₹)</th>
                    <th className="px-5 py-3">Raised (₹)</th>
                    <th className="px-5 py-3">Progress</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((proj) => {
                    const pct = Math.min(100, Math.round((proj.raisedAmount / proj.targetAmount) * 100));
                    return (
                      <tr key={proj.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5 font-bold text-slate-900 max-w-xs truncate">
                          {proj.title}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{proj.category}</td>
                        <td className="px-5 py-3.5 font-mono text-slate-700">₹{proj.targetAmount.toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5 font-mono font-bold text-emerald-700">₹{proj.raisedAmount.toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[11px] font-medium">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            proj.status === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {proj.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${proj.title}?`)) {
                                storageService.deleteProject(proj.id);
                                triggerToast('Project deleted');
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: ACTIVITIES CRUD */}
        {/* ========================================================== */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                  Ground Work & Field Activities
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Document camps, relief distributions, medical checkups, and volunteer mobilizations.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingActivity({
                    id: 'act-' + Date.now(),
                    title: '',
                    category: 'Healthcare',
                    date: new Date().toISOString().slice(0, 10),
                    location: 'Gurugram, Haryana',
                    volunteersCount: 20,
                    beneficiariesCount: 250,
                    summary: '',
                    details: '',
                    imageUrl: presetPhotos[3].url,
                  })
                }
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Activity</span>
              </button>
            </div>

            {editingActivity && (
              <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#0f2850]">
                    {editingActivity.title ? `Edit Activity` : 'Add New Activity'}
                  </h3>
                  <button
                    onClick={() => setEditingActivity(null)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Activity Title*</label>
                    <input
                      type="text"
                      required
                      value={editingActivity.title}
                      onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      value={editingActivity.date}
                      onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Location</label>
                    <input
                      type="text"
                      value={editingActivity.location}
                      onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Beneficiaries Count</label>
                    <input
                      type="number"
                      value={editingActivity.beneficiariesCount}
                      onChange={(e) => setEditingActivity({ ...editingActivity, beneficiariesCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Volunteers Count</label>
                    <input
                      type="number"
                      value={editingActivity.volunteersCount}
                      onChange={(e) => setEditingActivity({ ...editingActivity, volunteersCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Brief Summary</label>
                    <textarea
                      rows={2}
                      value={editingActivity.summary}
                      onChange={(e) => setEditingActivity({ ...editingActivity, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingActivity.imageUrl}
                      onChange={(e) => setEditingActivity({ ...editingActivity, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {presetPhotos.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditingActivity({ ...editingActivity, imageUrl: p.url })}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-[10px] text-slate-700 border border-slate-200"
                        >
                          Use {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setEditingActivity(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!editingActivity.title.trim()) return;
                      storageService.saveActivity(editingActivity);
                      setEditingActivity(null);
                      triggerToast('Activity saved successfully');
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Activity</span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex gap-4"
                >
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-700 font-bold uppercase">{act.category} • {act.date}</div>
                      <h4 className="font-bold text-sm text-[#0f2850] mt-0.5 line-clamp-1">{act.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{act.summary}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      <span className="text-[11px] text-slate-600">{act.beneficiariesCount} Beneficiaries</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingActivity(act)}
                          className="text-xs text-emerald-700 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete activity?')) {
                              storageService.deleteActivity(act.id);
                              triggerToast('Activity deleted');
                            }
                          }}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 6: GALLERY CRUD */}
        {/* ========================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                  Photo Gallery Media
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage categorized photographs shown across the public gallery and homepage.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingGallery({
                    id: 'gal-' + Date.now(),
                    title: 'New Field Photograph',
                    category: 'Education',
                    imageUrl: presetPhotos[0].url,
                    location: 'Delhi-NCR, India',
                    date: new Date().toISOString().slice(0, 10),
                  })
                }
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>

            {editingGallery && (
              <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#0f2850]">
                    Add / Edit Photograph
                  </h3>
                  <button
                    onClick={() => setEditingGallery(null)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Caption / Title</label>
                    <input
                      type="text"
                      value={editingGallery.title}
                      onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Category</label>
                    <select
                      value={editingGallery.category}
                      onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Environment">Environment</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Community Work">Community Work</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Location</label>
                    <input
                      type="text"
                      value={editingGallery.location}
                      onChange={(e) => setEditingGallery({ ...editingGallery, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      value={editingGallery.date}
                      onChange={(e) => setEditingGallery({ ...editingGallery, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingGallery.imageUrl}
                      onChange={(e) => setEditingGallery({ ...editingGallery, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {presetPhotos.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditingGallery({ ...editingGallery, imageUrl: p.url })}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-[10px] text-slate-700 border border-slate-200"
                        >
                          Use {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setEditingGallery(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!editingGallery.title.trim()) return;
                      storageService.saveGalleryItem(editingGallery);
                      setEditingGallery(null);
                      triggerToast('Photo saved to gallery');
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Photo</span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="h-36 bg-slate-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-[#0f2850] text-white text-[9px] px-1.5 py-0.5 rounded font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3">
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h5>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.location} • {item.date}</div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setEditingGallery(item)}
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete photo?')) {
                            storageService.deleteGalleryItem(item.id);
                            triggerToast('Photo removed');
                          }
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 7: BOARD & TRUSTEES */}
        {/* ========================================================== */}
        {activeTab === 'board' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                  Board of Trustees & Leadership
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage trustee profiles displayed on the About Us page.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingBoard({
                    id: 'bm-' + Date.now(),
                    name: '',
                    role: 'Trustee',
                    qualification: '',
                    bio: '',
                    imageUrl: '',
                  })
                }
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Trustee</span>
              </button>
            </div>

            {editingBoard && (
              <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-lg space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#0f2850]">
                    Trustee Profile
                  </h3>
                  <button onClick={() => setEditingBoard(null)} className="text-slate-500">Cancel</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Name*</label>
                    <input
                      type="text"
                      value={editingBoard.name}
                      onChange={(e) => setEditingBoard({ ...editingBoard, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={editingBoard.role}
                      onChange={(e) => setEditingBoard({ ...editingBoard, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Academic & Professional Qualifications</label>
                    <input
                      type="text"
                      value={editingBoard.qualification}
                      onChange={(e) => setEditingBoard({ ...editingBoard, qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Short Biography</label>
                    <textarea
                      rows={3}
                      value={editingBoard.bio}
                      onChange={(e) => setEditingBoard({ ...editingBoard, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Photo URL (Optional)</label>
                    <input
                      type="text"
                      value={editingBoard.imageUrl}
                      onChange={(e) => setEditingBoard({ ...editingBoard, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button onClick={() => setEditingBoard(null)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button
                    onClick={() => {
                      if (!editingBoard.name.trim()) return;
                      storageService.saveBoardMember(editingBoard);
                      setEditingBoard(null);
                      triggerToast('Trustee saved');
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
                  >
                    Save Trustee
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {boardMembers.map((member) => (
                <div key={member.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#0f2850]">{member.name}</h4>
                    <div className="text-xs font-semibold text-emerald-700">{member.role}</div>
                    <div className="text-[11px] text-slate-500 italic mt-0.5">{member.qualification}</div>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">{member.bio}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setEditingBoard(member)}
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete member?')) {
                          storageService.deleteBoardMember(member.id);
                          triggerToast('Trustee removed');
                        }
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 8: DONATIONS & 80G RECEIPTS */}
        {/* ========================================================== */}
        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                  Donation Ledger & Statutory 80G Receipts
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  View all donor records, PAN details, transaction hashes, and print instant Form 10BE compliant certificates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">
                  Total Collected: <strong className="font-mono text-emerald-800 text-sm">₹{totalRaised.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-[#0f2850] text-white uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-5 py-3">Receipt No.</th>
                      <th className="px-5 py-3">Donor Name</th>
                      <th className="px-5 py-3">PAN Number</th>
                      <th className="px-5 py-3">Amount (₹)</th>
                      <th className="px-5 py-3">Payment Method</th>
                      <th className="px-5 py-3">Cause Allocation</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3 text-right">80G Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{d.receiptNumber}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-900">{d.donorName}</td>
                        <td className="px-5 py-3.5 font-mono font-bold text-emerald-800 bg-emerald-50/50 px-2 py-0.5 rounded">
                          {d.donorPan}
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-[#0f2850]">
                          ₹{d.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{d.paymentMethod}</td>
                        <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate" title={d.projectName}>
                          {d.projectName || 'General Fund'}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">{d.date}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setViewingReceiptDonation(d)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300 text-[11px] cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View / Print 80G</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 9: INQUIRIES */}
        {/* ========================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                Contact Inquiries & CSR Queries
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Submissions from the Contact Us page. Update resolution status as you contact citizens.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-base text-[#0f2850]">{inq.subject}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        From: <strong className="text-slate-800">{inq.name}</strong> • Phone: <a href={`tel:${inq.phone}`} className="text-emerald-700 underline">{inq.phone}</a> • Email: <a href={`mailto:${inq.email}`} className="text-emerald-700 underline">{inq.email}</a> • Received: {inq.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Status:</span>
                      <select
                        value={inq.status}
                        onChange={(e) => {
                          storageService.updateInquiryStatus(inq.id, e.target.value as any);
                          triggerToast('Inquiry status updated');
                        }}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border ${
                          inq.status === 'New'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : inq.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-900 border-blue-300'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line">
                    {inq.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 10: CMS PAGE CONTENT */}
        {/* ========================================================== */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                  Legal & CMS Page Content
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Edit the full legal text for Terms & Conditions, Refund Policy, and About Us narrative.
                </p>
              </div>

              <button
                onClick={() => {
                  storageService.updatePageContent(pageContent);
                  triggerToast('Content updated successfully');
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save All Text</span>
              </button>
            </div>

            <div className="space-y-6 text-xs">
              <div>
                <label className="block text-sm font-serif font-bold text-[#0f2850] mb-1">
                  About Us: Foundation Genesis & Story
                </label>
                <textarea
                  rows={6}
                  value={pageContent.aboutStory}
                  onChange={(e) => setPageContent({ ...pageContent, aboutStory: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-serif font-bold text-[#0f2850] mb-1">
                    About Us: Vision
                  </label>
                  <textarea
                    rows={3}
                    value={pageContent.aboutVision}
                    onChange={(e) => setPageContent({ ...pageContent, aboutVision: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-serif font-bold text-[#0f2850] mb-1">
                    About Us: Mission
                  </label>
                  <textarea
                    rows={3}
                    value={pageContent.aboutMission}
                    onChange={(e) => setPageContent({ ...pageContent, aboutMission: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-serif font-bold text-[#0f2850] mb-1">
                  Terms & Conditions Official Clauses
                </label>
                <textarea
                  rows={8}
                  value={pageContent.termsContent}
                  onChange={(e) => setPageContent({ ...pageContent, termsContent: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-sm font-serif font-bold text-[#0f2850] mb-1">
                  Donation Refund & Cancellation Policy Clauses
                </label>
                <textarea
                  rows={8}
                  value={pageContent.refundContent}
                  onChange={(e) => setPageContent({ ...pageContent, refundContent: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 11: DATABASE - MYSQL TOOLS */}
        {/* ========================================================== */}
        {activeTab === 'mysql' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#0f2850]">
                      MySQL Database Hub & Exporter
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Production MySQL 8.0 / MariaDB schema and live data dump export.
                    </p>
                  </div>
                </div>

                <button
                  onClick={downloadMysqlDumpFile}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full .sql Dump</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Database Name</span>
                  <span className="font-mono font-bold text-sm text-[#0f2850] mt-1 block">
                    moral_mission_db
                  </span>
                  <span className="text-[10px] text-slate-500">utf8mb4_unicode_ci</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Database Engine</span>
                  <span className="font-mono font-bold text-sm text-emerald-800 mt-1 block">
                    InnoDB (ACID Compliant)
                  </span>
                  <span className="text-[10px] text-slate-500">Foreign Keys & Transactions</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Tables Created</span>
                  <span className="font-mono font-bold text-sm text-[#0f2850] mt-1 block">
                    8 Relational Tables
                  </span>
                  <span className="text-[10px] text-slate-500">Projects, Donations, Inquiries...</span>
                </div>
              </div>

              {/* Deployment Instructions for user */}
              <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-950 text-xs space-y-2">
                <div className="font-bold text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>How to Import into your MySQL / phpMyAdmin / cPanel Server:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>Click <strong>&quot;Download Full .sql Dump&quot;</strong> above to get the latest database file.</li>
                  <li>Log in to your hosting cPanel or phpMyAdmin on your domain (e.g. Hostinger, Bluehost, AWS RDS).</li>
                  <li>Create a database named <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">moral_mission_db</code>.</li>
                  <li>Go to the <strong>Import</strong> tab in phpMyAdmin, select your downloaded <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">moral_mission_foundation_dump.sql</code>, and click <strong>Go</strong>.</li>
                  <li>All 8 tables, site settings, 80G tax records, and projects will be instantly populated!</li>
                </ol>
              </div>

              {/* Live SQL Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Live SQL Dump Preview (Real-Time Generated)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateMysqlDump());
                      triggerToast('SQL script copied to clipboard');
                    }}
                    className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL to Clipboard</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto overflow-x-auto border border-slate-800">
                  {generateMysqlDump()}
                </pre>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* 80G Printable Receipt Modal when clicked */}
      {viewingReceiptDonation && (
        <Receipt80GModal
          donation={viewingReceiptDonation}
          settings={settings}
          onClose={() => setViewingReceiptDonation(null)}
        />
      )}
    </div>
  );
};
