import { set } from 'date-fns';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData } from '../../Commons/userData';
import { getUserFromEmail, getUserFromToken } from '../../services/requestFunctions';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider?: 'email' | 'google' | 'github';
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        if(savedToken){
          const obj ={
            token:savedToken
          }
          const userDetails:UserData|null = await getUserFromToken();
          const data = {
            email:userDetails?.username
          }

          // console.log('USER DATA',userData?.username);
          const userData:UserData|null = await getUserFromEmail(data);
          console.log('userData',userData)
          if(userData)
          setToken(savedToken);
          setUser(userData);
          setIsAuthenticated(true);
          // console.log(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [ ]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: UserData = {
        id: 1,
        username: 'John Doe',
        email: email,
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        provider: 'email'
      };
      
      setUser(mockUser);
      localStorage.setItem('ryotube_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: UserData = {
        id: 2,
        username: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        provider: 'email'
      };
      
      setUser(mockUser);
      localStorage.setItem('ryotube_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: UserData = {
        id: 3,
        username: 'Google UserData',
        email: 'user@gmail.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        provider: 'google'
      };
      
      setUser(mockUser);
      localStorage.setItem('ryotube_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGithub = async () => {
    setIsLoading(true);
    try {
      // Simulate GitHub OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: UserData = {
        id: 4,
        username: 'GitHub User',
        email: 'user@github.com',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        provider: 'github'
      };
      
      setUser(mockUser);
      localStorage.setItem('ryotube_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('GitHub login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ryotube_user');
  };

  const resetPassword = async (email: string) => {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    loginWithGithub,
    logout,
    resetPassword,
    setIsAuthenticated,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};