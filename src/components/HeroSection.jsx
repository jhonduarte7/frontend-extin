import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowRight, Flame, Wrench, Truck, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  const { t } = useTranslation();

  const scrollToCatalog = () => {
    const catalogElem = document.getElementById('catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pillars = [
    {
      icon: ShieldCheck,
      title: t('hero.pillarNfpa', 'Normas NFPA 10 & COVENIN'),
      desc: t('hero.pillarNfpaDesc', 'Cilindros y agentes homologados'),
      color: 'text-[#E53935] bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/40',
    },
    {
      icon: Wrench,
      title: t('hero.pillarWorkshop', 'Taller Autorizado'),
      desc: t('hero.pillarWorkshopDesc', 'Pruebas hidrostáticas y recarga'),
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40',
    },
    {
      icon: Truck,
      title: t('hero.pillarDispatch', 'Despacho Inmediato'),
      desc: t('hero.pillarDispatchDesc', 'Cobertura comercial e industrial'),
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40',
    },
    {
      icon: FileText,
      title: t('hero.pillarInvoicing', 'Facturación Formal'),
      desc: t('hero.pillarInvoicingDesc', 'Tasa BCV y factura de contado'),
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40',
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-red-50/25 dark:from-slate-900 dark:via-slate-900/90 dark:to-red-950/20 p-5 sm:p-10 lg:p-14 shadow-xs transition-colors duration-200">
      {/* Decorative Fire Safety Gradient Glow */}
      <div 
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-100/40 dark:bg-red-900/20 blur-3xl" 
        aria-hidden="true" 
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Value Proposition & High Trust Copy */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-900/60 bg-white/90 dark:bg-slate-800/90 px-3.5 py-1 text-xs font-semibold text-[#E53935] shadow-2xs backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
              <ShieldCheck className="w-4 h-4" />
              <span>{t('hero.badge', 'Normativas NFPA 10 & COVENIN')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
              <span>RIF: V-12226621-0</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2] sm:leading-[1.18]">
            Equi-Extin: Seguridad y Protección Contra Incendios para la{' '}
            <span className="text-[#E53935] inline-block">Industria y el Comercio</span>
          </h1>

          {/* Slogan */}
          <p className="text-xs sm:text-sm font-extrabold italic uppercase tracking-wide text-red-600 dark:text-red-400">
            {t('company.slogan', '«El Fuego es Destructor de Bienes y Vidas» — PROTEJASE...')}
          </p>

          {/* Reassuring Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
            {t(
              'hero.subtitle',
              'Extintores nuevos certificados bajo norma NFPA 10 y servicio técnico especializado de recarga y mantenimiento con certificación oficial de operatividad.'
            )}
          </p>

          {/* Action CTAs: Responsive Stack on Mobile */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Button
              size="lg"
              onClick={scrollToCatalog}
              className="bg-[#E53935] hover:bg-[#b71c1c] text-white font-bold h-12 px-7 shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] cursor-pointer w-full sm:w-auto"
            >
              {t('hero.ctaCatalog', 'Explorar Catálogo')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold h-12 px-6 shadow-2xs w-full sm:w-auto"
            >
              <a href="#contact">
                {t('hero.ctaInspection', 'Solicitar Inspección Técnica')}
              </a>
            </Button>
          </div>

          {/* Verification note */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cotizaciones B2B directas con soporte técnico y sin compromiso de compra.</span>
          </div>
        </div>

        {/* Right Column: Visual Trust Card (Certified Equipment Showcase) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#E53935] border border-red-100 dark:border-red-900/40">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Garantía de Operatividad</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Inspección de 12 puntos de control</p>
                </div>
              </div>
              <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                100% Homologado
              </Badge>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Prueba Hidrostática:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">5 años de vigencia certificada</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Agentes de Extinción:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">Fosfato Monoamónico / CO2 99.9%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Precinto y Collarín:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">Fecha perforada de garantía</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400">Facturación & Pago:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">Tasa Oficial BCV al contado</span>
              </div>
            </div>

            {/* Quick trust banner */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-3.5 text-center">
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                Atención corporativa para plantas industriales, centros comerciales y condominios.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Trust Value Pillars Grid: Responsive 1-2-4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-200/70 dark:border-slate-800">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 shadow-2xs"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${pillar.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{pillar.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{pillar.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
