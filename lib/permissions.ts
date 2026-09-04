export interface StaffPermissions {
  // Physical Products Catalog
  canViewProducts: boolean;
  canAddProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;

  // Digital Artworks Vault
  canViewDigital: boolean;
  canAddDigital: boolean;
  canEditDigital: boolean;
  canDeleteDigital: boolean;

  // Department / Category Whitelisting (empty or '*' means unrestricted access to all categories)
  allowedProductCategories: string[]; // e.g. ['screen-printing', 'stencil', 'batik-stamp', 'dtf_sheet', 'materials', 'laser-cutting']
  allowedDigitalCategories: string[]; // e.g. ['batik', 'vector', 'dtf', 'wall-art']

  // Tools & Modules
  canAccessBatchPrint: boolean;
  canAccessOrderForm: boolean;
  canAccessPOSInvoice: boolean;
  canAccessComplaints: boolean;
  canManageStaff: boolean; // Super Admin privilege
  canExportData: boolean;
}

export interface StaffProfile {
  id: string;
  name: string;
  username: string;
  defaultPassword: string;
  title: string;
  department: string;
  email: string;
  role: 'ceo_admin' | 'manager' | 'specialist' | 'support';
  avatarBg: string;
  initials: string;
  isActive: boolean;
  permissions: StaffPermissions;
  phone?: string;
  joinedDate?: string;
}

export const DEFAULT_FULL_PERMISSIONS: StaffPermissions = {
  canViewProducts: true,
  canAddProducts: true,
  canEditProducts: true,
  canDeleteProducts: true,
  canViewDigital: true,
  canAddDigital: true,
  canEditDigital: true,
  canDeleteDigital: true,
  allowedProductCategories: ['*'],
  allowedDigitalCategories: ['*'],
  canAccessBatchPrint: true,
  canAccessOrderForm: true,
  canAccessPOSInvoice: true,
  canAccessComplaints: true,
  canManageStaff: true,
  canExportData: true,
};

// Initial Pre-configured Team Profiles
export const INITIAL_STAFF_PROFILES: StaffProfile[] = [
  {
    id: 'staff-indrajith',
    name: 'Indrajith',
    username: 'indrajith.admin',
    defaultPassword: 'Bitium#Admin@2026',
    title: 'CEO & Admin',
    department: 'Executive & Administration',
    email: 'indrajith@bitiumtechnology.com',
    role: 'ceo_admin',
    avatarBg: 'bg-emerald-500',
    initials: 'IJ',
    isActive: true,
    joinedDate: '2024-01-01',
    permissions: {
      ...DEFAULT_FULL_PERMISSIONS,
    },
  },
  {
    id: 'staff-prasadari',
    name: 'Prasadari',
    username: 'prasadari.print',
    defaultPassword: 'Bitium#Screen@2026',
    title: 'Screen Printing & Artwork',
    department: 'Screen Printing Department',
    email: 'prasadari@bitiumtechnology.com',
    role: 'specialist',
    avatarBg: 'bg-blue-500',
    initials: 'PS',
    isActive: true,
    joinedDate: '2024-02-15',
    permissions: {
      canViewProducts: true,
      canAddProducts: true,
      canEditProducts: true,
      canDeleteProducts: false,
      canViewDigital: true,
      canAddDigital: true,
      canEditDigital: true,
      canDeleteDigital: false,
      allowedProductCategories: ['screen-printing', 'materials'],
      allowedDigitalCategories: ['vector', 'batik', 'wall-art', 'dtf'],
      canAccessBatchPrint: true,
      canAccessOrderForm: true,
      canAccessPOSInvoice: false,
      canAccessComplaints: false,
      canManageStaff: false,
      canExportData: false,
    },
  },
  {
    id: 'staff-nadeeka',
    name: 'Nadeeka',
    username: 'nadeeka.stencil',
    defaultPassword: 'Bitium#Stencil@2026',
    title: 'Stencils & Hand Painting',
    department: 'Stencils & Handcraft Department',
    email: 'nadeeka@bitiumtechnology.com',
    role: 'specialist',
    avatarBg: 'bg-amber-500',
    initials: 'ND',
    isActive: true,
    joinedDate: '2024-03-01',
    permissions: {
      canViewProducts: true,
      canAddProducts: true,
      canEditProducts: true,
      canDeleteProducts: false,
      canViewDigital: true,
      canAddDigital: true,
      canEditDigital: true,
      canDeleteDigital: false,
      allowedProductCategories: ['stencil', 'materials'],
      allowedDigitalCategories: ['vector', 'wall-art'],
      canAccessBatchPrint: true,
      canAccessOrderForm: true,
      canAccessPOSInvoice: false,
      canAccessComplaints: false,
      canManageStaff: false,
      canExportData: false,
    },
  },
  {
    id: 'staff-dinithi',
    name: 'Dinithi',
    username: 'dinithi.batik',
    defaultPassword: 'Bitium#Batik@2026',
    title: 'Cap Batik & Other',
    department: 'Batik & Custom Crafts',
    email: 'dinithi@bitiumtechnology.com',
    role: 'specialist',
    avatarBg: 'bg-purple-500',
    initials: 'DN',
    isActive: true,
    joinedDate: '2024-03-10',
    permissions: {
      canViewProducts: true,
      canAddProducts: true,
      canEditProducts: true,
      canDeleteProducts: false,
      canViewDigital: true,
      canAddDigital: true,
      canEditDigital: true,
      canDeleteDigital: false,
      allowedProductCategories: ['batik-stamp', 'materials', 'laser-cutting'],
      allowedDigitalCategories: ['batik', 'vector'],
      canAccessBatchPrint: true,
      canAccessOrderForm: true,
      canAccessPOSInvoice: false,
      canAccessComplaints: false,
      canManageStaff: false,
      canExportData: false,
    },
  },
  {
    id: 'staff-dilrukshi',
    name: 'Dilrukshi',
    username: 'dilrukshi.support',
    defaultPassword: 'Bitium#Support@2026',
    title: 'Customer Complaints & Inquiries',
    department: 'Customer Service & Resolution',
    email: 'dilrukshi@bitiumtechnology.com',
    role: 'support',
    avatarBg: 'bg-rose-500',
    initials: 'DL',
    isActive: true,
    joinedDate: '2024-04-01',
    permissions: {
      canViewProducts: true,
      canAddProducts: false,
      canEditProducts: false,
      canDeleteProducts: false,
      canViewDigital: true,
      canAddDigital: false,
      canEditDigital: false,
      canDeleteDigital: false,
      allowedProductCategories: ['*'],
      allowedDigitalCategories: ['*'],
      canAccessBatchPrint: false,
      canAccessOrderForm: true,
      canAccessPOSInvoice: true,
      canAccessComplaints: true,
      canManageStaff: false,
      canExportData: true,
    },
  },
];

