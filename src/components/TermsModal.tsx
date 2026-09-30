import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const TermsModal: React.FC<Props> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 text-neutral-100 max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-200">
            {type === 'terms' ? <FileText className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              {type === 'terms' ? 'Terms of Service' : 'Privacy & Security Policy'}
            </h2>
            <p className="text-[11px] text-neutral-400">Effective Date: September 2026 · Version 2.4</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs text-neutral-300 leading-relaxed pr-2">
          {type === 'terms' ? (
            <>
              <div>
                <h4 className="font-semibold text-neutral-100 mb-1">1. Acceptance of Terms</h4>
                <p>
                  By creating an account or accessing our authentication gateway, you agree to adhere to these terms. If you are entering into this agreement on behalf of an enterprise or organization, you represent that you possess the authority to bind such entity.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-100 mb-1">2. Account Responsibility & Security</h4>
                <p>
                  You are responsible for safeguarding your credentials, maintaining session tokens securely, and immediately notifying security administrators of unauthorized breaches. We enforce multi-factor authentication policies across enterprise tenant accounts.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-100 mb-1">3. Acceptable Use Policy</h4>
                <p>
                  Users may not engage in credential stuffing, distributed denial of service attempts, reverse-engineering of security modules, or unauthorized automated access to private API endpoints.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-100 mb-1">4. Service Availability & SLA</h4>
                <p>
                  Our authentication service maintains a 99.99% uptime commitment with regional failover zones across worldwide edge locations.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-semibold text-neutral-100 mb-1">1. Cryptographic Safeguards</h4>
                <p>
                  All credentials, salted hashes, and authorization tokens are encrypted at rest using AES-256-GCM. In-flight communications utilize TLS 1.3 protocol standards with perfect forward secrecy.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-100 mb-1">2. Zero-Telemetry Credential Handling</h4>
                <p>
                  Passwords and private secrets are never logged in plain text or transmitted to analytical pipelines. Client-side evaluation ensures password complexity checks execute in your browser sandbox.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-100 mb-1">3. Data Residency & GDPR Compliance</h4>
                <p>
                  Account records and audit logs comply with European General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA). Users may request data export or account erasure at any time.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-100 mb-1">4. Cookies & Session Storage</h4>
                <p>
                  Session tokens utilize HttpOnly, Secure, and SameSite strict cookie attributes to mitigate Cross-Site Scripting (XSS) and Request Forgery (CSRF).
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-900 bg-neutral-100 rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
