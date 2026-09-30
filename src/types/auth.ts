export type AccountRole = 'developer' | 'designer' | 'manager' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  twoFactorEnabled: boolean;
  workspaceName?: string;
}

export interface PasswordCriteria {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';
  color: string;
  criteria: PasswordCriteria;
}

export type AuthMode = 'login' | 'signup';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
