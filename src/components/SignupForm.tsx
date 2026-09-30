import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, AlertCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountRole } from '../types/auth';
import { validateEmail, evaluatePasswordStrength } from '../utils/validation';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { SocialAuthButtons } from './SocialAuthButtons';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AccountRole>('developer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please provide a valid work or organizational email.');
      return;
    }

    if (strength.score < 2) {
      setError('Password must meet at least minimum security criteria.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both inputs.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      name,
      email,
      password,
      role,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to create account.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Create an account</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Start collaborating with your team across high-performance environments.
        </p>
      </div>

      {/* Social Logins */}
      <SocialAuthButtons />

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-neutral-800" />
        <span className="absolute px-3 text-[11px] font-medium text-neutral-500 bg-neutral-950">
          Or register with credentials
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="signup-name" className="block text-xs font-medium text-neutral-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Elena Rostova"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-colors"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="block text-xs font-medium text-neutral-300 mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="elena@studio.design"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-colors"
            />
          </div>
        </div>

        {/* Primary Role Selector */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
              Primary Workspace Role
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'developer', label: 'Software Engineer', desc: 'Code & APIs' },
              { id: 'designer', label: 'Product Designer', desc: 'UI & Systems' },
              { id: 'manager', label: 'Product Lead', desc: 'Roadmaps & Sprints' },
              { id: 'enterprise', label: 'Enterprise Admin', desc: 'Teams & Security' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id as AccountRole)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  role === item.id
                    ? 'border-neutral-400 bg-neutral-800/90 text-white'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <div className="text-xs font-medium leading-tight">{item.label}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-xs font-medium text-neutral-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Strength Indicator */}
          {password.length > 0 && <PasswordStrengthIndicator strength={strength} />}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="signup-confirm-password" className="block text-xs font-medium text-neutral-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••••••"
              className={`w-full pl-10 pr-10 py-2.5 text-xs bg-neutral-900 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors ${
                confirmPassword && confirmPassword !== password
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-neutral-800 focus:border-neutral-400 focus:ring-neutral-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="text-[11px] text-rose-400 mt-1">Passwords do not match.</p>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-neutral-400 leading-snug select-none cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-neutral-100 focus:ring-neutral-400 focus:ring-offset-neutral-950 cursor-pointer"
            />
            <span>
              I agree to the{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-neutral-200 hover:text-white underline underline-offset-2 cursor-pointer"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-neutral-200 hover:text-white underline underline-offset-2 cursor-pointer"
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-neutral-100 rounded-lg hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center text-xs text-neutral-400 pt-2">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-neutral-200 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
        >
          Sign in instead
        </button>
      </div>
    </div>
  );
};
