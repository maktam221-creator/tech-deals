import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User, UserWithPassword } from '../types';

const initialUsers: UserWithPassword[] = [
  { id: 1, username: 'admin', password: 'makram', role: 'ADMIN' },
  { id: 2, username: 'editor', password: 'editor', role: 'EDITOR' },
];

const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('usersWithPasswords');
    if (stored) {
      return JSON.parse(stored).map(({ password, ...user }: UserWithPassword) => user);
    }
    localStorage.setItem('usersWithPasswords', JSON.stringify(initialUsers));
    return initialUsers.map(({ password, ...user }) => user);
  } catch (error) {
    console.error("Error accessing stored users:", error);
    return [];
  }
};

const getStoredSession = (): User | null => {
    try {
        const stored = sessionStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error accessing stored session:", error);
        return null;
    }
};

interface AuthContextType {
    currentUser: User | null;
    users: User[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
    addUser: (user: UserWithPassword) => void;
    updateUser: (user: UserWithPassword) => void;
    deleteUser: (userId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(getStoredUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredSession);

  const login = (username: string, password: string): boolean => {
    const storedUsersWithPasswords = JSON.parse(localStorage.getItem('usersWithPasswords') || '[]');
    const userToLogin = storedUsersWithPasswords.find(
      (u: UserWithPassword) => u.username === username && u.password === password
    );
    if (userToLogin) {
      const { password, ...userWithoutPassword } = userToLogin;
      setCurrentUser(userWithoutPassword);
      sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const syncUsersToStorage = (updatedUsersWithPasswords: UserWithPassword[]) => {
      localStorage.setItem('usersWithPasswords', JSON.stringify(updatedUsersWithPasswords));
      setUsers(updatedUsersWithPasswords.map(({ password, ...user }) => user));
  }

  const addUser = (user: UserWithPassword) => {
    const storedUsersWithPasswords: UserWithPassword[] = JSON.parse(localStorage.getItem('usersWithPasswords') || '[]');
    const newUser = { ...user, id: Date.now() };
    syncUsersToStorage([...storedUsersWithPasswords, newUser]);
  };

  const updateUser = (userToUpdate: UserWithPassword) => {
      const storedUsersWithPasswords: UserWithPassword[] = JSON.parse(localStorage.getItem('usersWithPasswords') || '[]');
      const updatedList = storedUsersWithPasswords.map((u) => {
          if (u.id === userToUpdate.id) {
              const updatedUser = { ...u, username: userToUpdate.username, role: userToUpdate.role };
              if (userToUpdate.password) {
                  updatedUser.password = userToUpdate.password;
              }
              return updatedUser;
          }
          return u;
      });
      syncUsersToStorage(updatedList);
  };

  const deleteUser = (userId: number) => {
      const storedUsersWithPasswords: UserWithPassword[] = JSON.parse(localStorage.getItem('usersWithPasswords') || '[]');
      const updatedList = storedUsersWithPasswords.filter((u) => u.id !== userId);
      syncUsersToStorage(updatedList);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
