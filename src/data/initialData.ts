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

export const initialSiteSettings: SiteSettings = {
  orgName: 'Moral Mission Foundation',
  orgHindiName: 'नैतिक मिशन फाउंडेशन',
  tagline: 'Empowering Underprivileged Lives with Integrity, Compassion & Sustainable Action',
  logoUrl: '', // Will render an elegant high-trust SVG emblem if empty or custom image if provided
  phone: '+91 98712 34567',
  altPhone: '+91 11 4567 8900',
  whatsapp: '+91 98712 34567',
  email: 'info@moralmission.org',
  donationEmail: 'donations@moralmission.org',
  registeredAddress: 'Plot No. 42, Institutional Area, Sector 32, Gurugram, NCR, Delhi - 122001, India',
  workOfficeAddress: 'Moral Mission Bhavan, 14 Barakhamba Road, Connaught Place, New Delhi - 110001, India',
  darpanId: 'DL/2021/0284719',
  registrationNumber: 'REG/DL/SOC/2019/5491',
  section12A: 'AACTM8901RE20218',
  section80G: 'AACTM8901RF20224',
  csrNumber: 'CSR00041892',
  panNumber: 'AACTM8901R',
  beneficiaryName: 'MORAL MISSION FOUNDATION',
  bankName: 'State Bank of India (SBI)',
  accountNumber: '419802345671',
  ifscCode: 'SBIN0004521',
  branchName: 'Parliament Street Main Branch, New Delhi',
  upiId: 'moralmission@sbi',
  upiQrNote: 'Scan & Pay directly via Google Pay, PhonePe, Paytm, BHIM UPI. All donations are 50% tax-exempt under Section 80G.',
  banners: {
    home: {
      title: 'Dedicated to Serving Humanity with Moral Purpose',
      subtitle: 'Join hands with Moral Mission Foundation to provide education to destitute children, healthcare to rural families, and nourishment to the vulnerable across India.',
      bgImage: '/src/assets/images/hero_ngo_education_1792839133429.jpg',
      badge: 'Certified Indian NGO • 80G Tax Exemption Available',
      breadcrumb: 'Home',
    },
    about: {
      title: 'About Moral Mission Foundation',
      subtitle: 'Learn about our roots, our mission of selfless seva, governance ethics, and our unwavering commitment to uplifting communities in India.',
      bgImage: '/src/assets/images/ngo_health_camp_1792839136060.jpg',
      breadcrumb: 'Home / About Us',
    },
    projects: {
      title: 'Our Flagship Projects',
      subtitle: 'Targeted humanitarian initiatives creating lasting generational impact in child education, hunger eradication, healthcare, and women skill training.',
      bgImage: '/src/assets/images/ngo_food_distribution_1792839134126.jpg',
      breadcrumb: 'Home / Our Projects',
    },
    activities: {
      title: 'Ground Work & Activities',
      subtitle: 'Transparent, real-time photographic documentation of our recent relief camps, distribution drives, and community interventions.',
      bgImage: '/src/assets/images/ngo_tree_plantation_1792839135677.jpg',
      breadcrumb: 'Home / Our Activities',
    },
    gallery: {
      title: 'Moments of Hope & Transformation',
      subtitle: 'Visual journey capturing the smiles, courage, and real-life stories from our field missions across Indian states.',
      bgImage: '/src/assets/images/ngo_women_empowerment_1792839135528.jpg',
      breadcrumb: 'Home / Gallery',
    },
    donate: {
      title: 'Make a Difference Today - Donate Now',
      subtitle: 'Your kindness feeds hungry souls, sends a child to school, and saves lives. Instant 80G tax exemption receipt provided with Indian PAN.',
      bgImage: '/src/assets/images/hero_ngo_education_1792839133429.jpg',
      breadcrumb: 'Home / Donate Now',
    },
    contact: {
      title: 'Contact Moral Mission Foundation',
      subtitle: 'We are here to answer your queries, collaborate on CSR partnerships, welcome volunteers, and support donor inquiries.',
      bgImage: '/src/assets/images/ngo_health_camp_1792839136060.jpg',
      breadcrumb: 'Home / Contact Us',
    },
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Legal framework, governance guidelines, donor rights, and policies governing the Moral Mission Foundation digital portal.',
      bgImage: '/src/assets/images/ngo_tree_plantation_1792839135677.jpg',
      breadcrumb: 'Home / Terms & Conditions',
    },
    refund: {
      title: 'Donation Refund & Cancellation Policy',
      subtitle: 'Transparent guidelines regarding voluntary donation processing, clerical errors, and refund eligibility under Indian Non-Profit regulations.',
      bgImage: '/src/assets/images/ngo_food_distribution_1792839134126.jpg',
      breadcrumb: 'Home / Refund Policy',
    },
  },
};

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Mission Shiksha: Free Quality Education for Slum Children',
    category: 'Education',
    shortDesc: 'Providing school admission fees, uniforms, digital learning tablets, and daily nutrition to 1,200 children living in urban slums.',
    fullDesc: 'Education is the sole instrument that can decisively break the vicious cycle of inter-generational poverty. Under Mission Shiksha, Moral Mission Foundation runs 8 after-school remedial learning centers across Delhi-NCR and Haryana slums. We ensure foundational literacy, numeracy, and digital skills while providing balanced afternoon nutrition so kids never drop out due to hunger.',
    targetAmount: 1800000,
    raisedAmount: 1425000,
    donorsCount: 384,
    beneficiaries: '1,200 Underprivileged Children',
    location: 'Gurugram & East Delhi, India',
    imageUrl: '/src/assets/images/hero_ngo_education_1792839133429.jpg',
    status: 'Active',
    startDate: '2023-04-10',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'Annapurna Seva: Nutritious Meal & Ration Kits for Needy',
    category: 'Nutrition',
    shortDesc: 'Daily cooked nutritious hot meals and monthly dry ration kits distributed to destitute elderly citizens and daily-wage migrant families.',
    fullDesc: 'No human being should sleep hungry on the sidewalks or rural hinterlands. Our Annapurna mobile kitchens prepare hygienic, freshly cooked khichdi, dal, roti, and vegetable meals daily. In addition, monthly family dry ration kits (containing 10kg Atta, 5kg Rice, 2kg Dal, 1L Cooking Oil, Spices, and Haldi) are handed directly to verified impoverished households.',
    targetAmount: 2500000,
    raisedAmount: 2180000,
    donorsCount: 612,
    beneficiaries: '45,000+ Meals Monthly',
    location: 'Rural Mewat & Outer Delhi, India',
    imageUrl: '/src/assets/images/ngo_food_distribution_1792839134126.jpg',
    status: 'Urgent',
    startDate: '2022-09-01',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Sanjeevani: Mobile Rural Health Clinics & Medicine Distribution',
    category: 'Healthcare',
    shortDesc: 'Bringing specialized doctors, diagnostic blood tests, free prescription medicines, and eye checkups to remote villages.',
    fullDesc: 'Millions of rural citizens live hours away from primary healthcare centers. Sanjeevani deploys fully-equipped medical vans with MBBS doctors and nurses to conduct bi-weekly health camps in underserved villages. Free diabetes, hypertension, and vision screening is accompanied by 100% free generic medicines.',
    targetAmount: 1500000,
    raisedAmount: 980000,
    donorsCount: 247,
    beneficiaries: '8,500+ Patients Treated',
    location: 'Nuh & Palwal Districts, Haryana',
    imageUrl: '/src/assets/images/ngo_health_camp_1792839136060.jpg',
    status: 'Active',
    startDate: '2023-01-15',
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'Swavalamban: Vocational Tailoring & Skill Center for Rural Women',
    category: 'Women Empowerment',
    shortDesc: 'Empowering marginalized women and young girls with professional tailoring, embroidery, and enterprise incubation skills.',
    fullDesc: 'Economic independence provides dignity and safety. Moral Mission Foundation established Swavalamban Skill Centers offering a 6-month certified sewing and textile course. Graduates are given toolkits and subsidized sewing machines to start home micro-enterprises or join apparel collectives.',
    targetAmount: 1200000,
    raisedAmount: 1140000,
    donorsCount: 198,
    beneficiaries: '320 Women Trained',
    location: 'Alwar Border & Faridabad, India',
    imageUrl: '/src/assets/images/ngo_women_empowerment_1792839135528.jpg',
    status: 'Active',
    startDate: '2023-06-01',
    featured: false,
  },
  {
    id: 'proj-5',
    title: 'Vriksham: Community Afforestation & Water Harvesting Drive',
    category: 'Environment',
    shortDesc: 'Planting 25,000 indigenous fruit-bearing shade trees and building community rainwater trenches to revive water tables.',
    fullDesc: 'Combating soil erosion and climate vulnerability in drought-prone rural tracts through native banyan, neem, peepal, and fruit tree sapling plantations with 3-year geo-tagged community guardianship.',
    targetAmount: 850000,
    raisedAmount: 760000,
    donorsCount: 165,
    beneficiaries: '25,000 Saplings & 12 Villages',
    location: 'Aravalli Belt, Rajasthan & Haryana',
    imageUrl: '/src/assets/images/ngo_tree_plantation_1792839135677.jpg',
    status: 'Active',
    startDate: '2023-07-20',
    featured: false,
  },
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Mega Health Checkup & Medicine Camp in Nuh Village',
    category: 'Healthcare',
    date: '2026-09-18',
    location: 'Samudayik Bhavan, Village Tauru, Haryana',
    volunteersCount: 24,
    beneficiariesCount: 680,
    summary: 'Conducted comprehensive free health checkup for 680 villagers with doctor consultations, hemoglobin testing, and distributed 3 months of essential cardiac and diabetes medicines.',
    details: 'Our team of 6 volunteer doctors (General Physicians, Pediatricians, and Gynecologists) and 18 youth volunteers arrived at 8:00 AM. In total, 680 villagers were registered, examined, and handed necessary medications without any charge. 42 severe cataract patients were identified and scheduled for sponsored surgeries.',
    imageUrl: '/src/assets/images/ngo_health_camp_1792839136060.jpg',
  },
  {
    id: 'act-2',
    title: 'Monsoon Tree Plantation Drive along Aravalli Foothills',
    category: 'Environment',
    date: '2026-08-12',
    location: 'Badshahpur Reserve Forest Area, Gurugram',
    volunteersCount: 45,
    beneficiariesCount: 1200,
    summary: 'Mobilized 45 youth volunteers and school students to plant 1,500 native Peepal, Neem, and Jamun saplings with drip water mulching.',
    details: 'Partnering with local village panchayats, our foundation carried out extensive pitting and planted saplings. Each tree has been tagged with a volunteer guardian to ensure regular watering and protective bamboo fencing.',
    imageUrl: '/src/assets/images/ngo_tree_plantation_1792839135677.jpg',
  },
  {
    id: 'act-3',
    title: 'Warm Ration & Nutritious Kit Distribution for Daily Wagers',
    category: 'Nutrition',
    date: '2026-07-04',
    location: 'Shakur Basti Railway Settlement, Delhi',
    volunteersCount: 30,
    beneficiariesCount: 850,
    summary: 'Distributed 500 complete monthly dry grocery kits and hygiene supplies to construction labor families during monsoon work slowdown.',
    details: 'Each kit weighed 22 kg containing grain, pulses, fortified mustard oil, salt, spices, soap bars, and water purification tablets. Delivered door-to-door in coordination with local field social workers.',
    imageUrl: '/src/assets/images/ngo_food_distribution_1792839134126.jpg',
  },
  {
    id: 'act-4',
    title: 'Annual Back-to-School Stationery & Uniform Distribution',
    category: 'Education',
    date: '2026-04-05',
    location: 'Moral Mission Learning Center, East Delhi',
    volunteersCount: 18,
    beneficiariesCount: 420,
    summary: 'Distributed sturdy school backpacks, notebooks, geometry boxes, shoes, and uniforms to 420 slum children starting primary school.',
    details: 'Children from families of ragpickers and rickshaw pullers were formally inducted into local municipal schools with our foundation taking full sponsorship of their school requirements.',
    imageUrl: '/src/assets/images/hero_ngo_education_1792839133429.jpg',
  },
  {
    id: 'act-5',
    title: 'Graduation Ceremony & Sewing Machine Grant for 60 Women',
    category: 'Women Empowerment',
    date: '2026-03-22',
    location: 'Swavalamban Training Hall, Faridabad',
    volunteersCount: 12,
    beneficiariesCount: 60,
    summary: 'Awarded government-recognized tailoring certificates and donated 60 brand-new industrial sewing machines to self-reliant rural artisans.',
    details: 'Over 6 months of grueling practice, these women mastered garment designing, patchwork, and stitching. Today, 45 of them already earn between ₹8,000 to ₹14,000 per month from custom village orders.',
    imageUrl: '/src/assets/images/ngo_women_empowerment_1792839135528.jpg',
  },
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Joy of Learning: Morning Math Class in East Delhi',
    category: 'Education',
    imageUrl: '/src/assets/images/hero_ngo_education_1792839133429.jpg',
    location: 'East Delhi Slum Center',
    date: '2026-09-10',
  },
  {
    id: 'gal-2',
    title: 'Serving Hot Nutritious Khichdi to Village Elders',
    category: 'Nutrition',
    imageUrl: '/src/assets/images/ngo_food_distribution_1792839134126.jpg',
    location: 'Tauru, Haryana',
    date: '2026-08-28',
  },
  {
    id: 'gal-3',
    title: 'Planting Green Hopes in the Aravalli Soil',
    category: 'Environment',
    imageUrl: '/src/assets/images/ngo_tree_plantation_1792839135677.jpg',
    location: 'Gurugram Foothills',
    date: '2026-08-15',
  },
  {
    id: 'gal-4',
    title: 'Free Diagnostic & Stethoscope Checkup by Dr. Sharma',
    category: 'Healthcare',
    imageUrl: '/src/assets/images/ngo_health_camp_1792839136060.jpg',
    location: 'Samudayik Kendra, Nuh',
    date: '2026-07-22',
  },
  {
    id: 'gal-5',
    title: 'Women Artisans Mastering Precision Tailoring Patterns',
    category: 'Women Empowerment',
    imageUrl: '/src/assets/images/ngo_women_empowerment_1792839135528.jpg',
    location: 'Faridabad Skill Center',
    date: '2026-06-30',
  },
];

