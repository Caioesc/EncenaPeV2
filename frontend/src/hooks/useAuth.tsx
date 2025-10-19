import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, UserService } from '../services/api';
import { toast } from 'react-toastify';

// Tipos
export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  avatarUrl?: string;
  bio?: string;
  roles: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const user = JSON.parse(userData);
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await AuthService.login(email, password);
      
      const { accessToken, user } = response;
      
      // Salvar no localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success(`Bem-vindo, ${user.nome}!`);
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      const message = error.response?.data?.message || 'Erro ao fazer login';
      toast.error(message);
      throw error;
    }
  };

  // Register
  const register = async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await AuthService.register(data);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast.success('Conta criada com sucesso! Faça login para continuar.');
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast.error(message);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    toast.info('Logout realizado com sucesso');
  };

  // Update user
  const updateUser = (data: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...data };
      setState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const user = await UserService.getCurrentUser();
      setState(prev => ({ ...prev, user }));
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Hook para verificar se o usuário é admin
export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  return user?.roles?.includes('ROLE_ADMIN') || false;
};

// Hook para verificar se o usuário está autenticado
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export default AuthContext;
