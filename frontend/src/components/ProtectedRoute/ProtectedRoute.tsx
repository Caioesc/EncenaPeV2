import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se precisa de permissão de admin
  if (requireAdmin && !user?.roles?.includes('ROLE_ADMIN')) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: 'var(--spacing-8)'
      }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-4xl)', 
          marginBottom: 'var(--spacing-4)',
          color: 'var(--error)'
        }}>
          Acesso Negado
        </h1>
        <p style={{ 
          fontSize: 'var(--font-size-lg)', 
          color: 'var(--gray-600)', 
          marginBottom: 'var(--spacing-6)',
          maxWidth: '500px'
        }}>
          Você não tem permissão para acessar esta página. 
          Esta área é restrita a administradores.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'var(--primary-purple)',
            color: 'var(--white)',
            textDecoration: 'none',
            borderRadius: 'var(--border-radius-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-purple-dark)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-purple)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Voltar ao início
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
