import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import { SocialAuthButtons } from './SocialAuthButtons';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onForgotPassword: (email: string) => void;
  prefillEmail?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onForgotPassword,
  prefillEmail = '',
}) => {
  const { login, quickDemoLogin } = useAuth();
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid work or personal email address.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoFill = async (demoEmail: string) => {
    setError(null);
    setEmail(demoEmail);
    setPassword('Demo@2026!');
    await quickDemoLogin(demoEmail);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Welcome back</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Access your secure workspace, code repositories, and team tools.
        </p>
      </div>

      {/* Demo Credentials Quick Switcher */}
      <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg">
        <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Demo Access (1-Click Test)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill('elena.rostova@aura.studio')}
            className="px-2 py-1.5 text-[11px] font-medium text-neutral-300 bg-neutral-950 border border-neutral-800 rounded hover:border-neutral-700 hover:text-white transition-all text-left truncate cursor-pointer"
            title="Elena (Developer)"
          >
            Elena <span className="text-neutral-500 font-normal">· Dev</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('marcus.v@hyperion.tech')}
            className="px-2 py-1.5 text-[11px] font-medium text-neutral-300 bg-neutral-950 border border-neutral-800 rounded hover:border-neutral-700 hover:text-white transition-all text-left truncate cursor-pointer"
            title="Marcus (Product Lead)"
          >
            Marcus <span className="text-neutral-500 font-normal">· Lead</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('amara@designsystem.org')}
            className="px-2 py-1.5 text-[11px] font-medium text-neutral-300 bg-neutral-950 border border-neutral-800 rounded hover:border-neutral-700 hover:text-white transition-all text-left truncate cursor-pointer"
            title="Amara (Product Designer)"
          >
            Amara <span className="text-neutral-500 font-normal">· Design</span>
          </button>
        </div>
      </div>

      {/* Social Logins */}
      <SocialAuthButtons />

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-neutral-800" />
        <span className="absolute px-3 text-[11px] font-medium text-neutral-500 bg-neutral-950">
          Or continue with email
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-medium text-neutral-300 mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="alex@company.com"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-medium text-neutral-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => onForgotPassword(email)}
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <label className="relative flex items-center gap-2 text-xs text-neutral-400 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-neutral-100 focus:ring-neutral-400 focus:ring-offset-neutral-950 cursor-pointer"
            />
            <span>Remember this device for 30 days</span>
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
              <span>Sign In to Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="text-center text-xs text-neutral-400 pt-2">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-medium text-neutral-200 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
        >
          Create one now
        </button>
      </div>
    </div>
  );
};
