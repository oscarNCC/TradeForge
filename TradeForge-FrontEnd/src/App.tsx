import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import TradesPage from './pages/TradesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import './App.css';

const LANDING_ONLY = import.meta.env.VITE_LANDING_ONLY === 'true';

function LandingOrRedirect() {
  const user = useAuthStore((s) => s.user);
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
}

function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    if (!LANDING_ONLY) restoreSession();
  }, [restoreSession]);

  if (LANDING_ONLY) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Outlet />}>
          <Route index element={<LandingOrRedirect />} />
          <Route path="*" element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="trades" element={<TradesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
