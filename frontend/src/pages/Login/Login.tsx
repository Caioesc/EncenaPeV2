import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/Auth/LoginForm';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Se já estiver logado, redirecionar para home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginForm />;
};

export default Login;
