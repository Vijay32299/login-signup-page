import React, { useState } from 'react';
import {
  LogOut,
  Shield,
  Key,
  Laptop,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Building,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRoleTitle } from '../utils/validation';

export const DashboardView: React.FC = () => {
  const { currentUser, logout, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'team'>('overview');
  const [is2FAEnabled, setIs2FAEnabled] = useState(currentUser?.twoFactorEnabled ?? true);

  if (!currentUser) return null;

  const toggle2FA = () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    showToast(
      nextState ? 'Two-Factor Authentication activated' : 'Two-Factor Authentication suspended',
      nextState ? 'success' : 'info'
    );
  };

  const handleSimulateRotateKey = () => {
    showToast('API key and session tokens refreshed safely.', 'success');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar Contract (One-row, 3-zone contract) */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-neutral-800 bg-neutral-950 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-xs tracking-tight shadow-sm">
            A
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-100">
            Aura Workspace
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`hover:text-white transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'text-white font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`hover:text-white transition-colors cursor-pointer ${
              activeTab === 'security' ? 'text-white font-semibold' : ''
            }`}
          >
            Security & Keys
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`hover:text-white transition-colors cursor-pointer ${
              activeTab === 'team' ? 'text-white font-semibold' : ''
            }`}
          >
            Workspace Members
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium text-neutral-200">{currentUser.name}</span>
            <span className="text-[10px] text-neutral-500 font-mono">{currentUser.email}</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:text-white hover:bg-neutral-800/80 hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-linear-to-tr from-neutral-800 to-neutral-700 border border-neutral-600/40 flex items-center justify-center text-xl font-bold text-neutral-200 shrink-0 shadow-md overflow-hidden">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-neutral-100">{currentUser.name}</h1>
                <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {currentUser.email} · {getRoleTitle(currentUser.role)} · {currentUser.workspaceName || 'Primary Organization'}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  Last login: {new Date(currentUser.lastLoginAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSimulateRotateKey}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate Credentials</span>
            </button>
          </div>
        </div>

        {/* Tab Controls for Mobile/Desktop */}
        <div className="flex md:hidden items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
              activeTab === 'overview' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
              activeTab === 'security' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
              activeTab === 'team' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            Members
          </button>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Identity & Session Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Active Session */}
              <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-neutral-400" />
                    Active Session
                  </span>
                  <span className="text-emerald-400 font-medium">Online</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-100">Chrome on MacOS</div>
                  <div className="text-xs text-neutral-400 font-mono tabular-nums mt-0.5">
                    192.168.1.104 · TLS 1.3
                  </div>
                </div>
                <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-800/80">
                  Session Token expires in 29 days
                </div>
              </div>

              {/* Card 2: 2FA State */}
              <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-neutral-400" />
                    Two-Factor Auth
                  </span>
                  <span className={is2FAEnabled ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                    {is2FAEnabled ? 'Enforced' : 'Optional'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-100">
                    {is2FAEnabled ? 'Authenticator App (TOTP)' : 'Not Configured'}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Hardware key & passkey backup
                  </div>
                </div>
                <div className="pt-1 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">Security Gate</span>
                  <button
                    onClick={toggle2FA}
                    className="text-[11px] text-neutral-300 hover:text-white underline underline-offset-2 cursor-pointer"
                  >
                    {is2FAEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              {/* Card 3: Organization Details */}
              <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-neutral-400" />
                    Workspace
                  </span>
                  <span className="text-neutral-400 font-mono text-[11px]">Production</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-100">
                    {currentUser.workspaceName || 'Aura Engineering'}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Plan: Developer Enterprise
                  </div>
                </div>
                <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-800/80">
                  SSO & SAML integration active
                </div>
              </div>
            </div>

            {/* Profile Information Panel */}
            <div className="p-6 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-200">Account Credentials & Verification</h3>
                <span className="text-xs text-neutral-400">UUID: {currentUser.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-500 block mb-1">Full Legal Name</label>
                  <div className="font-medium text-neutral-200 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    {currentUser.name}
                  </div>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1">Primary Email Address</label>
                  <div className="font-medium text-neutral-200 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono">
                    {currentUser.email}
                  </div>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1">Assigned Role</label>
                  <div className="font-medium text-neutral-200 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    {getRoleTitle(currentUser.role)}
                  </div>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1">Account Creation Date</label>
                  <div className="font-medium text-neutral-200 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono tabular-nums">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Security Safeguards & Access Tokens</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Manage your cryptographically signed API keys and multi-factor authentication methods.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Personal Access Token (PAT)</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    aura_live_sk_948f9832************49f
                  </p>
                </div>
                <button
                  onClick={handleSimulateRotateKey}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Regenerate
                </button>
              </div>

              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Hardware Security Key (FIDO2 / WebAuthn)</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    YubiKey 5C NFC registered on September 15, 2026
                  </p>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Verified</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="p-6 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Organization Members</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Colleagues with authenticated access to this workspace.
              </p>
            </div>

            <div className="divide-y divide-neutral-800">
              {[
                { name: currentUser.name, email: currentUser.email, role: getRoleTitle(currentUser.role), status: 'Active (You)' },
                { name: 'Elena Rostova', email: 'elena.rostova@aura.studio', role: 'Software Engineer', status: 'Active' },
                { name: 'Marcus Vance', email: 'marcus.v@hyperion.tech', role: 'Product Lead', status: 'Active' },
                { name: 'Amara Okafor', email: 'amara@designsystem.org', role: 'Product Designer', status: 'Active' },
              ].map((member, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-medium text-neutral-300">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-200">{member.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400">{member.role}</span>
                    <span className="text-[11px] text-emerald-400">{member.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
