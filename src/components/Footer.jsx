import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Flame,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Lock,
  Clock,
  Award,
  ChevronRight,
  Building,
} from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();

  const phoneNumbers = [
    { number: '(0212) 243.70.61', label: 'Central Fija / Oficina', tel: '+582122437061', isLandline: true },
    { number: '(0414) 589.42.08', label: 'Móvil / WhatsApp 1', tel: '+584145894208' },
    { number: '(0424) 191.20.69', label: 'Móvil / WhatsApp 2', tel: '+584241912069' },
    { number: '(0426) 275.70.12', label: 'Línea de Guardia 1', tel: '+584262757012' },
    { number: '(0426) 961.78.36', label: 'Línea de Guardia 2', tel: '+584269617836' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors duration-200">
      {/* Slogan Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-900/30 py-4 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-red-200">
          <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
            {t('company.slogan', '«El Fuego es Destructor de Bienes y Vidas» — PROTEJASE...')}
          </span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#E53935] flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:bg-[#b71c1c] transition-colors">
                <Flame className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight leading-none">
                  Equi-<span className="text-[#E53935]">Extin</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
                  Extintores & Seguridad Industrial
                </span>
              </div>
            </Link>

            <div className="inline-block px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono font-bold text-red-400">
              {t('company.rif', 'RIF: V-12226621-0')}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Especialistas en equipamiento contra incendios, cilindros certificados bajo norma NFPA 10,
              recargas de Polvo Químico Seco (PQS), CO2, Agua Presurizada y agentes limpios con certificación de bomberos.
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                <Award className="w-3.5 h-3.5 text-[#E53935]" />
                <span>Normas COVENIN</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>NFPA 10</span>
              </span>
            </div>
          </div>

          {/* Column 2: Sedes y Direcciones (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E53935]" />
              <span>Sedes y Ubicación</span>
            </h3>

            {/* Dirección Principal */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Building className="w-3.5 h-3.5 text-red-400" />
                <span>{t('company.mainAddressLabel', 'Dirección Principal')}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t(
                  'company.mainAddress',
                  'Final Av. Rómulo Gallegos, Prolongación, Sector La Alcabala, Vía Terraza del Ávila, Frente a los Talleres de Herrería, Km 1 Detrás de Makro, Petare - Edo. Miranda.'
                )}
              </p>
            </div>

            {/* Domicilio Fiscal */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('company.fiscalAddressLabel', 'Domicilio Fiscal / Sucursal')}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t(
                  'company.fiscalAddress',
                  'Ctra. Vieja Petare - Guarenas, Km 1, Casa N° 13 Sector Barrio La Alcabala, Zona Postal 1070.'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t('company.schedule', 'Lunes a Viernes: 8:00 AM - 5:00 PM')}</span>
            </div>
          </div>

          {/* Column 3: Teléfonos & Contacto (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#E53935]" />
              <span>{t('company.phonesLabel', 'Central Telefónica y Contacto')}</span>
            </h3>

            <div className="space-y-2">
              {phoneNumbers.map((p, idx) => (
                <a
                  key={idx}
                  href={`tel:${p.tel}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-700/60 group-hover:bg-red-950/60 text-[#E53935] flex items-center justify-center transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">{p.label}</div>
                      <div className="text-xs font-bold font-mono text-white group-hover:text-red-400 transition-colors">
                        {p.number}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            <div className="pt-1">
              <a
                href="mailto:ventas@equi-extin.com"
                className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white font-medium transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#E53935]" />
                <span>ventas@equi-extin.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Admin Portal Link */}
      <div className="border-t border-slate-800 bg-slate-950 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
          <p>
            © {currentYear} <strong className="text-slate-200">Extintores Equi-Extin</strong> (RIF: V-12226621-0). Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="text-slate-500">Petare - Edo. Miranda, Venezuela</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group"
              title={t('nav.adminAccess', 'Área Admin')}
            >
              <Lock className="w-3 h-3 text-slate-500 group-hover:text-red-400 transition-colors" />
              <span>{t('nav.adminAccess', 'Área Admin')}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
