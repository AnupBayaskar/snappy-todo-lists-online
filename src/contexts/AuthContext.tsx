
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, UserRole } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: Record<string, User> = {
  'member@example.com': {
    id: '1',
    name: 'John Doe',
    email: 'member@example.com',
    role: 'member',
    organizationId: 'org1',
    organizationName: 'Acme Corporation',
    teams: ['team1', 'team2']
  },
  'validator@example.com': {
    id: '2',
    name: 'Jane Smith',
    email: 'validator@example.com',
    role: 'validator',
    organizationId: 'org1',
    organizationName: 'Acme Corporation',
    teams: ['team1', 'team3']
  },
  'admin@example.com': {
    id: '3',
    name: 'Mike Johnson',
    email: 'admin@example.com',
    role: 'team-lead',
    organizationId: 'org1',
    organizationName: 'Acme Corporation',
    teams: ['team1']
  },
  'org-lead@example.com': {
    id: '4',
    name: 'Sarah Wilson',
    email: 'org-lead@example.com',
    role: 'organization-lead',
    organizationId: 'org1',
    organizationName: 'Acme Corporation',
    teams: ['team1', 'team2', 'team3']
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on component mount
    const storedUser = localStorage.getItem('governer-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email.toLowerCase()];
    if (mockUser && password === 'password123') {
      setUser(mockUser);
      localStorage.setItem('governer-user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('governer-user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