export const initialBoardMembers: BoardMember[] = [
  {
    id: 'bm-1',
    name: 'Dr. Rameshwar Nath Sharma',
    role: 'Founder & President',
    qualification: 'M.A., Ph.D. (Social Ethics & Public Policy)',
    bio: 'Dedicated over 30 years to grassroots social reform, educational equity, and Gandhian moral philosophy across northern India.',
    imageUrl: '',
  },
  {
    id: 'bm-2',
    name: 'Smt. Vandana Deshmukh',
    role: 'General Secretary',
    qualification: 'M.S.W. (Tata Institute of Social Sciences)',
    bio: 'Pioneered rural women self-help collectives and nutrition awareness programs impacting over 50,000 households.',
    imageUrl: '',
  },
  {
    id: 'bm-3',
    name: 'Shri Alok Kumar Verma, FCA',
    role: 'Treasurer & Compliance Officer',
    qualification: 'Chartered Accountant (FCA, DISA)',
    bio: 'Ensures absolute financial integrity, strict statutory adherence to Section 80G/12A, and donor audit transparency.',
    imageUrl: '',
  },
  {
    id: 'bm-4',
    name: 'Dr. (Maj.) Sunita Rao (Retd.)',
    role: 'Director - Healthcare & Medical Relief',
    qualification: 'MBBS, MD (Community Medicine)',
    bio: 'Former Indian Army medical officer heading our mobile rural medical clinics and disaster emergency triage operations.',
    imageUrl: '',
  },
];