const LOCAL_STORAGE_KEY = 'bitium_admin_staff_profiles_v1';
const ACTIVE_STAFF_KEY = 'bitium_admin_active_staff_id_v1';

// Load staff profiles from local storage (or fallback to INITIAL_STAFF_PROFILES)
export function getSavedStaffProfiles(): StaffProfile[] {
  if (typeof window === 'undefined') {
    return INITIAL_STAFF_PROFILES;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse staff profiles from storage:', e);
  }
  return INITIAL_STAFF_PROFILES;
}

// Save staff profiles to local storage
export function saveStaffProfiles(profiles: StaffProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save staff profiles:', e);
  }
}

// Get the active operator staff profile
export function getActiveStaffProfile(profiles: StaffProfile[]): StaffProfile {
  if (typeof window === 'undefined') {
    return profiles[0] || INITIAL_STAFF_PROFILES[0];
  }
  try {
    const activeId = localStorage.getItem(ACTIVE_STAFF_KEY);
    if (activeId) {
      const found = profiles.find((p) => p.id === activeId);
      if (found) return found;
    }
  } catch (e) {
    console.error('Failed to get active staff ID:', e);
  }
  return profiles[0] || INITIAL_STAFF_PROFILES[0];
}

// Set active staff profile
export function setActiveStaffProfileId(staffId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_STAFF_KEY, staffId);
  } catch (e) {
    console.error('Failed to set active staff ID:', e);
  }
}

// Helper: Check if staff profile has category access
export function canAccessProductCategory(staff: StaffProfile, category: string): boolean {
  if (!staff.permissions.canViewProducts) return false;
  if (!staff.permissions.allowedProductCategories || staff.permissions.allowedProductCategories.includes('*')) return true;
  return staff.permissions.allowedProductCategories.includes(category);
}

export function canAccessDigitalCategory(staff: StaffProfile, category: string): boolean {
  if (!staff.permissions.canViewDigital) return false;
  if (!staff.permissions.allowedDigitalCategories || staff.permissions.allowedDigitalCategories.includes('*')) return true;
  return staff.permissions.allowedDigitalCategories.includes(category);
}
