import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccountRole, ToastMessage } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: { name: string; email: string; password: string; role: AccountRole; workspaceName?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  socialLogin: (provider: 'google' | 'github' | 'sso') => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (email: string) => Promise<void>;
}

const STORAGE_KEY_USERS = 'aura_auth_users_v1';
const STORAGE_KEY_CURRENT_USER = 'aura_auth_current_user_v1';

const INITIAL_DEMO_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr_demo_1',
    name: 'Elena Rostova',
    email: 'elena.rostova@aura.studio',
    role: 'developer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-11-12T08:30:00Z',
    lastLoginAt: '2026-09-30T08:15:00Z',
    twoFactorEnabled: true,
    workspaceName: 'Aura Core Studio',
    passwordHash: 'Demo@2026!',
  },
  {
    id: 'usr_demo_2',
    name: 'Marcus Vance',
    email: 'marcus.v@hyperion.tech',
    role: 'manager',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-20T10:00:00Z',
    lastLoginAt: '2026-09-29T14:45:00Z',
    twoFactorEnabled: false,
    workspaceName: 'Hyperion Labs',
    passwordHash: 'Demo@2026!',
  },
  {
    id: 'usr_demo_3',
    name: 'Amara Okafor',
    email: 'amara@designsystem.org',
    role: 'designer',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-05T12:00:00Z',
    lastLoginAt: '2026-09-28T16:20:00Z',
    twoFactorEnabled: true,
    workspaceName: 'Design Systems Group',
    passwordHash: 'Demo@2026!',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize storage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      const storedPasswords = localStorage.getItem('aura_auth_passwords_v1');
      const storedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT_USER);

      if (storedUsers && storedPasswords) {
        setUsers(JSON.parse(storedUsers));
        setPasswords(JSON.parse(storedPasswords));
      } else {
        const initialUsers: User[] = INITIAL_DEMO_USERS.map(({ passwordHash: _, ...rest }) => rest);
        const initialPwds: Record<string, string> = {};
        INITIAL_DEMO_USERS.forEach((u) => {
          initialPwds[u.email.toLowerCase()] = u.passwordHash;
        });

        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initialUsers));
        localStorage.setItem('aura_auth_passwords_v1', JSON.stringify(initialPwds));
        setUsers(initialUsers);
        setPasswords(initialPwds);
      }

      if (storedCurrent) {
        setCurrentUser(JSON.parse(storedCurrent));
      }
    } catch (err) {
      console.error('Failed to load local auth data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate brief network latency
    await new Promise((res) => setTimeout(res, 500));

    const normalizedEmail = email.trim().toLowerCase();
    const existingPassword = passwords[normalizedEmail];
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      setIsLoading(false);
      return { success: false, error: 'No account found with this email address.' };
    }

    if (!existingPassword || existingPassword !== password) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password. Check your credentials and try again.' };
    }

    const updatedUser: User = {
      ...user,
      lastLoginAt: new Date().toISOString(),
    };

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));

    setCurrentUser(updatedUser);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedUser));
    }

    setIsLoading(false);
    showToast(`Welcome back, ${updatedUser.name.split(' ')[0]}!`, 'success');
    return { success: true };
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    role: AccountRole;
    workspaceName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    const normalizedEmail = userData.email.trim().toLowerCase();
    const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: normalizedEmail,
      role: userData.role,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      twoFactorEnabled: false,
      workspaceName: userData.workspaceName || `${userData.name.trim().split(' ')[0]}'s Workspace`,
    };

    const updatedUsers = [...users, newUser];
    const updatedPasswords = { ...passwords, [normalizedEmail]: userData.password };

    setUsers(updatedUsers);
    setPasswords(updatedPasswords);
    setCurrentUser(newUser);

    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
    localStorage.setItem('aura_auth_passwords_v1', JSON.stringify(updatedPasswords));
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(newUser));

    setIsLoading(false);
    showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    sessionStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    showToast('Signed out safely.', 'info');
  };

  const socialLogin = async (provider: 'google' | 'github' | 'sso') => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 800));

    const providerNames = {
      google: { name: 'Google User', email: 'user.google@gmail.com', domain: 'Google Account' },
      github: { name: 'GitHub Developer', email: 'dev.octocat@github.io', domain: 'GitHub Dev' },
      sso: { name: 'Enterprise Member', email: 'employee@enterprise.com', domain: 'SAML Identity' },
    };

    const profile = providerNames[provider];
    let user = users.find((u) => u.email.toLowerCase() === profile.email);

    if (!user) {
      user = {
        id: `usr_soc_${Date.now()}`,
        name: profile.name,
        email: profile.email,
        role: provider === 'sso' ? 'enterprise' : 'developer',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        twoFactorEnabled: true,
        workspaceName: profile.domain,
      };
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
    } else {
      user = { ...user, lastLoginAt: new Date().toISOString() };
    }

    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    setIsLoading(false);
    showToast(`Signed in with ${provider.toUpperCase()}`, 'success');
  };

  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      setIsLoading(false);
      return { success: false, error: 'No account registered under this email.' };
    }

    const updatedPasswords = { ...passwords, [normalizedEmail]: newPassword };
    setPasswords(updatedPasswords);
    localStorage.setItem('aura_auth_passwords_v1', JSON.stringify(updatedPasswords));

    setIsLoading(false);
    showToast('Password updated successfully. Please sign in.', 'success');
    return { success: true };
  };

  const quickDemoLogin = async (email: string) => {
    const demo = INITIAL_DEMO_USERS.find((d) => d.email.toLowerCase() === email.toLowerCase());
    if (demo) {
      await login(demo.email, demo.passwordHash, true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        toasts,
        showToast,
        removeToast,
        login,
        signup,
        logout,
        socialLogin,
        resetPassword,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
