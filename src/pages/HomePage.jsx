import React from 'react';
import HeroSection from '@/components/HeroSection';
import CatalogGrid from '@/components/CatalogGrid';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const phoneNumbers = [
    { number: '(0212) 243.70.61', label: 'Central Fija / Oficina', tel: '+582122437061' },
    { number: '(0414) 589.42.08', label: 'Línea Celular 1 / WhatsApp', tel: '+584145894208' },
    { number: '(0424) 191.20.69', label: 'Línea Celular 2 / WhatsApp', tel: '+584241912069' },
    { number: '(0426) 275.70.12', label: 'Línea de Guardia Técnica 1', tel: '+584262757012' },
    { number: '(0426) 961.78.36', label: 'Línea de Guardia Técnica 2', tel: '+584269617836' },
  ];

  return (
    <div className="space-y-16">
      {/* 1. Hero Section (Rebranded Equi-Extin corporate banner) */}
      <HeroSection />

      {/* 2. Responsive Catalog Grid (Equipos y Recargas con cálculo de cotización B2B) */}
      <CatalogGrid />

      {/* 3. B2B Consultation & Official Physical Slip Contact Section */}
      <section
        id="contact"
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 lg:p-12 shadow-xs space-y-8 scroll-mt-24"
      >
        {/* Header & Slogan Banner */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#E53935] text-xs font-bold border border-red-100 dark:border-red-900/60">
              <ShieldCheck className="w-4 h-4" />
              <span>Extintores Equi-Extin</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold border border-slate-200 dark:border-slate-700">
              RIF: V-12226621-0
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-900/60">
              <Award className="w-3.5 h-3.5" />
              <span>Homologado NFPA 10 & COVENIN</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              ¿Requiere inspección técnica de extintores o recarga en sus instalaciones?
            </h2>
            <div className="p-3.5 rounded-xl bg-red-50/80 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 flex items-start sm:items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-red-900 dark:text-red-200">
                «El Fuego es Destructor de Bienes y Vidas» — PROTEJASE...
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed pt-1">
              Nuestros técnicos certificados en seguridad industrial calculan la distribución de extintores y agentes adecuados según la clasificación de riesgo de su empresa. Realizamos recargas con nitrógeno seco al 99.9%, pruebas hidrostáticas y emisión de certificado oficial de operatividad.
            </p>
          </div>
        </div>

        {/* Addresses & Facilities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sede Principal */}
          <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 shadow-2xs">
            <CardContent className="p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100/70 dark:bg-red-950/70 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5">
                <Building className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Dirección Principal
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                  Final Av. Rómulo Gallegos
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Prolongación, Sector La Alcabala, Vía Terraza del Ávila, Frente a los Talleres de Herrería, Km 1 Detrás de Makro, Petare - Edo. Miranda.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Domicilio Fiscal / Sucursal */}
          <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 shadow-2xs">
            <CardContent className="p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Domicilio Fiscal / Sucursal
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                  Ctra. Vieja Petare - Guarenas, Km 1
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Casa N° 13 Sector Barrio La Alcabala, Zona Postal 1070. Taller autorizado de recarga, mantenimiento y pruebas de presión.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Numbers & Schedules Grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Phone className="w-4 h-4 text-[#E53935]" />
            <span>Líneas Telefónicas Oficiales de Atención</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {phoneNumbers.map((phone, idx) => (
              <a
                key={idx}
                href={`tel:${phone.tel}`}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:border-red-400 dark:hover:border-red-700 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {phone.label}
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 group-hover:text-[#E53935] transition-colors mt-0.5">
                    {phone.number}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 mt-2 font-semibold">
                  Llamar ahora →
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Operating Hours and Corporate Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Horario de Taller:</strong> Lunes a Viernes de 8:00 AM a 5:00 PM (Guardia de emergencia activa).
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 sm:justify-end">
            <Mail className="w-4 h-4 text-[#E53935] shrink-0" />
            <span>
              <strong>Correo Oficial:</strong>{' '}
              <a href="mailto:ventas@equi-extin.com" className="text-slate-800 dark:text-slate-200 font-bold hover:underline">
                ventas@equi-extin.com
              </a>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
