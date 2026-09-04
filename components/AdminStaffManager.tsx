'use client';

import React, { useState } from 'react';
import { 
  StaffProfile, 
  StaffPermissions, 
  DEFAULT_FULL_PERMISSIONS, 
  saveStaffProfiles, 
  setActiveStaffProfileId 
} from '@/lib/permissions';
import { 
  Shield, 
  UserCheck, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Folder, 
  Printer, 
  FileText, 
  Receipt, 
  MessageSquareWarning, 
  Settings, 
  Sliders, 
  Eye, 
  EyeOff,
  Copy,
  Plus, 
  Key,
  RefreshCw,
  Sparkles,
  Search,
  User
} from 'lucide-react';

interface AdminStaffManagerProps {
  staffProfiles: StaffProfile[];
  activeStaffId: string;
  onUpdateProfiles: (updated: StaffProfile[]) => void;
  onSwitchActiveStaff: (staffId: string) => void;
}

const PRODUCT_CATEGORIES = [
  { id: 'screen-printing', label: 'Screen Printing & Exposing' },
  { id: 'stencil', label: 'Stencils & Hand Painting' },
  { id: 'batik-stamp', label: 'Batik Stamp & Tools' },
  { id: 'dtf_sheet', label: 'DTF Transfer Sheets' },
  { id: 'materials', label: 'Inks & Raw Materials' },
  { id: 'laser-cutting', label: 'Laser Cutting Services' },
];

const DIGITAL_CATEGORIES = [
  { id: 'batik', label: 'Batik Vector Designs' },
  { id: 'vector', label: 'Vector Artwork & Logos' },
  { id: 'dtf', label: 'DTF Gangsheet Vectors' },
  { id: 'wall-art', label: 'Wall Art & Murals' },
];

