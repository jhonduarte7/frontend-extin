import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import LoginPage from '@/pages/admin/LoginPage';
import QuotesAdminPage from '@/pages/admin/QuotesAdminPage';
import InvoicesAdminPage from '@/pages/admin/InvoicesAdminPage';
import InventoryAdminPage from '@/pages/admin/InventoryAdminPage';
import ClientsAdminPage from '@/pages/admin/ClientsAdminPage';
import ReportsAdminPage from '@/pages/admin/ReportsAdminPage';
import RagAssistantPage from '@/pages/admin/RagAssistantPage';
import DocumentsAdminPage from '@/pages/admin/DocumentsAdminPage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * Route boundary guard verifying that the user is authenticated with an active session.
 * If not authenticated, redirects to /admin/login while preserving the attempted path.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#E53935] animate-spin" />
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Verificando sesión segura...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Storefront Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="catalog" element={<CatalogPage />} />
            </Route>

            {/* Admin Authentication Route */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin Guarded Routes (Requires Authentication) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ReportsAdminPage />} />
              <Route path="reports" element={<ReportsAdminPage />} />
              <Route path="quotes" element={<QuotesAdminPage />} />
              <Route path="invoices" element={<InvoicesAdminPage />} />
              <Route path="customers" element={<ClientsAdminPage />} />
              <Route path="clients" element={<ClientsAdminPage />} />
              <Route path="inventory" element={<InventoryAdminPage />} />
              <Route path="catalog" element={<InventoryAdminPage />} />
              <Route path="rag" element={<RagAssistantPage />} />
              <Route path="chat" element={<RagAssistantPage />} />
              <Route path="documents" element={<DocumentsAdminPage />} />
            </Route>

            {/* 404 Fallback Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}
