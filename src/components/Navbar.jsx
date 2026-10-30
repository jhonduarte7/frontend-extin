import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flame, ShoppingCart, Globe, Menu, X, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentLanguage = i18n.language?.substring(0, 2) || 'es';

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const navLinks = [
    { label: t('nav.home', 'Inicio'), path: '/' },
    { label: t('nav.catalog', 'Catálogo'), path: '/catalog' },
    { label: t('nav.services', 'Servicios'), path: '/#services' },
    { label: t('nav.regulations', 'Normativas'), path: '/#regulations' },
    { label: t('nav.contact', 'Contacto'), path: '/#contact' },
  ];

  const languages = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Brand Visual */}
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#E53935] flex items-center justify-center text-white shadow-sm shadow-red-500/20 group-hover:bg-[#b71c1c] transition-colors">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                Equi-<span className="text-[#E53935]">Extin</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                {t('app.subtitle', 'Extintores & Seguridad Industrial')}
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-700 dark:text-slate-300">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-[#E53935] font-semibold border-b-2 border-[#E53935]'
                      : 'hover:text-[#E53935] dark:hover:text-[#E53935]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Theme Toggle, Language Selector, Cart & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark / Light Theme Toggle Button in top right */}
            <ThemeToggle size="sm" />

            {/* Language Selector (ES | EN | PT) - Desktop */}
            <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-1.5 py-0.5 rounded transition-colors text-[11px] cursor-pointer ${
                    currentLanguage === lang.code
                      ? 'bg-white dark:bg-slate-800 text-[#E53935] shadow-2xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Discrete Corporate Admin Access Link (Subtle Lock / Admin Area) */}
            <Link
              to="/admin/login"
              title={t('nav.adminAccess', 'Área Admin')}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
              aria-label={t('nav.adminAccess', 'Área Admin')}
            >
              <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="hidden xl:inline text-[11px] font-semibold tracking-tight">
                {t('nav.adminAccess', 'Área Admin')}
              </span>
            </Link>

            {/* Quote Cart Button with Safety Red Counter Badge */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 border-slate-200 dark:border-slate-800 hover:border-[#E53935] dark:hover:border-[#E53935] hover:text-[#E53935] dark:hover:text-[#E53935] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors h-9 px-2.5 sm:px-3 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-slate-700 dark:text-slate-200 group-hover:text-[#E53935]" />
              <span className="hidden sm:inline text-xs font-semibold">
                {t('nav.cart', 'Carrito')}
              </span>
              <span className="inline-flex items-center justify-center min-w-4 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-[#E53935] rounded-full shadow-xs">
                {totalItemsCount}
              </span>
            </Button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#E53935] hover:border-[#E53935] bg-white dark:bg-slate-900 transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Responsive on Cellphones & Small Tablets) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-red-50 dark:bg-red-950/30 text-[#E53935]'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[#E53935]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher & Admin Portal in Mobile Menu */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">Idioma:</span>
              <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-900 text-xs">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-xs font-bold uppercase transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-white dark:bg-slate-800 text-[#E53935] shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/admin/login"
              onClick={handleLinkClick}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#E53935] flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{t('nav.adminAccess', 'Área Admin')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
