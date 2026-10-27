import {
  SiteSettings,
  Project,
  Activity,
  GalleryItem,
  BoardMember,
  DonationRecord,
  ContactInquiry,
  PageContent,
} from '../types';
import {
  initialSiteSettings,
  initialProjects,
  initialActivities,
  initialGallery,
  initialBoardMembers,
  initialDonations,
  initialInquiries,
  initialPageContent,
} from '../data/initialData';

const KEYS = {
  SETTINGS: 'mmf_site_settings',
  PROJECTS: 'mmf_projects',
  ACTIVITIES: 'mmf_activities',
  GALLERY: 'mmf_gallery',
  BOARD: 'mmf_board_members',
  DONATIONS: 'mmf_donations',
  INQUIRIES: 'mmf_inquiries',
  CONTENT: 'mmf_page_content',
  AUTH: 'mmf_admin_auth',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Listener notification error', e);
    }
  });
}

function getItem<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val);
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage, using fallback:`, err);
    return fallback;
  }
}

let syncTimeout: any = null;

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();

    // Trigger server-side persistent sync (MySQL / Server)
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      storageService.pushToServer().catch((err) => {
        // Quiet fallback in client-only environments
        console.debug('Background server sync status:', err);
      });
    }, 400);
  } catch (err) {
    console.error(`Error writing key ${key} to localStorage:`, err);
  }
}

export const storageService = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // Pull latest data from Backend / MySQL
  async pullFromServer(): Promise<boolean> {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) return false;
      const data = await res.json();
      if (data) {
        if (data.settings) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings));
        if (data.projects) localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data.projects));
        if (data.activities) localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(data.activities));
        if (data.gallery) localStorage.setItem(KEYS.GALLERY, JSON.stringify(data.gallery));
        if (data.boardMembers) localStorage.setItem(KEYS.BOARD, JSON.stringify(data.boardMembers));
        if (data.donations) localStorage.setItem(KEYS.DONATIONS, JSON.stringify(data.donations));
        if (data.inquiries) localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(data.inquiries));
        if (data.pageContent) localStorage.setItem(KEYS.CONTENT, JSON.stringify(data.pageContent));
        notify();
        return true;
      }
    } catch (e) {
      // Local fallback
    }
    return false;
  },

  // Push all current client data to Backend / MySQL
  async pushToServer(): Promise<boolean> {
    try {
      const payload = {
        settings: this.getSettings(),
        projects: this.getProjects(),
        activities: this.getActivities(),
        gallery: this.getGallery(),
        boardMembers: this.getBoardMembers(),
        donations: this.getDonations(),
        inquiries: this.getInquiries(),
        pageContent: this.getPageContent(),
      };
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Check Database / MySQL Connection status from server
  async getDbStatus(): Promise<any> {
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return {
      mode: 'local_storage',
      isConnectedToMysql: false,
      message: 'Running in browser localStorage mode',
    };
  },

  // Connect to Hostinger MySQL live from dashboard
  async connectMysql(config: { host: string; port?: number; user: string; password?: string; database: string }): Promise<any> {
    try {
      const res = await fetch('/api/db/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Network request failed' };
    }
  },

  // Re-seed or create tables in MySQL
  async initMysqlTables(): Promise<any> {
    try {
      const res = await fetch('/api/db/init-tables', { method: 'POST' });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // Site Settings & Banners
  getSettings(): SiteSettings {
    const saved = getItem<SiteSettings>(KEYS.SETTINGS, initialSiteSettings);
    return {
      ...initialSiteSettings,
      ...saved,
      banners: {
        ...initialSiteSettings.banners,
        ...(saved?.banners || {}),
      },
    };
  },
  updateSettings(settings: SiteSettings): void {
    setItem(KEYS.SETTINGS, settings);
  },

  // Projects
  getProjects(): Project[] {
    return getItem<Project[]>(KEYS.PROJECTS, initialProjects);
  },
  saveProject(project: Project): void {
    const current = this.getProjects();
    const index = current.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      current[index] = project;
    } else {
      current.unshift(project);
    }
    setItem(KEYS.PROJECTS, current);
  },
  deleteProject(id: string): void {
    const filtered = this.getProjects().filter((p) => p.id !== id);
    setItem(KEYS.PROJECTS, filtered);
  },

  // Activities
  getActivities(): Activity[] {
    return getItem<Activity[]>(KEYS.ACTIVITIES, initialActivities);
  },
  saveActivity(activity: Activity): void {
    const current = this.getActivities();
    const index = current.findIndex((a) => a.id === activity.id);
    if (index >= 0) {
      current[index] = activity;
    } else {
      current.unshift(activity);
    }
    setItem(KEYS.ACTIVITIES, current);
  },
  deleteActivity(id: string): void {
    const filtered = this.getActivities().filter((a) => a.id !== id);
    setItem(KEYS.ACTIVITIES, filtered);
  },

  // Gallery
  getGallery(): GalleryItem[] {
    return getItem<GalleryItem[]>(KEYS.GALLERY, initialGallery);
  },
  saveGalleryItem(item: GalleryItem): void {
    const current = this.getGallery();
    const index = current.findIndex((g) => g.id === item.id);
    if (index >= 0) {
      current[index] = item;
    } else {
      current.unshift(item);
    }
    setItem(KEYS.GALLERY, current);
  },
  deleteGalleryItem(id: string): void {
    const filtered = this.getGallery().filter((g) => g.id !== id);
    setItem(KEYS.GALLERY, filtered);
  },

  // Board Members
  getBoardMembers(): BoardMember[] {
    return getItem<BoardMember[]>(KEYS.BOARD, initialBoardMembers);
  },
  saveBoardMember(member: BoardMember): void {
    const current = this.getBoardMembers();
    const index = current.findIndex((m) => m.id === member.id);
    if (index >= 0) {
      current[index] = member;
    } else {
      current.push(member);
    }
    setItem(KEYS.BOARD, current);
  },
  deleteBoardMember(id: string): void {
    const filtered = this.getBoardMembers().filter((m) => m.id !== id);
    setItem(KEYS.BOARD, filtered);
  },

  // Donations
  getDonations(): DonationRecord[] {
    return getItem<DonationRecord[]>(KEYS.DONATIONS, initialDonations);
  },
  addDonation(donation: DonationRecord): void {
    const current = this.getDonations();
    current.unshift(donation);
    setItem(KEYS.DONATIONS, current);

    // If tied to a project, increment raised amount and donor count
    if (donation.projectId) {
      const projects = this.getProjects();
      const proj = projects.find((p) => p.id === donation.projectId);
      if (proj) {
        proj.raisedAmount += donation.amount;
        proj.donorsCount += 1;
        this.saveProject(proj);
      }
    }
  },

  // Inquiries
  getInquiries(): ContactInquiry[] {
    return getItem<ContactInquiry[]>(KEYS.INQUIRIES, initialInquiries);
  },
  addInquiry(inquiry: ContactInquiry): void {
    const current = this.getInquiries();
    current.unshift(inquiry);
    setItem(KEYS.INQUIRIES, current);
  },
  updateInquiryStatus(id: string, status: 'New' | 'In Progress' | 'Resolved'): void {
    const current = this.getInquiries();
    const target = current.find((i) => i.id === id);
    if (target) {
      target.status = status;
      setItem(KEYS.INQUIRIES, current);
    }
  },

  // Static CMS Page Content
  getPageContent(): PageContent {
    return getItem<PageContent>(KEYS.CONTENT, initialPageContent);
  },
  updatePageContent(content: PageContent): void {
    setItem(KEYS.CONTENT, content);
  },

  // Authentication
  isAuthenticated(): boolean {
    return localStorage.getItem(KEYS.AUTH) === 'true';
  },
  setAuthenticated(auth: boolean): void {
    if (auth) {
      localStorage.setItem(KEYS.AUTH, 'true');
    } else {
      localStorage.removeItem(KEYS.AUTH);
    }
    notify();
  },

  // Reset all to default sample data
  resetAll(): void {
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.PROJECTS);
    localStorage.removeItem(KEYS.ACTIVITIES);
    localStorage.removeItem(KEYS.GALLERY);
    localStorage.removeItem(KEYS.BOARD);
    localStorage.removeItem(KEYS.DONATIONS);
    localStorage.removeItem(KEYS.INQUIRIES);
    localStorage.removeItem(KEYS.CONTENT);
    notify();
  },
};

// Initial background sync with backend / MySQL if server is running
if (typeof window !== 'undefined') {
  storageService.pullFromServer().catch(() => {});
}
