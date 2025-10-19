import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../../components/Auth/RegisterForm';

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Se já estiver logado, redirecionar para home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <RegisterForm />;
};

export default Register;
