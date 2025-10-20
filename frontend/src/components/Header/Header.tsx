import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useIsAdmin } from '../../hooks/useAuth';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🎭</span>
          <span className={styles.logoText}>EncenaPe</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/eventos" className={styles.navLink}>
            Eventos
          </Link>
          <Link to="/faq" className={styles.navLink}>
            Ajuda
          </Link>
        </nav>

        {/* User Menu */}
        <div className={styles.userMenu}>
          {isAuthenticated ? (
            <div className={styles.userDropdown}>
              <button
                className={styles.userButton}
                onClick={toggleMenu}
                aria-label="Menu do usuário"
              >
                <div className={styles.userAvatar}>
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.nome}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span className={styles.avatarInitial}>
                      {user?.nome?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className={styles.userName}>{user?.nome}</span>
                <svg
                  className={`${styles.chevron} ${isMenuOpen ? styles.chevronOpen : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className={styles.dropdown}>
                  <Link
                    to="/perfil"
                    className={styles.dropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={styles.dropdownIcon}
                    >
                      <path
                        d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z"
                        fill="currentColor"
                      />
                      <path
                        d="M8 10C5.79086 10 4 11.7909 4 14H12C12 11.7909 10.2091 10 8 10Z"
                        fill="currentColor"
                      />
                    </svg>
                    Meu Perfil
                  </Link>
                  
                  <Link
                    to="/compras"
                    className={styles.dropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={styles.dropdownIcon}
                    >
                      <path
                        d="M2 3H14L13.5 10H2.5L2 3Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 13C6.55228 13 7 12.5523 7 12C7 11.4477 6.55228 11 6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                        fill="currentColor"
                      />
                    </svg>
                    Minhas Compras
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={styles.dropdownItem}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={styles.dropdownIcon}
                      >
                        <path
                          d="M8 0L10.5 5.5L16 8L10.5 10.5L8 16L5.5 10.5L0 8L5.5 5.5L8 0Z"
                          fill="currentColor"
                        />
                      </svg>
                      Painel Admin
                    </Link>
                  )}
                  
                  <div className={styles.dropdownDivider} />
                  
                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={styles.dropdownIcon}
                    >
                      <path
                        d="M6 14H2C1.44772 14 1 13.5523 1 13V3C1 2.44772 1.44772 2 2 2H6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 11L14 7L10 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 7H6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginButton}>
                Entrar
              </Link>
              <Link to="/register" className={styles.registerButton}>
                Cadastrar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Menu mobile"
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <Link
              to="/"
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/eventos"
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              to="/faq"
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Ajuda
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/perfil"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  to="/compras"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Minhas Compras
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Painel Admin
                  </Link>
                )}
                <button
                  className={styles.mobileLogoutButton}
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
