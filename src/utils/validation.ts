import { PasswordStrengthResult } from '../types/auth';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const criteria = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let metCount = 0;
  if (criteria.minLength) metCount++;
  if (criteria.hasUpper && criteria.hasLower) metCount++;
  if (criteria.hasNumber) metCount++;
  if (criteria.hasSpecial) metCount++;

  if (password.length >= 12 && metCount === 4) {
    metCount = 5;
  }

  let label: PasswordStrengthResult['label'] = 'Very Weak';
  let color = 'bg-rose-500';

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'bg-neutral-700',
      criteria,
    };
  }

  if (metCount === 1) {
    label = 'Weak';
    color = 'bg-rose-500';
  } else if (metCount === 2) {
    label = 'Fair';
    color = 'bg-amber-500';
  } else if (metCount === 3 || metCount === 4) {
    label = 'Strong';
    color = 'bg-emerald-500';
  } else if (metCount >= 5) {
    label = 'Excellent';
    color = 'bg-emerald-400';
  }

  return {
    score: Math.min(metCount, 4),
    label,
    color,
    criteria,
  };
}

export function getRoleTitle(role: string): string {
  switch (role) {
    case 'developer':
      return 'Software Engineer';
    case 'designer':
      return 'Product Designer';
    case 'manager':
      return 'Product Lead';
    case 'enterprise':
      return 'Enterprise Admin';
    default:
      return 'Team Member';
  }
}
