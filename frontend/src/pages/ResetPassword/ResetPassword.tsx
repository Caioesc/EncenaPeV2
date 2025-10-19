import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { AuthService } from '../../services/api';
import styles from './ResetPassword.module.css';

interface ResetPasswordFormData {
  novaSenha: string;
  confirmarSenha: string;
}

const schema = yup.object({
  novaSenha: yup
    .string()
    .required('Nova senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Senha deve ter pelo menos 8 caracteres, 1 letra, 1 número e 1 caractere especial'
    ),
  confirmarSenha: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('novaSenha')], 'Senhas devem ser iguais'),
});

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const resetPasswordMutation = useMutation(
    (data: { token: string; novaSenha: string }) =>
      AuthService.resetPassword(data.token, data.novaSenha),
    {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error: any) => {
        console.error('Erro ao redefinir senha:', error);
      },
    }
  );

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        novaSenha: data.novaSenha,
      });
    } catch (error) {
      // Erro já tratado pelo mutation
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🎭</span>
              <span className={styles.logoText}>EncenaPe</span>
            </div>
            <h1 className={styles.title}>Senha redefinida!</h1>
            <p className={styles.subtitle}>
              Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
            </p>
          </div>

          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM20 34L10 24L12.82 21.18L20 28.34L35.18 13.16L38 16L20 34Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            
            <div className={styles.successText}>
              <h3>Redefinição concluída</h3>
              <p>
                Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
              </p>
            </div>

            <div className={styles.actions}>
              <Link to="/login" className={styles.loginButton}>
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎭</span>
            <span className={styles.logoText}>EncenaPe</span>
          </div>
          <h1 className={styles.title}>Redefinir senha</h1>
          <p className={styles.subtitle}>
            Digite sua nova senha abaixo
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {resetPasswordMutation.error && (
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
              <span>
                {resetPasswordMutation.error?.response?.data?.message || 'Erro ao redefinir senha. Tente novamente.'}
              </span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="novaSenha" className={styles.label}>
              Nova senha
            </label>
            <div className={styles.inputContainer}>
              <input
                {...register('novaSenha')}
                type={showPassword ? 'text' : 'password'}
                id="novaSenha"
                className={`${styles.input} ${errors.novaSenha ? styles.inputError : ''}`}
                placeholder="Sua nova senha"
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
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
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
            {errors.novaSenha && (
              <span className={styles.errorMessage}>{errors.novaSenha.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmarSenha" className={styles.label}>
              Confirmar nova senha
            </label>
            <div className={styles.inputContainer}>
              <input
                {...register('confirmarSenha')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmarSenha"
                className={`${styles.input} ${errors.confirmarSenha ? styles.inputError : ''}`}
                placeholder="Confirme sua nova senha"
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
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.88 9.88C9.88 9.88 9.88 9.88 9.88 9.88"
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
            disabled={resetPasswordMutation.isLoading}
          >
            {resetPasswordMutation.isLoading ? (
              <>
                <div className="spinner" />
                Redefinindo...
              </>
            ) : (
              'Redefinir senha'
            )}
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>ou</span>
          </div>

          <div className={styles.loginLink}>
            <span className={styles.loginText}>Lembrou da senha?</span>
            <Link to="/login" className={styles.loginButton}>
              Fazer login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
