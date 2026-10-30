import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Flame, ShoppingCart, ShieldCheck, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Notification / Regulatory Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-safety-500" />
            <span>Extintores certificados bajo norma <strong>NFPA 10</strong> y normativa venezolana <strong>COVENIN</strong></span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-safety-500" /> (0212) 555-0199
            </span>
            <Link to="/admin/login" className="hover:text-white transition-colors">
              Portal Administrativo
            </Link>
          </div>
        </div>
      </div>

      {/* Main Corporate Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-safety-600 flex items-center justify-center text-white shadow-md group-hover:bg-safety-700 transition-colors">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-950 flex items-center gap-1">
                EXTIN <span className="text-safety-600 font-black">ERP</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider block text-slate-500 font-semibold -mt-1">
                Seguridad Industrial & Extintores
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link
              to="/"
              className={`hover:text-safety-600 transition-colors ${
                location.pathname === '/' ? 'text-safety-600 font-semibold' : ''
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/catalog"
              className={`hover:text-safety-600 transition-colors ${
                location.pathname === '/catalog' ? 'text-safety-600 font-semibold' : ''
              }`}
            >
              Catálogo de Extintores
            </Link>
            <a href="#servicios" className="hover:text-safety-600 transition-colors">
              Recarga y Mantenimiento
            </a>
            <a href="#normativas" className="hover:text-safety-600 transition-colors">
              Normativas NFPA
            </a>
          </nav>

          {/* Right Action: Cart Badge Button */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="relative flex items-center gap-2 border-slate-300 hover:border-safety-600 hover:text-safety-600"
            >
              <ShoppingCart className="w-4 h-4 text-safety-600" />
              <span className="hidden sm:inline font-semibold">Cotización</span>
              <Badge variant="destructive" className="ml-1 px-1.5 py-0.2 text-[10px] bg-safety-600">
                0
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Corporate Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-16 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-safety-600 flex items-center justify-center text-white">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">Equi-Extin</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Extintores Equi-Extin (RIF: V-12226621-0). Equipamiento contra incendios, cilindros nuevos certificados y taller especializado
              de recarga bajo estándares NFPA 10 y COVENIN.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Normativas y Cumplimiento</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>NFPA 10: Extintores Portátiles contra Incendios</li>
              <li>COVENIN 1040: Terminología y Selección de Extintores</li>
              <li>Inspección Técnica y Certificados de Operatividad</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Atención Corporativa</h4>
            <p className="text-xs text-slate-400 mb-1">
              Despachos corporativos e industriales a nivel nacional.
            </p>
            <p className="text-xs text-slate-300 font-semibold">
              Caracas, Venezuela | ventas@extin.com
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-slate-900 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Extintores Equi-Extin (RIF: V-12226621-0). Todos los derechos reservados. Specification-Driven Development (SDD).
        </div>
      </footer>
    </div>
  );
}
