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
  passwordHash?: string;
  defaultPassword?: string;
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

export async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return password;
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

// Initial Pre-configured Team Profiles (Passwords secured via SHA-256 hash)
export const INITIAL_STAFF_PROFILES: StaffProfile[] = [
  {
    id: 'staff-indrajith',
    name: 'Indrajith',
    username: 'indrajith.admin',
    passwordHash: '44f3cfee53b1cf58eefb45badcb562ab6f39805b2883ca74d5aed8315543df85',
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
    passwordHash: 'abd7a7db820ca63666eb92e910c9dff2d1f3cd6b577913fc7da6055b857695e7',
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
    passwordHash: '87728dc433d57c9578cae0559e464c26a9815a0a424c1a0f4ca8c55b1d07b6f5',
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
    passwordHash: '7409d0eb7de84ea35828dc3ce575e6ce7d885a50a3e85f7d33c471e1e3cdb1ed',
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
    passwordHash: '211cb301262dbc8e022f11895565536b6b31a34da29a19f051eb76f32888c105',
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
  {
    id: 'staff-heshani',
    name: 'Heshani',
    username: 'heshani.dtf',
    passwordHash: '87728dc433d57c9578cae0559e464c26a9815a0a424c1a0f4ca8c55b1d07b6f5',
    title: 'DTF & Artwork',
    department: 'DTF & Digital Artwork Department',
    email: 'heshani@bitiumtechnology.com',
    role: 'specialist',
    avatarBg: 'bg-cyan-500',
    initials: 'HS',
    isActive: true,
    phone: '0753026247',
    joinedDate: '2024-05-01',
    permissions: {
      canViewProducts: true,
      canAddProducts: true,
      canEditProducts: true,
      canDeleteProducts: false,
      canViewDigital: true,
      canAddDigital: true,
      canEditDigital: true,
      canDeleteDigital: false,
      allowedProductCategories: ['dtf_sheet', 'materials', 'other'],
      allowedDigitalCategories: ['dtf', 'vector', 'batik', 'wall-art'],
      canAccessBatchPrint: true,
      canAccessOrderForm: true,
      canAccessPOSInvoice: false,
      canAccessComplaints: false,
      canManageStaff: false,
      canExportData: false,
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
        // Merge any new INITIAL_STAFF_PROFILES that are missing in localStorage
        const existingIds = new Set(parsed.map((p: any) => p.id));
        let changed = false;
        INITIAL_STAFF_PROFILES.forEach((initial) => {
          if (!existingIds.has(initial.id)) {
            parsed.push(initial);
            changed = true;
          }
        });
        if (changed) {
          saveStaffProfiles(parsed);
        }
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
