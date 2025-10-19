import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginForm.module.css';

interface LoginFormData {
  email: string;
  senha: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Email deve ter formato válido')
    .required('Email é obrigatório'),
  senha: yup
    .string()
    .required('Senha é obrigatória'),
});

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      await login(data.email, data.senha);
      
      // Redirecionar para a página que o usuário estava tentando acessar
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      setLoginError(errorMessage);
      
      // Definir erro específico no campo senha se for credenciais inválidas
      if (errorMessage.includes('credenciais') || errorMessage.includes('senha')) {
        setError('senha', { message: 'Email ou senha incorretos' });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎭</span>
            <span className={styles.logoText}>EncenaPe</span>
          </div>
          <h1 className={styles.title}>Bem-vindo de volta!</h1>
          <p className={styles.subtitle}>
            Faça login para acessar sua conta e continuar sua jornada teatral
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {loginError && (
            <div className={styles.errorAlert}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={styles.errorIcon}
              >
                <path
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 6V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 14H10.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputContainer}>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="seu@email.com"
                autoComplete="email"
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={styles.inputIcon}
              >
                <path
                  d="M2.5 6.66667L8.08579 11.7474C8.35105 11.9702 8.64895 11.9702 8.91421 11.7474L14.5 6.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 6.66667L8.08579 11.7474C8.35105 11.9702 8.64895 11.9702 8.91421 11.7474L14.5 6.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 6.66667L8.08579 11.7474C8.35105 11.9702 8.64895 11.9702 8.91421 11.7474L14.5 6.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="senha" className={styles.label}>
              Senha
            </label>
            <div className={styles.inputContainer}>
              <input
                {...register('senha')}
                type={showPassword ? 'text' : 'password'}
                id="senha"
                className={`${styles.input} ${errors.senha ? styles.inputError : ''}`}
                placeholder="Sua senha"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.passwordToggle}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M1 10S4 3 10 3S19 10 19 10S16 17 10 17S1 10 1 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.senha && (
              <span className={styles.errorMessage}>{errors.senha.message}</span>
            )}
          </div>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Esqueceu sua senha?
            </Link>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>ou</span>
          </div>

          <div className={styles.signupLink}>
            <span className={styles.signupText}>Não tem uma conta?</span>
            <Link to="/register" className={styles.signupButton}>
              Criar conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