export default function AdminStaffManager({
  staffProfiles,
  activeStaffId,
  onUpdateProfiles,
  onSwitchActiveStaff,
}: AdminStaffManagerProps) {
  const [profiles, setProfiles] = useState<StaffProfile[]>(staffProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  
  // Customization modal state
  const [editingPermissionsStaff, setEditingPermissionsStaff] = useState<StaffProfile | null>(null);
  const [tempPermissions, setTempPermissions] = useState<StaffPermissions | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [tempDepartment, setTempDepartment] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  // New staff modal state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffTitle, setNewStaffTitle] = useState('');
  const [newStaffDepartment, setNewStaffDepartment] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'ceo_admin' | 'manager' | 'specialist' | 'support'>('specialist');
  const [newStaffAvatarBg, setNewStaffAvatarBg] = useState('bg-blue-500');

  // Feedback notification
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label} to clipboard!`);
  };

  const togglePasswordVisibility = (staffId: string) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [staffId]: !prev[staffId],
    }));
  };

  // Sync state when props change
  React.useEffect(() => {
    setProfiles(staffProfiles);
  }, [staffProfiles]);

  const handleOpenPermissionsModal = (staff: StaffProfile) => {
    setEditingPermissionsStaff(staff);
    setTempPermissions(JSON.parse(JSON.stringify(staff.permissions)));
    setTempName(staff.name);
    setTempTitle(staff.title);
    setTempDepartment(staff.department);
    setTempEmail(staff.email);
    setTempUsername(staff.username || staff.email.split('@')[0]);
    setTempPassword(staff.defaultPassword || 'Bitium#2026');
  };

  const handleSavePermissions = () => {
    if (!editingPermissionsStaff || !tempPermissions) return;

    const updated = profiles.map((p) => {
      if (p.id === editingPermissionsStaff.id) {
        return {
          ...p,
          name: tempName.trim() || p.name,
          title: tempTitle.trim() || p.title,
          department: tempDepartment.trim() || p.department,
          email: tempEmail.trim() || p.email,
          username: tempUsername.trim() || p.username,
          defaultPassword: tempPassword.trim() || p.defaultPassword,
          permissions: tempPermissions,
        };
      }
      return p;
    });

    setProfiles(updated);
    saveStaffProfiles(updated);
    onUpdateProfiles(updated);
    triggerToast(`Profile & Permissions for ${editingPermissionsStaff.name} saved!`);
    setEditingPermissionsStaff(null);
    setTempPermissions(null);
  };

  const handleDeleteStaff = (staffId: string) => {
    const target = profiles.find((p) => p.id === staffId);
    if (!target) return;
    if (target.role === 'ceo_admin' || staffId === 'staff-indrajith') {
      alert('Primary CEO & Admin account cannot be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to delete profile for "${target.name} (${target.title})"?`)) {
      const updated = profiles.filter((p) => p.id !== staffId);
      setProfiles(updated);
      saveStaffProfiles(updated);
      onUpdateProfiles(updated);
      if (activeStaffId === staffId) {
        onSwitchActiveStaff(updated[0]?.id || 'staff-indrajith');
      }
      triggerToast(`Staff profile for ${target.name} deleted.`);
    }
  };

  const handleCreateNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffTitle.trim()) {
      alert('Please fill in both Name and Job Title.');
      return;
    }

    const initials = newStaffName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'ST';

    const newId = `staff-${Date.now()}`;
    const username = newStaffUsername.trim() || newStaffName.toLowerCase().replace(/\s+/g, '.');
    const password = newStaffPassword.trim() || `Bitium#${newStaffName.replace(/\s+/g, '')}@2026`;

    // Base initial permissions according to role
    let basePermissions: StaffPermissions = {
      canViewProducts: true,
      canAddProducts: newStaffRole === 'specialist' || newStaffRole === 'manager',
      canEditProducts: newStaffRole === 'specialist' || newStaffRole === 'manager',
      canDeleteProducts: newStaffRole === 'manager',
      canViewDigital: true,
      canAddDigital: newStaffRole === 'specialist' || newStaffRole === 'manager',
      canEditDigital: newStaffRole === 'specialist' || newStaffRole === 'manager',
      canDeleteDigital: newStaffRole === 'manager',
      allowedProductCategories: ['*'],
      allowedDigitalCategories: ['*'],
      canAccessBatchPrint: true,
      canAccessOrderForm: true,
      canAccessPOSInvoice: newStaffRole === 'support' || newStaffRole === 'manager',
      canAccessComplaints: newStaffRole === 'support',
      canManageStaff: false,
      canExportData: newStaffRole === 'manager',
    };

    if (newStaffRole === 'ceo_admin') {
      basePermissions = { ...DEFAULT_FULL_PERMISSIONS };
    }

    const newProfile: StaffProfile = {
      id: newId,
      name: newStaffName.trim(),
      username,
      defaultPassword: password,
      title: newStaffTitle.trim(),
      department: newStaffDepartment.trim() || 'General Operations',
      email: newStaffEmail.trim() || `${username}@bitiumtechnology.com`,
      role: newStaffRole,
      avatarBg: newStaffAvatarBg,
      initials,
      isActive: true,
      joinedDate: new Date().toISOString().split('T')[0],
      permissions: basePermissions,
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveStaffProfiles(updated);
    onUpdateProfiles(updated);

    // Reset Form
    setNewStaffName('');
    setNewStaffTitle('');
    setNewStaffDepartment('');
    setNewStaffEmail('');
    setNewStaffUsername('');
    setNewStaffPassword('');
    setIsAddStaffOpen(false);
    triggerToast(`New staff profile "${newProfile.name}" created successfully!`);
  };

  const toggleProductCategory = (catId: string) => {
    if (!tempPermissions) return;
    let current = [...tempPermissions.allowedProductCategories];
    if (current.includes('*')) {
      current = [catId];
    } else if (current.includes(catId)) {
      current = current.filter((c) => c !== catId);
    } else {
      current.push(catId);
    }
    setTempPermissions({
      ...tempPermissions,
      allowedProductCategories: current,
    });
  };

  const toggleDigitalCategory = (catId: string) => {
    if (!tempPermissions) return;
    let current = [...tempPermissions.allowedDigitalCategories];
    if (current.includes('*')) {
      current = [catId];
    } else if (current.includes(catId)) {
      current = current.filter((c) => c !== catId);
    } else {
      current.push(catId);
    }
    setTempPermissions({
      ...tempPermissions,
      allowedDigitalCategories: current,
    });
  };

  const filteredStaff = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.username && p.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-xl backdrop-blur-md">
          <CheckCircle2 size={18} className="text-[#2CFF05]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card/30 backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2CFF05]/10 border border-[#2CFF05]/20 rounded-full px-3.5 py-1 mb-2">
            <Shield size={12} className="text-[#2CFF05]" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2CFF05]">
              Role-Based Access Control (RBAC)
            </span>
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight uppercase flex items-center gap-2">
            Staff Profiles & <span className="text-[#2CFF05]">Permissions</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Manage usernames, passwords, category scoping, and granular Add, Edit, Delete permissions for Indrajith, Prasadari, Nadeeka, Dinithi, Dilrukshi, and team members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="text"
              placeholder="Search team or usernames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors w-52 sm:w-64"
            />
          </div>

          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] text-[#0a0a0a] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/20 transition-all hover:scale-105 cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Add Team Profile</span>
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((staff) => {
          const isCurrentlyActive = staff.id === activeStaffId;
          const isCeo = staff.role === 'ceo_admin';
          const isPasswordVisible = showPasswordMap[staff.id] ?? false;

          return (
            <div
              key={staff.id}
              className={`rounded-3xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isCurrentlyActive
                  ? 'border-[#2CFF05] bg-gradient-to-b from-[#2CFF05]/10 via-card/50 to-card/70 shadow-xl shadow-[#2CFF05]/10'
                  : 'border-border bg-card/25 hover:border-zinc-700 hover:bg-card/40'
              }`}
            >
              {/* Top Card Header */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div
                      className={`w-13 h-13 rounded-2xl ${staff.avatarBg || 'bg-emerald-500'} flex items-center justify-center text-white font-black text-lg shadow-md shrink-0`}
                    >
                      {staff.initials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-foreground tracking-tight">
                          {staff.name}
                        </h3>
                        {isCurrentlyActive && (
                          <span className="bg-[#2CFF05] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                            Active Operator
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[#2CFF05] mt-0.5">{staff.title}</p>
                      <p className="text-[10px] text-muted-foreground">{staff.department}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                      isCeo
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : staff.role === 'support'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    }`}
                  >
                    {isCeo ? 'Super Admin' : staff.role === 'support' ? 'Support' : 'Specialist'}
                  </span>
                </div>

                {/* Login Credentials Box */}
                <div className="p-3 rounded-2xl bg-background/60 border border-border/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Key size={12} className="text-[#2CFF05]" /> Login Credentials:</span>
                  </div>

                  {/* Username / Email */}
                  <div className="flex items-center justify-between bg-card/60 px-2.5 py-1.5 rounded-xl border border-border/60">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[10px] text-muted-foreground font-semibold">User:</span>
                      <span className="font-mono font-bold text-foreground text-[11px] truncate">
                        {staff.username || staff.email}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(staff.username || staff.email, 'Username')}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy Username"
                    >
                      <Copy size={12} />
                    </button>
                  </div>

                  {/* Password */}
                  <div className="flex items-center justify-between bg-card/60 px-2.5 py-1.5 rounded-xl border border-border/60">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[10px] text-muted-foreground font-semibold">Pass:</span>
                      <span className="font-mono font-bold text-foreground text-[11px] truncate">
                        {isPasswordVisible ? staff.defaultPassword : '••••••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePasswordVisibility(staff.id)}
                        className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                      >
                        {isPasswordVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(staff.defaultPassword || 'Bitium#2026', 'Password')}
                        className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy Password"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Permissions matrix quick summary */}
                <div className="space-y-2.5 pt-2 border-t border-border/60">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
                    Assigned Permissions:
                  </span>

                  {/* Physical Products Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground font-semibold mr-1 flex items-center gap-1">
                      <Package size={11} /> Products:
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        staff.permissions.canAddProducts
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-muted/40 border-border text-muted-foreground line-through opacity-60'
                      }`}
                    >
                      + Add
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        staff.permissions.canEditProducts
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-muted/40 border-border text-muted-foreground line-through opacity-60'
                      }`}
                    >
                      ✎ Edit
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        staff.permissions.canDeleteProducts
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-muted/40 border-border text-muted-foreground line-through opacity-60'
                      }`}
                    >
                      🗑 Delete
                    </span>
                  </div>

                  {/* Digital Artworks Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground font-semibold mr-1 flex items-center gap-1">
                      <Folder size={11} /> Digital:
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        staff.permissions.canAddDigital
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : 'bg-muted/40 border-border text-muted-foreground line-through opacity-60'
                      }`}
                    >
                      + Add
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        staff.permissions.canEditDigital
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : 'bg-muted/40 border-border text-muted-foreground line-through opacity-60'
                      }`}
                    >
                      ✎ Edit
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        staff.permissions.canDeleteDigital
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-muted/40 border-border text-muted-foreground line-through opacity-60'
                      }`}
                    >
                      🗑 Delete
                    </span>
                  </div>

                  {/* Category Access Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-muted-foreground font-semibold mr-1">Scope:</span>
                    {staff.permissions.allowedProductCategories.includes('*') ? (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#2CFF05]/10 text-[#2CFF05] border border-[#2CFF05]/30">
                        All Categories
                      </span>
                    ) : (
                      staff.permissions.allowedProductCategories.map((c) => (
                        <span
                          key={c}
                          className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border"
                        >
                          {c}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Tools Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {staff.permissions.canAccessBatchPrint && (
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Batch Print
                      </span>
                    )}
                    {staff.permissions.canAccessOrderForm && (
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-lime-500/10 text-lime-400 border border-lime-500/20">
                        Order Form
                      </span>
                    )}
                    {staff.permissions.canAccessPOSInvoice && (
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        POS Invoice
                      </span>
                    )}
                    {staff.permissions.canAccessComplaints && (
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Complaints
                      </span>
                    )}
                    {staff.permissions.canManageStaff && (
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Staff Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="p-4 border-t border-border/80 bg-background/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPermissionsModal(staff)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card/60 hover:bg-[#2CFF05] hover:text-black hover:border-[#2CFF05] text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Sliders size={12} />
                    <span>Edit & Permissions</span>
                  </button>

                  <button
                    onClick={() => onSwitchActiveStaff(staff.id)}
                    disabled={isCurrentlyActive}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      isCurrentlyActive
                        ? 'bg-[#2CFF05]/15 border border-[#2CFF05]/30 text-[#2CFF05] opacity-80 cursor-default'
                        : 'border border-border bg-card hover:bg-card/80 text-foreground'
                    }`}
                  >
                    <UserCheck size={12} />
                    <span>{isCurrentlyActive ? 'Current' : 'Operate As'}</span>
                  </button>
                </div>

                {!isCeo && staff.id !== 'staff-indrajith' && (
                  <button
                    onClick={() => handleDeleteStaff(staff.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
                    title="Delete Staff Profile"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── PERMISSION & PROFILE CUSTOMIZER MODAL ─── */}
      {editingPermissionsStaff && tempPermissions && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl ${editingPermissionsStaff.avatarBg || 'bg-emerald-500'} flex items-center justify-center text-white font-black text-lg shadow-md shrink-0`}
                >
                  {editingPermissionsStaff.initials}
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                    Profile & Permissions: <span className="text-[#2CFF05]">{editingPermissionsStaff.name}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Customize login credentials and departmental access rights.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingPermissionsStaff(null);
                  setTempPermissions(null);
                }}
                className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Account Credentials Editor */}
            <div className="p-4 rounded-2xl border border-border bg-background/50 space-y-3">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-wider">
                <Key size={16} className="text-[#2CFF05]" />
                <span>Operator Account & Credentials</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:border-[#2CFF05]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Job Title</label>
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:border-[#2CFF05]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Username</label>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono focus:border-[#2CFF05]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Login Password</label>
                  <input
                    type="text"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono focus:border-[#2CFF05]"
                  />
                </div>
              </div>
            </div>

            {/* Permissions Matrix Form */}
            <div className="space-y-6 text-xs">
              
              {/* 1. PHYSICAL PRODUCTS ACTIONS */}
              <div className="p-4 rounded-2xl border border-border bg-background/40 space-y-3">
                <div className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-wider">
                  <Package size={16} className="text-[#2CFF05]" />
                  <span>Physical Store Products Permissions</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { key: 'canViewProducts', label: 'View Products' },
                    { key: 'canAddProducts', label: 'Add (+ Create)' },
                    { key: 'canEditProducts', label: 'Edit & Update' },
                    { key: 'canDeleteProducts', label: 'Delete Products' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                        (tempPermissions as any)[item.key]
                          ? 'bg-[#2CFF05]/10 border-[#2CFF05]/30 text-[#2CFF05] font-bold'
                          : 'bg-card/40 border-border text-muted-foreground'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={(tempPermissions as any)[item.key]}
                        onChange={(e) =>
                          setTempPermissions({
                            ...tempPermissions,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="accent-[#2CFF05] rounded"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>

                {/* Allowed Product Categories */}
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Allowed Product Departments:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const isAll = tempPermissions.allowedProductCategories.includes('*');
                        setTempPermissions({
                          ...tempPermissions,
                          allowedProductCategories: isAll ? ['screen-printing'] : ['*'],
                        });
                      }}
                      className="text-[10px] text-[#2CFF05] hover:underline font-bold"
                    >
                      {tempPermissions.allowedProductCategories.includes('*')
                        ? 'Restrict to Specific Categories'
                        : 'Grant All Categories (*)'}
                    </button>
                  </div>

                  {tempPermissions.allowedProductCategories.includes('*') ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <Sparkles size={14} />
                      <span>Full Access: User can view and manage all product categories across the store.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRODUCT_CATEGORIES.map((cat) => {
                        const isChecked = tempPermissions.allowedProductCategories.includes(cat.id);
                        return (
                          <label
                            key={cat.id}
                            className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer select-none text-[11px] transition-all ${
                              isChecked
                                ? 'bg-card border-[#2CFF05] text-foreground font-bold'
                                : 'bg-card/25 border-border text-muted-foreground'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleProductCategory(cat.id)}
                              className="accent-[#2CFF05]"
                            />
                            <span>{cat.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. DIGITAL ARTWORKS ACTIONS */}
              <div className="p-4 rounded-2xl border border-border bg-background/40 space-y-3">
                <div className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-wider">
                  <Folder size={16} className="text-cyan-400" />
                  <span>Digital Artworks Vault Permissions</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { key: 'canViewDigital', label: 'View Artworks' },
                    { key: 'canAddDigital', label: 'Upload Artwork' },
                    { key: 'canEditDigital', label: 'Edit & Update' },
                    { key: 'canDeleteDigital', label: 'Delete Artwork' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                        (tempPermissions as any)[item.key]
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold'
                          : 'bg-card/40 border-border text-muted-foreground'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={(tempPermissions as any)[item.key]}
                        onChange={(e) =>
                          setTempPermissions({
                            ...tempPermissions,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="accent-cyan-400 rounded"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>

                {/* Allowed Digital Categories */}
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Allowed Digital Categories:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const isAll = tempPermissions.allowedDigitalCategories.includes('*');
                        setTempPermissions({
                          ...tempPermissions,
                          allowedDigitalCategories: isAll ? ['vector'] : ['*'],
                        });
                      }}
                      className="text-[10px] text-cyan-400 hover:underline font-bold"
                    >
                      {tempPermissions.allowedDigitalCategories.includes('*')
                        ? 'Restrict to Specific Categories'
                        : 'Grant All Digital Categories (*)'}
                    </button>
                  </div>

                  {tempPermissions.allowedDigitalCategories.includes('*') ? (
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold flex items-center gap-2">
                      <Sparkles size={14} />
                      <span>Full Access: User can manage all digital vector and artwork collections.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {DIGITAL_CATEGORIES.map((cat) => {
                        const isChecked = tempPermissions.allowedDigitalCategories.includes(cat.id);
                        return (
                          <label
                            key={cat.id}
                            className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer select-none text-[11px] transition-all ${
                              isChecked
                                ? 'bg-card border-cyan-400 text-foreground font-bold'
                                : 'bg-card/25 border-border text-muted-foreground'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleDigitalCategory(cat.id)}
                              className="accent-cyan-400"
                            />
                            <span>{cat.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. TOOLS & ADMINISTRATIVE ACCESS */}
              <div className="p-4 rounded-2xl border border-border bg-background/40 space-y-3">
                <div className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-wider">
                  <Settings size={16} className="text-amber-400" />
                  <span>Module & Special Tools Access</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'canAccessBatchPrint', label: 'Batch Print (4-in-1 A4 Generator)', icon: Printer },
                    { key: 'canAccessOrderForm', label: 'Order Form & Sheet Builder', icon: FileText },
                    { key: 'canAccessPOSInvoice', label: 'POS Invoicing & Billing System', icon: Receipt },
                    { key: 'canAccessComplaints', label: 'Customer Complaints & Support', icon: MessageSquareWarning },
                    { key: 'canManageStaff', label: 'Manage Staff & User Permissions', icon: Shield },
                    { key: 'canExportData', label: 'Export Reports & Catalog Data', icon: Sliders },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <label
                        key={item.key}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          (tempPermissions as any)[item.key]
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
                            : 'bg-card/40 border-border text-muted-foreground'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={(tempPermissions as any)[item.key]}
                          onChange={(e) =>
                            setTempPermissions({
                              ...tempPermissions,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="accent-amber-400 rounded"
                        />
                        <Icon size={14} className="shrink-0" />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
              <button
                type="button"
                onClick={() => {
                  setEditingPermissionsStaff(null);
                  setTempPermissions(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-border hover:bg-card text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePermissions}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] text-[#0a0a0a] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Check size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD NEW STAFF MODAL ─── */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#2CFF05]/10 border border-[#2CFF05]/20 flex items-center justify-center text-[#2CFF05]">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                    Add Team Member
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Create a new operator profile with username & password.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateNewStaff} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Staff Member Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Job Title / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffTitle}
                    onChange={(e) => setNewStaffTitle(e.target.value)}
                    placeholder="e.g. DTF Printing Operator"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newStaffDepartment}
                    onChange={(e) => setNewStaffDepartment(e.target.value)}
                    placeholder="e.g. Production & Print"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newStaffUsername}
                    onChange={(e) => setNewStaffUsername(e.target.value)}
                    placeholder="e.g. kasun.print"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground font-mono focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Password
                  </label>
                  <input
                    type="text"
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground font-mono focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="staff@bitiumtechnology.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Role Template
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                  >
                    <option value="specialist">Department Specialist</option>
                    <option value="support">Customer Support & Complaints</option>
                    <option value="manager">Operations Manager</option>
                    <option value="ceo_admin">Super Admin / CEO</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Avatar Color
                  </label>
                  <select
                    value={newStaffAvatarBg}
                    onChange={(e) => setNewStaffAvatarBg(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                  >
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-emerald-500">Green</option>
                    <option value="bg-amber-500">Amber / Orange</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-rose-500">Rose / Red</option>
                    <option value="bg-indigo-500">Indigo</option>
                    <option value="bg-cyan-500">Cyan</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border hover:bg-card text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] text-[#0a0a0a] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/20 transition-all hover:scale-105 cursor-pointer"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