export const initialDonations: DonationRecord[] = [
  {
    id: 'don-1',
    receiptNumber: 'MMF/2026-27/0842',
    donorName: 'Rajesh Singhal',
    donorEmail: 'rajesh.singhal@example.com',
    donorPhone: '+91 98112 44556',
    donorPan: 'ABCPS1234F',
    donorAddress: 'C-4/22 Safdarjung Development Area',
    donorState: 'Delhi',
    amount: 10000,
    paymentMethod: 'UPI',
    transactionId: 'UPI-SBI-8941029412',
    projectId: 'proj-1',
    projectName: 'Mission Shiksha: Free Quality Education for Slum Children',
    date: '2026-10-14',
    status: 'Completed',
    taxExemptionClaimed: true,
  },
  {
    id: 'don-2',
    receiptNumber: 'MMF/2026-27/0843',
    donorName: 'Ananya Deshpande',
    donorEmail: 'ananya.d@example.com',
    donorPhone: '+91 94220 88912',
    donorPan: 'AYXPD8819Q',
    donorAddress: 'Flat 402, Green Glen Layout, Bellandur',
    donorState: 'Karnataka',
    amount: 5000,
    paymentMethod: 'UPI',
    transactionId: 'UPI-HDFC-9912048123',
    projectId: 'proj-2',
    projectName: 'Annapurna Seva: Nutritious Meal & Ration Kits',
    date: '2026-10-18',
    status: 'Completed',
    taxExemptionClaimed: true,
  },
  {
    id: 'don-3',
    receiptNumber: 'MMF/2026-27/0844',
    donorName: 'Mehra Logistics Pvt Ltd (CSR)',
    donorEmail: 'csr@mehralogistics.in',
    donorPhone: '+91 11 2548 9900',
    donorPan: 'AABCM4410K',
    donorAddress: 'Plot 88, Udyog Vihar Phase 4',
    donorState: 'Haryana',
    amount: 150000,
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    transactionId: 'NEFT-ICIC-294018241',
    projectId: 'proj-3',
    projectName: 'Sanjeevani: Mobile Rural Health Clinics',
    date: '2026-10-21',
    status: 'Completed',
    taxExemptionClaimed: true,
  },
];

