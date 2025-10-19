import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UserService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'purchases' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
  });

  // Buscar dados do usuário
  const { data: userData, isLoading } = useQuery(
    'userProfile',
    UserService.getProfile,
    {
      enabled: !!user,
    }
  );

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation(
    (data: { nome: string; email: string }) => UserService.updateProfile(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile');
        setIsEditing(false);
      },
    }
  );

  // Mutation para alterar senha
  const changePasswordMutation = useMutation(
    (data: { senhaAtual: string; novaSenha: string }) => UserService.changePassword(data),
    {
      onSuccess: () => {
        // Limpar formulário de senha
        setPasswordData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      },
    }
  );

  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const handleProfileEdit = () => {
    setIsEditing(true);
    setFormData({
      nome: userData?.nome || user?.nome || '',
      email: userData?.email || user?.email || '',
    });
  };

  const handleProfileSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleProfileCancel = () => {
    setIsEditing(false);
    setFormData({
      nome: userData?.nome || user?.nome || '',
      email: userData?.email || user?.email || '',
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    changePasswordMutation.mutate({
      senhaAtual: passwordData.senhaAtual,
      novaSenha: passwordData.novaSenha,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <p>Carregando perfil...</p>
      </div>
    );
  }

  const currentUser = userData || user;

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {currentUser?.nome?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>{currentUser?.nome}</h1>
              <p className={styles.userEmail}>{currentUser?.email}</p>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7 17L2 12L7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12H18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                fill="currentColor"
              />
              <path
                d="M10 5C9.45 5 9 5.45 9 6V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V6C11 5.45 10.55 5 10 5Z"
                fill="currentColor"
              />
              <path
                d="M10 13C9.45 13 9 13.45 9 14C9 14.55 9.45 15 10 15C10.55 15 11 14.55 11 14C11 13.45 10.55 13 10 13Z"
                fill="currentColor"
              />
            </svg>
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`${styles.tab} ${activeTab === 'purchases' ? styles.tabActive : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 17.6 16.6 18 16 18H8C7.4 18 7 17.6 7 17V13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Compras
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${styles.tab} ${activeTab === 'settings' ? styles.tabActive : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 10C17.5 10 15.5 12 10 12C4.5 12 2.5 10 2.5 10C2.5 10 4.5 8 10 8C15.5 8 17.5 10 17.5 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Configurações
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.profileTab}>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Informações pessoais</h2>
                  {!isEditing && (
                    <button onClick={handleProfileEdit} className={styles.editButton}>
                      Editar
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="nome" className={styles.label}>
                        Nome completo
                      </label>
                      <input
                        type="text"
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                        className={styles.input}
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.label}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className={styles.input}
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        onClick={handleProfileCancel}
                        className={styles.cancelButton}
                        disabled={updateProfileMutation.isLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleProfileSave}
                        className={styles.saveButton}
                        disabled={updateProfileMutation.isLoading}
                      >
                        {updateProfileMutation.isLoading ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.profileInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Nome</span>
                      <span className={styles.infoValue}>{currentUser?.nome}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email</span>
                      <span className={styles.infoValue}>{currentUser?.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Membro desde</span>
                      <span className={styles.infoValue}>
                        {currentUser?.dataCriacao ? formatDate(currentUser.dataCriacao) : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className={styles.purchasesTab}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Minhas compras</h2>
                <div className={styles.purchasesList}>
                  {/* Aqui seria implementada a lista de compras */}
                  <div className={styles.emptyPurchases}>
                    <div className={styles.emptyIcon}>🎫</div>
                    <h3>Nenhuma compra encontrada</h3>
                    <p>Você ainda não fez nenhuma compra. Explore nossos eventos!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsTab}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Alterar senha</h2>
                <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="senhaAtual" className={styles.label}>
                      Senha atual
                    </label>
                    <input
                      type="password"
                      id="senhaAtual"
                      name="senhaAtual"
                      value={passwordData.senhaAtual}
                      onChange={handlePasswordChange}
                      className={styles.input}
                      placeholder="Digite sua senha atual"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="novaSenha" className={styles.label}>
                      Nova senha
                    </label>
                    <input
                      type="password"
                      id="novaSenha"
                      name="novaSenha"
                      value={passwordData.novaSenha}
                      onChange={handlePasswordChange}
                      className={styles.input}
                      placeholder="Digite sua nova senha"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmarSenha" className={styles.label}>
                      Confirmar nova senha
                    </label>
                    <input
                      type="password"
                      id="confirmarSenha"
                      name="confirmarSenha"
                      value={passwordData.confirmarSenha}
                      onChange={handlePasswordChange}
                      className={styles.input}
                      placeholder="Confirme sua nova senha"
                      required
                    />
                  </div>

                  {changePasswordMutation.error && (
                    <div className={styles.errorAlert}>
                      {changePasswordMutation.error?.response?.data?.message || 'Erro ao alterar senha'}
                    </div>
                  )}

                  {changePasswordMutation.isSuccess && (
                    <div className={styles.successAlert}>
                      Senha alterada com sucesso!
                    </div>
                  )}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={changePasswordMutation.isLoading}
                  >
                    {changePasswordMutation.isLoading ? 'Alterando...' : 'Alterar senha'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
