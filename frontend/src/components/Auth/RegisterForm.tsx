import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import styles from './RegisterForm.module.css';

interface RegisterFormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const schema = yup.object({
  nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  email: yup
    .string()
    .email('Email deve ter formato válido')
    .required('Email é obrigatório')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  senha: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Senha deve ter pelo menos 8 caracteres, 1 letra, 1 número e 1 caractere especial'
    ),
  confirmarSenha: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('senha')], 'Senhas devem ser iguais'),
});

const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setRegisterError(null);
      await registerUser({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      });
      
      // Redirecionar para login após cadastro bem-sucedido
      navigate('/login', { 
        state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
      setRegisterError(errorMessage);
      
      // Definir erro específico no campo email se for email duplicado
      if (errorMessage.includes('email') && errorMessage.includes('uso')) {
        setError('email', { message: 'Este email já está em uso' });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎭</span>
            <span className={styles.logoText}>EncenaPe</span>
          </div>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>
            Junte-se à nossa comunidade teatral e descubra os melhores espetáculos
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {registerError && (
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
              <span>{registerError}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.label}>
              Nome completo
            </label>
            <div className={styles.inputContainer}>
              <input
                {...register('nome')}
                type="text"
                id="nome"
                className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={styles.inputIcon}
              >
                <path
                  d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {errors.nome && (
              <span className={styles.errorMessage}>{errors.nome.message}</span>
            )}
          </div>

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
                autoComplete="new-password"
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

          <div className={styles.formGroup}>
            <label htmlFor="confirmarSenha" className={styles.label}>
              Confirmar senha
            </label>
            <div className={styles.inputContainer}>
              <input
                {...register('confirmarSenha')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmarSenha"
                className={`${styles.input} ${errors.confirmarSenha ? styles.inputError : ''}`}
                placeholder="Confirme sua senha"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={styles.passwordToggle}
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirmPassword ? (
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
            {errors.confirmarSenha && (
              <span className={styles.errorMessage}>{errors.confirmarSenha.message}</span>
            )}
          </div>

          <div className={styles.passwordRequirements}>
            <p className={styles.requirementsTitle}>Sua senha deve conter:</p>
            <ul className={styles.requirementsList}>
              <li>Pelo menos 8 caracteres</li>
              <li>1 letra (a-z ou A-Z)</li>
              <li>1 número (0-9)</li>
              <li>1 caractere especial (@$!%*#?&)</li>
            </ul>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>ou</span>
          </div>

          <div className={styles.loginLink}>
            <span className={styles.loginText}>Já tem uma conta?</span>
            <Link to="/login" className={styles.loginButton}>
              Fazer login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
