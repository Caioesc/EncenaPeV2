import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './hooks/useAuth';

// Components
import Header from './components/Header/Header';
import FooterNav from './components/FooterNav/FooterNav';

// Pages
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import EventDetail from './pages/EventDetail/EventDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Profile from './pages/Profile/Profile';
import Purchases from './pages/Purchases/Purchases';
import FAQ from './pages/FAQ/FAQ';
import Checkout from './pages/Checkout/Checkout';
import Admin from './pages/Admin/Admin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Styles
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/eventos" element={<Events />} />
                <Route path="/eventos/:id" element={<EventDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/faq" element={<FAQ />} />
                
                {/* Protected Routes */}
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/compras"
                  element={
                    <ProtectedRoute>
                      <Purchases />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout/:id"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <FooterNav />
            
            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName="custom-toast"
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// 404 Component
const NotFound: React.FC = () => {
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
      <h1 style={{ fontSize: 'var(--font-size-5xl)', marginBottom: 'var(--spacing-4)' }}>
        404
      </h1>
      <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-4)' }}>
        Página não encontrada
      </h2>
      <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--gray-600)', marginBottom: 'var(--spacing-6)' }}>
        A página que você está procurando não existe.
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
};

export default App;
