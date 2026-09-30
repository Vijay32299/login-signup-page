import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { BrandShowcase } from './components/BrandShowcase';
import { DashboardView } from './components/DashboardView';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { TermsModal } from './components/TermsModal';
import { ToastContainer } from './components/Toast';
import { AuthMode } from './types/auth';
import { Shield, Lock } from 'lucide-react';

const AuthPortal: React.FC = () => {
  const { currentUser, toasts, removeToast } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy'>('terms');

  // If already authenticated, show the dashboard
  if (currentUser) {
    return (
      <>
        <DashboardView />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  const handleOpenForgotPassword = (email: string) => {
    setForgotPasswordEmail(email);
    setForgotPasswordOpen(true);
  };

  const handleResetSuccess = (email: string) => {
    setMode('login');
    setForgotPasswordEmail(email);
  };

  const handleOpenTerms = () => {
    setTermsModalType('terms');
    setTermsModalOpen(true);
  };

  const handleOpenPrivacy = () => {
    setTermsModalType('privacy');
    setTermsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-neutral-700 selection:text-white">
      {/* Top Navbar Contract */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-xs tracking-tight">
            A
          </div>
          <span className="text-sm font-semibold tracking-tight text-neutral-100">
            Aura
          </span>
        </div>

        {/* Zone 2: Navigation / Info */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-neutral-400" />
            End-to-End Encrypted
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>SOC 2 Type II Certified</span>
        </div>

        {/* Zone 3: Interactive Segmented Auth Control */}
        <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
          <button
            onClick={() => setMode('login')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              mode === 'login'
                ? 'bg-neutral-100 text-neutral-950 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              mode === 'signup'
                ? 'bg-neutral-100 text-neutral-950 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto">
          {/* Left Column: Visual Showcase (5 cols on lg) */}
          <div className="hidden lg:block lg:col-span-5 min-h-[580px]">
            <BrandShowcase />
          </div>

          {/* Right Column: Authentication Card (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center">
            <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-900/80 shadow-2xl relative">
              {mode === 'login' ? (
                <LoginForm
                  onSwitchToSignup={() => setMode('signup')}
                  onForgotPassword={handleOpenForgotPassword}
                  prefillEmail={forgotPasswordEmail}
                />
              ) : (
                <SignupForm
                  onSwitchToLogin={() => setMode('login')}
                  onOpenTerms={handleOpenTerms}
                  onOpenPrivacy={handleOpenPrivacy}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3 text-neutral-400" />
          <span>Protected by AES-256 GCM cryptographic envelope</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenTerms}
            className="hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={handleOpenPrivacy}
            className="hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span aria-hidden="true">·</span>
          <span>© 2026 Aura Systems Inc.</span>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        initialEmail={forgotPasswordEmail}
        onSuccess={handleResetSuccess}
      />

      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        type={termsModalType}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthPortal />
    </AuthProvider>
  );
}
