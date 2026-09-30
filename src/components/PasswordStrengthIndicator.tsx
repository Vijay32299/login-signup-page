import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordStrengthResult } from '../types/auth';

interface Props {
  strength: PasswordStrengthResult;
  showCriteria?: boolean;
}

export const PasswordStrengthIndicator: React.FC<Props> = ({ strength, showCriteria = true }) => {
  const { score, label, color, criteria } = strength;

  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-400">Password strength</span>
        <span
          className={`font-medium ${
            score <= 1
              ? 'text-rose-400'
              : score === 2
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}
        >
          {label}
        </span>
      </div>

      {/* Segmented Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= step ? color : 'bg-neutral-800'
            }`}
          />
        ))}
      </div>

      {/* Criteria Breakdown */}
      {showCriteria && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            {criteria.minLength ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-600 shrink-0" />
            )}
            <span className={criteria.minLength ? 'text-neutral-300' : 'text-neutral-500'}>
              8+ characters
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {criteria.hasUpper && criteria.hasLower ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-600 shrink-0" />
            )}
            <span className={criteria.hasUpper && criteria.hasLower ? 'text-neutral-300' : 'text-neutral-500'}>
              Upper & lower case
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {criteria.hasNumber ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-600 shrink-0" />
            )}
            <span className={criteria.hasNumber ? 'text-neutral-300' : 'text-neutral-500'}>
              At least 1 number
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {criteria.hasSpecial ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-600 shrink-0" />
            )}
            <span className={criteria.hasSpecial ? 'text-neutral-300' : 'text-neutral-500'}>
              1 special symbol
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
