import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import authImage from '../assets/images/auth_studio_showcase_1790784270477.jpg';

export const BrandShowcase: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative flex flex-col justify-between h-full p-8 md:p-12 overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <img
            src={authImage}
            alt="Minimalist design architecture interior"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? 'opacity-35 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-neutral-900 via-neutral-950 to-neutral-900 opacity-80" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
      </div>

      {/* Top Brand & Security Status */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-sm tracking-tight shadow-md">
            A
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-neutral-100">
              Aura Authentication
            </span>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span>Secure Gateway</span>
              <span aria-hidden="true">·</span>
              <span>v2.4 TLS 1.3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Centerpiece Feature Callout */}
      <div className="relative z-10 my-auto py-8 space-y-6 max-w-md">
        <div className="space-y-3">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-100 text-balance leading-snug">
            Enterprise identity, engineered for modern developer velocity.
          </h2>
          <p className="text-xs lg:text-sm text-neutral-300 leading-relaxed">
            Consolidate authentication across internal microservices, client repositories, and workspace environments with zero trust credentials.
          </p>
        </div>

        {/* Feature List (No Pills) */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-2.5 text-xs text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Biometric Passkey & Multi-factor enforcement</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>SAML 2.0 & OpenID Connect Single Sign-On</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>SOC 2 Type II certified edge data encryption</span>
          </div>
        </div>
      </div>

      {/* Bottom Proof Section */}
      <div className="relative z-10 pt-6 border-t border-neutral-800/80">
        <blockquote className="space-y-2">
          <p className="text-xs text-neutral-300 italic leading-relaxed">
            "Aura unified our access workflows across 40 distributed services and reduced our engineer credential provisioning from 3 days to under 4 minutes."
          </p>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
            <div className="font-medium text-neutral-200">
              Dr. Aris Thorne <span className="font-normal text-neutral-500">· VP Infrastructure, Veloce</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] tabular-nums">
              <ShieldCheck className="w-3 h-3" />
              <span>99.99% SLA</span>
            </div>
          </div>
        </blockquote>
      </div>
    </div>
  );
};