export const initialInquiries: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Vikramaditya Roy',
    email: 'v.roy@consultancy.in',
    phone: '+91 98300 12345',
    subject: 'CSR Partnership Proposal for Skill Development Center',
    message: 'We are a mid-tier IT company looking to deploy our FY 26-27 CSR funds towards vocational centers for women. Please share your CSR-1 and audit reports.',
    date: '2026-10-22',
    status: 'New',
  },
  {
    id: 'inq-2',
    name: 'Pooja Bhatt',
    email: 'poojabhatt.delhi@gmail.com',
    phone: '+91 99100 54321',
    subject: 'Weekend Volunteering for Slum Education',
    message: 'I am a software engineer living in Gurugram. Would love to teach English and basic computer literacy to children on Saturdays.',
    date: '2026-10-20',
    status: 'In Progress',
  },
];

export const initialPageContent: PageContent = {
  aboutStory: `Moral Mission Foundation (नैतिक मिशन फाउंडेशन) was founded with a profound moral pledge: to stand shoulder-to-shoulder with the most neglected, underprivileged, and vulnerable communities across India.

Rooted in the ancient Indian ethos of 'Seva Paramo Dharma' (Selfless Service is the Highest Moral Duty) and constitutional justice, our organization operates without discrimination based on caste, creed, religion, or gender. We bridge the critical gap between compassionate donors and real, verifiable grassroots transformation.

Over the years, our initiatives have expanded from a modest single-room remedial school in the slums of Delhi to multi-state interventions spanning healthcare, hunger alleviation, women's self-reliance, and ecological restoration. We believe that true philanthropy is not mere charity—it is an investment in human dignity and collective empowerment.`,

  aboutVision: `To build an inclusive, equitable, and empowered India where every child has access to quality education, no citizen suffers from hunger or preventable disease, every woman is self-reliant, and communities live in harmony with nature.`,

  aboutMission: `To serve the underprivileged with unwavering moral integrity, absolute financial transparency, and community-centered developmental interventions that create measurable, sustainable, and generational impact across India.`,

  termsContent: `TERMS AND CONDITIONS OF USE & DONATION GOVERNANCE
Moral Mission Foundation (Registration No: REG/DL/SOC/2019/5491)

1. ACCEPTANCE OF TERMS
By accessing and using this website (moralmission.org) or contributing donations to Moral Mission Foundation, you agree to be bound by these Terms and Conditions in accordance with Indian Law.

2. DONATION INTEGRITY & TAX EXEMPTION (SECTION 80G)
All monetary contributions made to Moral Mission Foundation are voluntary non-refundable donations dedicated to charitable objectives.
Donations are eligible for 50% deduction under Section 80G of the Income Tax Act, 1961 (Registration: AACTM8901RF20224). To obtain a valid 80G Tax Exemption Certificate, the donor must mandatorily provide their valid Indian Permanent Account Number (PAN) and postal address as per Central Board of Direct Taxes (CBDT) notifications.

3. UTILIZATION OF FUNDS
Funds contributed to designated projects (e.g. Mission Shiksha, Annapurna Seva) will be deployed towards the specified charitable activity. In circumstances where an emergency relief quota is fulfilled or ground contingencies arise, the Board of Trustees reserves the authority to allocate surplus funds to allied humanitarian causes of identical nature.

4. USER CONDUCT & INTELLECTUAL PROPERTY
All photographs, text content, research reports, logos, and materials published on this portal are the intellectual property of Moral Mission Foundation or used with legal consent. Unauthorized commercial reproduction, modification, or defamation is strictly prohibited under the Indian Copyright Act, 1957.

5. GOVERNING LAW & JURISDICTION
These terms and conditions are governed by and construed under the laws of the Republic of India. Any legal dispute or controversy shall fall under the exclusive jurisdiction of the competent courts in New Delhi, India.`,

  refundContent: `DONATION REFUND & CANCELLATION POLICY
Moral Mission Foundation

1. VOLUNTARY CONTRIBUTION PRINCIPLE
As a non-profit humanitarian organization registered under Indian regulations, donations made to Moral Mission Foundation are considered irrevocable voluntary contributions directly earmarked for public charitable activities, food purchases, patient surgeries, and community welfare.

2. CLERICAL & PROCESSING ERRORS
We recognize that inadvertent errors can occasionally take place during digital transactions (such as duplicate debits, incorrect donation amounts entered due to technical typing error, or unauthorized card usage).

In such genuine instances, Moral Mission Foundation is committed to reviewing refund applications with fairness:
- Timeframe: The refund claim must be submitted in writing within 7 (seven) calendar days of the transaction timestamp.
- Application Channel: Written communication must be emailed to donations@moralmission.org along with proof of payment, transaction reference ID, donor bank statement showing debit, and written explanation.

3. CAVEATS FOR 80G TAX CERTIFICATES
Under Indian Income Tax rules, if an official Section 80G Certificate has already been generated and filed in the foundation's regulatory returns with the Income Tax Department for the financial quarter, a refund cannot be processed as the donor has legally claimed or received statutory tax relief benefit.

4. REFUND DISBURSEMENT
Once approved by our Finance & Audit Committee, refunds are credited back strictly to the original source bank account or UPI handle through standard banking channels within 7 to 10 working business days. No cash refunds are permitted under statutory financial guidelines.`,
};
