import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Lock, Mail, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, evaluatePasswordStrength } from '../utils/validation';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess: (email: string) => void;
}

type Step = 'email' | 'otp' | 'new-password' | 'done';

export const ForgotPasswordModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccess,
}) => {
  const { resetPassword, showToast } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(newPassword);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      showToast(`Verification code sent to ${email}`, 'info');
    }, 500);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val[val.length - 1];
    }
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    // auto focus next
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('new-password');
    }, 400);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (strength.score < 2) {
      setError('Please choose a stronger password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(email, newPassword);
    setIsSubmitting(false);

    if (result.success) {
      setStep('done');
    } else {
      setError(result.error || 'Failed to update password.');
    }
  };

  const handleFillDemoCode = () => {
    setOtp(['8', '3', '9', '2', '1', '0']);
    setError(null);
  };

  const handleFinish = () => {
    onSuccess(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 text-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center mb-3 text-neutral-200">
            {step === 'done' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : step === 'otp' ? (
              <KeyRound className="w-5 h-5 text-neutral-300" />
            ) : (
              <Lock className="w-5 h-5 text-neutral-300" />
            )}
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
            {step === 'email' && 'Reset your password'}
            {step === 'otp' && 'Verify your identity'}
            {step === 'new-password' && 'Create new password'}
            {step === 'done' && 'Password updated'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {step === 'email' && "Enter your account email and we'll send a 6-digit recovery code."}
            {step === 'otp' && `Enter the 6-digit verification code dispatched to ${email}.`}
            {step === 'new-password' && 'Must meet security criteria to ensure your workspace remains secure.'}
            {step === 'done' && 'Your credentials have been securely refreshed. You may now log in.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 mb-4 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-xs font-medium text-neutral-300 mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-white bg-neutral-100 text-neutral-900 rounded-lg hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Recovery Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-sm font-semibold font-mono tabular-nums bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span>Didn't get code?</span>
              <button
                type="button"
                onClick={handleFillDemoCode}
                className="text-neutral-300 hover:text-white underline underline-offset-2 cursor-pointer"
              >
                Use Code 839210
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-neutral-900 bg-neutral-100 rounded-lg hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 'new-password' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              />
              <PasswordStrengthIndicator strength={strength} />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-neutral-900 bg-neutral-100 rounded-lg hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}

        {/* Step 4: Done */}
        {step === 'done' && (
          <div className="space-y-4 pt-1">
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-2 px-4 text-xs font-medium text-neutral-900 bg-neutral-100 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              Return to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
