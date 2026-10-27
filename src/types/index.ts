export interface MasterBannerConfig {
  title: string;
  subtitle: string;
  bgImage: string;
  breadcrumb?: string;
  badge?: string;
}

export interface SiteSettings {
  orgName: string;
  orgHindiName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  altPhone: string;
  whatsapp: string;
  email: string;
  donationEmail: string;
  registeredAddress: string;
  workOfficeAddress: string;
  // Indian NGO Legal Registrations
  darpanId: string;
  registrationNumber: string;
  section12A: string;
  section80G: string;
  csrNumber: string;
  panNumber: string;
  // Indian Banking & UPI Details
  beneficiaryName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
  upiQrNote: string;
  // Page Master Banners
  banners: {
    home: MasterBannerConfig;
    about: MasterBannerConfig;
    projects: MasterBannerConfig;
    activities: MasterBannerConfig;
    gallery: MasterBannerConfig;
    donate: MasterBannerConfig;
    contact: MasterBannerConfig;
    terms: MasterBannerConfig;
    refund: MasterBannerConfig;
  };
}

export interface Project {
  id: string;
  title: string;
  category: 'Education' | 'Healthcare' | 'Nutrition' | 'Environment' | 'Women Empowerment' | 'Disaster Relief';
  shortDesc: string;
  fullDesc: string;
  targetAmount: number;
  raisedAmount: number;
  donorsCount: number;
  beneficiaries: string;
  location: string;
  imageUrl: string;
  status: 'Active' | 'Urgent' | 'Completed';
  startDate: string;
  featured: boolean;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  volunteersCount: number;
  beneficiariesCount: number;
  summary: string;
  details: string;
  imageUrl: string;
  additionalImages?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Education' | 'Healthcare' | 'Nutrition' | 'Environment' | 'Women Empowerment' | 'Community Work';
  imageUrl: string;
  location: string;
  date: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  qualification: string;
  bio: string;
  imageUrl: string;
}

export interface DonationRecord {
  id: string;
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorPan: string;
  donorAddress: string;
  donorState: string;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer (NEFT/RTGS)' | 'Credit/Debit Card' | 'Cheque';
  transactionId: string;
  projectId?: string;
  projectName?: string;
  date: string;
  status: 'Completed' | 'Pending Verification';
  taxExemptionClaimed: boolean;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'In Progress' | 'Resolved';
}

export interface PageContent {
  aboutStory: string;
  aboutVision: string;
  aboutMission: string;
  termsContent: string;
  refundContent: string;
}

export type ActivePage =
  | 'home'
  | 'about'
  | 'projects'
  | 'activities'
  | 'gallery'
  | 'donate'
  | 'contact'
  | 'terms'
  | 'refund'
  | 'admin';
