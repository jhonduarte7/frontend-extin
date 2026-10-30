import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Flame,
  LayoutDashboard,
  FileSpreadsheet,
  Receipt,
  Users,
  Package,
  Bot,
  FileUp,
  LogOut,
  TrendingUp,
  ExternalLink,
  Globe,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      label: t('admin.sidebar.dashboard', 'Dashboard'),
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: t('admin.sidebar.reports', 'Reportes y Ventas'),
      path: '/admin/reports',
      icon: TrendingUp,
      badge: 'Stats',
    },
    {
      label: t('admin.sidebar.quotes', 'Cotizaciones'),
      path: '/admin/quotes',
      icon: FileSpreadsheet,
      badge: 'B2B',
    },
    {
      label: t('admin.sidebar.invoices', 'Facturas Emitidas'),
      path: '/admin/invoices',
      icon: Receipt,
      badge: 'SENIAT',
    },
    {
      label: t('admin.sidebar.customers', 'Clientes y Equipos'),
      path: '/admin/customers',
      icon: Users,
      badge: 'CRM',
    },
    {
      label: t('admin.sidebar.inventory', 'Inventario y Stock'),
      path: '/admin/inventory',
      icon: Package,
      badge: 'Stock',
    },
    {
      label: t('admin.sidebar.rag', 'Asistente IA (RAG)'),
      path: '/admin/rag',
      icon: Bot,
      badge: 'IA',
    },
    {
      label: t('admin.sidebar.documents', 'Manuales PDF'),
      path: '/admin/documents',
      icon: FileUp,
    },
  ];

  const currentLanguage = i18n.language?.substring(0, 2) || 'es';

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Responsive Left Sidebar (260px) - Dark Theme */}
      <aside
        className={`w-64 bg-slate-950 text-slate-300 flex flex-col fixed inset-y-0 z-50 shadow-xl border-r border-slate-900 transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
          <Link
            to="/admin"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E53935] flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:bg-[#b71c1c] transition-colors">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight flex items-center gap-1 leading-none">
                EQUI-EXTIN <span className="text-[#E53935] font-black text-xs">ADMIN</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                {t('admin.sidebar.operations', 'Operaciones & Facturación')}
              </span>
            </div>
          </Link>

          {/* Close button on mobile sidebar */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === '/admin'
              : location.pathname === item.path ||
                (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E53935] text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={isActive ? 'secondary' : 'outline'}
                    className={`text-[9px] px-1.5 py-0 ${
                      isActive
                        ? 'bg-white/20 text-white border-transparent'
                        : 'border-slate-800 text-slate-400 bg-slate-900'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Session Footer Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs uppercase shrink-0">
                {user?.username?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {user?.username || 'Administrador'}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t('admin.topbar.activeSession', 'Sesión Activa')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#E53935] hover:bg-slate-800 transition-colors cursor-pointer"
              title={t('admin.topbar.logout', 'Cerrar Sesión')}
              aria-label={t('admin.topbar.logout', 'Cerrar Sesión')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace Container - Responsive Margin */}
      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
        {/* Global Admin Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Left: Mobile Menu Toggle & Breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">Panel</span>
              <span className="hidden sm:inline">/</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">
                {location.pathname.replace('/admin/', '').replace('/admin', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Controls: BCV Rate, Language Switcher, Theme Toggle, User Details & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* BCV Exchange Rate Badge */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">{t('admin.topbar.bcvRate', 'Tasa BCV')}:</span>
              <span className="font-black text-slate-900 dark:text-slate-100 font-mono">36.50 VES</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800 text-xs font-semibold">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1 hidden sm:block" />
              {['es', 'en', 'pt'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    currentLanguage === lang
                      ? 'bg-white dark:bg-slate-900 text-[#E53935] shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Switcher Toggle */}
            <ThemeToggle />

            {/* Public Storefront Direct Link */}
            <Link
              to="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs text-[#E53935] hover:text-[#b71c1c] font-semibold transition-colors"
              title="Abrir tienda en nueva pestaña"
            >
              <span>{t('admin.topbar.viewStore', 'Ver Tienda')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* User Profile Capsule with Logout Action */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.username || 'admin'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  {user?.role || 'ADMIN'}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#E53935] hover:border-red-200 dark:hover:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold flex items-center gap-1.5 h-8 px-2 sm:px-2.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#E53935]" />
                <span className="hidden md:inline">{t('admin.topbar.logout', 'Cerrar Sesión')}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
