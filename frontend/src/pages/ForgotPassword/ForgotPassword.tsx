import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { AuthService } from '../../services/api';
import styles from './ForgotPassword.module.css';

interface ForgotPasswordFormData {
  email: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Email deve ter formato válido')
    .required('Email é obrigatório')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
});

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const forgotPasswordMutation = useMutation(
    (data: { email: string }) => AuthService.forgotPassword(data.email),
    {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error: any) => {
        console.error('Erro ao enviar email:', error);
      },
    }
  );

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
    } catch (error) {
      // Erro já tratado pelo mutation
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🎭</span>
              <span className={styles.logoText}>EncenaPe</span>
            </div>
            <h1 className={styles.title}>Email enviado!</h1>
            <p className={styles.subtitle}>
              Enviamos um link para redefinir sua senha para o email informado.
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
              <h3>Verifique sua caixa de entrada</h3>
              <p>
                Se você tem uma conta conosco, receberá um email com instruções para redefinir sua senha.
              </p>
              <p>
                <strong>Não esqueça de verificar a pasta de spam!</strong>
              </p>
            </div>

            <div className={styles.actions}>
              <Link to="/login" className={styles.backToLoginButton}>
                Voltar ao login
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
          <h1 className={styles.title}>Esqueceu sua senha?</h1>
          <p className={styles.subtitle}>
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {forgotPasswordMutation.error && (
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
                {forgotPasswordMutation.error?.response?.data?.message || 'Erro ao enviar email. Tente novamente.'}
              </span>
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

          <button
            type="submit"
            className={styles.submitButton}
            disabled={forgotPasswordMutation.isLoading}
          >
            {forgotPasswordMutation.isLoading ? (
              <>
                <div className="spinner" />
                Enviando...
              </>
            ) : (
              'Enviar link de redefinição'
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

export default ForgotPassword;
