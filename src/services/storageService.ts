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

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch (err) {
    console.error(`Error writing key ${key} to localStorage:`, err);
  }
}

export const storageService = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // Site Settings & Banners
  getSettings(): SiteSettings {
    const saved = getItem<SiteSettings>(KEYS.SETTINGS, initialSiteSettings);
    // Ensure all banners exist in case new keys were added
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
