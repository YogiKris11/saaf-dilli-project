'use client';

import { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { db, initializeDb } from '@/lib/localStorage';
import type { User } from '@/lib/types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeDb();
    const currentUser = db.currentUser.get();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = (loggedInUser: User) => {
    db.currentUser.set(loggedInUser);
    setUser(loggedInUser);
    if (loggedInUser.role === 'policy') {
      router.push('/dashboard/policy');
    } else {
      router.push('/dashboard/citizen');
    }
  };

  const logout = useCallback(() => {
    db.currentUser.clear();
    setUser(null);
    router.push('/login');
  }, [router]);

  const updateUser = (updatedUser: User) => {
    db.currentUser.set(updatedUser);
    setUser(updatedUser);

    // Also update the user in the main users list
    const allUsers = db.users.get();
    const userIndex = allUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser;
      db.users.set(allUsers);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
