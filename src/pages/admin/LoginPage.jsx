import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Flame,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Globe,
  FileSpreadsheet,
  Cpu,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const currentYear = new Date().getFullYear();

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpassword');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentLanguage = i18n.language?.substring(0, 2) || 'es';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t('admin.loginEmptyFields', 'Por favor ingrese su usuario y contraseña.'));
      return;
    }

    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || t('admin.loginError', 'Credenciales inválidas.'));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t('admin.loginError', 'Error de conexión con el servidor de autenticación.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 font-sans">
      {/* LEFT HALF: Corporate Branding & Industrial Fire Safety Aesthetics */}
      <div className="md:w-1/2 lg:w-5/12 bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#E53935]/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"
          aria-hidden="true"
        />

        {/* Top Header: Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#E53935] flex items-center justify-center text-white shadow-md shadow-red-500/30 group-hover:bg-[#b71c1c] transition-colors">
              <Flame className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
                Equi-<span className="text-[#E53935]">Extin</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                Portal de Operaciones
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="md:hidden text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Tienda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Center: Mission & Corporate Pillars */}
        <div className="relative z-10 my-8 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#E53935]" />
            <span>Módulo de Control y Facturación</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Gestión Integral Contra Incendios y Talonario Fiscal
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
            Consola administrativa para aprobación de cotizaciones B2B, registro correlativo de facturas de contado con tasa BCV y consultas técnicas asistidas por IA.
          </p>

          {/* Feature Highlights Cards */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-[#E53935] flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200">Facturación contra Entrega</div>
                <div className="text-slate-400 text-[11px]">Copia inmutable de talonario físico con cálculo BCV</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200">Asistente Técnico RAG</div>
                <div className="text-slate-400 text-[11px]">Consultas de manuales y normativas NFPA 10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Security Notice */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Autenticación Stateless HttpOnly</span>
          <span>Norma COVENIN 1040</span>
        </div>
      </div>

      {/* RIGHT HALF: Clean Corporate Login Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 bg-white dark:bg-slate-900 transition-colors">
        {/* Top Bar on Right: Return Link, Language Selector & Theme Switcher */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto gap-3">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#E53935] dark:hover:text-[#E53935] transition-colors flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span className="hidden sm:inline">{t('admin.backToStore', 'Volver a la Tienda')}</span>
            <span className="sm:hidden">Tienda</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Quick Language Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800/80 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {['es', 'en', 'pt'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-colors ${
                    currentLanguage === lang
                      ? 'bg-white dark:bg-slate-900 text-[#E53935] shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>
        </div>

        {/* Center: Login Box */}
        <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-8 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {t('admin.loginTitle', 'Iniciar Sesión')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t(
                'admin.loginSubtitle',
                'Ingrese sus credenciales de acceso para gestionar cotizaciones y facturas.'
              )}
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#E53935]" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('admin.emailOrUsername', 'Usuario o Correo Corporativo')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin o admin@extin.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('admin.password', 'Contraseña')}
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Credentials Helper */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-3 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Credenciales demo:</span> admin / adminpassword
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('adminpassword');
                }}
                className="text-[#E53935] font-bold hover:underline cursor-pointer"
              >
                Autocompletar
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E53935] hover:bg-[#b71c1c] active:bg-[#991b1b] text-white font-bold h-11 rounded-xl shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('admin.authenticating', 'Validando credenciales...')}</span>
                </>
              ) : (
                <span>{t('admin.loginButton', 'Entrar al Panel de Control')}</span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer info */}
        <div className="w-full max-w-md mx-auto text-center text-xs text-slate-400 dark:text-slate-500">
          © {currentYear} Extintores Equi-Extin (RIF: V-12226621-0). Acceso Restringido y Auditado.
        </div>
      </div>
    </div>
  );
}
