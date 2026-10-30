import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

/**
 * Authentic SVG Extinguisher and Industrial Safety Illustration tailored by agent type.
 * Ensures an authentic, high-contrast visual is ALWAYS rendered (never empty or black background).
 */
export function ExtinguisherIcon({ type = 'PQS', classType: _classType = 'ABC', isService = false }) {
  const normType = String(type || '').toUpperCase();
  const isCo2 = normType === 'CO2';
  const isWater = normType === 'WATER' || normType === 'H2O' || normType === 'AGUA';
  const isK = normType === 'K';
  const isSolk = normType === 'SOLK' || normType === 'SOLKAFLAM';
  const isAccessory = normType === 'ACCESSORY';

  // Body and accent colors based on cylinder chemistry
  let cylinderColor = '#DC2626'; // Standard safety red
  let cylinderAccent = '#B91C1C';

  if (isWater || isK) {
    cylinderColor = '#94A3B8'; // Stainless steel
    cylinderAccent = '#CBD5E1';
  } else if (isSolk) {
    cylinderColor = '#15803D'; // Emerald green (Clean Agent)
    cylinderAccent = '#166534';
  }

  // Industrial emergency cabinet / hose reel accessory illustration
  if (isAccessory) {
    return (
      <div className="relative w-full h-44 flex items-center justify-center p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl group-hover:bg-red-50/20 dark:group-hover:bg-red-950/20 transition-colors">
        <svg
          viewBox="0 0 100 160"
          className="h-36 w-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cabinet Outer Frame */}
          <rect x="20" y="24" width="60" height="112" rx="4" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
          {/* Inner Glass Viewport */}
          <rect x="28" y="34" width="44" height="64" rx="2" fill="#E0F2FE" opacity="0.85" stroke="#BAE6FD" strokeWidth="1" />
          {/* Glass glare line */}
          <line x1="32" y1="40" x2="68" y2="76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          {/* Internal Hose Reel */}
          <circle cx="50" cy="66" r="16" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />
          <circle cx="50" cy="66" r="10" fill="#991B1B" />
          <circle cx="50" cy="66" r="4" fill="#D97706" />
          {/* Brass Valve Nozzle */}
          <path d="M48 108 H52 V118 H48 Z" fill="#D97706" />
          <circle cx="50" cy="120" r="3" fill="#B45309" />
          {/* Cabinet Handle & Lock */}
          <rect x="74" y="76" width="3" height="12" rx="1" fill="#CBD5E1" />
          <rect x="28" y="104" width="44" height="24" rx="2" fill="#991B1B" />
          <text x="50" y="119" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
            INCENDIO
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-44 flex items-center justify-center p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl group-hover:bg-red-50/20 dark:group-hover:bg-red-950/20 transition-colors">
      <svg
        viewBox="0 0 100 160"
        className="h-36 w-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Valve & Lever Assembly */}
        <path d="M47 32 H53 V26 H47 Z" fill="#D97706" /> {/* Brass Valve */}
        <path d="M43 26 H57 V22 H43 Z" fill="#1E293B" /> {/* Valve Cap */}
        <path d="M38 22 C38 18 42 16 50 16 C58 16 62 18 62 22 Z" fill="#334155" /> {/* Handle */}
        <path d="M36 21 L52 14 L55 17 L38 24 Z" fill="#0F172A" /> {/* Discharge Lever */}
        <circle cx="56" cy="19" r="2.5" fill="#EAB308" /> {/* Safety Pull Pin */}

        {/* Pressure Gauge (PQS, Water, Solkaflam and K; CO2 does not use gauge) */}
        {!isCo2 && (
          <g>
            <circle cx="59" cy="27" r="4.5" fill="#F8FAFC" stroke="#334155" strokeWidth="1" />
            <path d="M59 27 L61 25" stroke="#16A34A" strokeWidth="1" strokeLinecap="round" />
            <circle cx="59" cy="27" r="1" fill="#0F172A" />
          </g>
        )}

        {/* Neck & Inspection Collar Ring */}
        <rect x="44" y="31" width="12" height="4" rx="1" fill={isK ? '#A855F7' : '#FACC15'} />

        {/* Cylinder Body */}
        <rect x="33" y="35" width="34" height="100" rx="12" fill={cylinderColor} />
        {/* Cylinder Highlight Gradient Strip */}
        <rect x="38" y="37" width="5" height="96" rx="2" fill="white" opacity="0.25" />
        <rect x="61" y="37" width="4" height="96" rx="2" fill={cylinderAccent} opacity="0.4" />
        {/* Base Ring Foot */}
        <rect x="31" y="132" width="38" height="6" rx="2" fill="#0F172A" />

        {/* Inspection & Compliance Label */}
        <rect x="37" y="55" width="26" height="52" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
        <rect x="40" y="59" width="20" height="3" fill={cylinderColor} />
        <line x1="40" y1="66" x2="57" y2="66" stroke="#0F172A" strokeWidth="1" strokeLinecap="round" />
        <line x1="40" y1="70" x2="54" y2="70" stroke="#64748B" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="40" y1="74" x2="58" y2="74" stroke="#64748B" strokeWidth="0.8" strokeLinecap="round" />

        {/* Class Pictogram Badges */}
        {isK ? (
          <g>
            <rect x="40" y="80" width="10" height="7" rx="1" fill="#9333EA" />
            <text x="45" y="85.5" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">K</text>
            <rect x="52" y="80" width="8" height="7" rx="1" fill="#D97706" />
          </g>
        ) : isCo2 ? (
          <g>
            <rect x="41" y="80" width="8" height="7" rx="1" fill="#E11D48" />
            <text x="45" y="85.5" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">B</text>
            <rect x="51" y="80" width="8" height="7" rx="1" fill="#0284C7" />
            <text x="55" y="85.5" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">C</text>
          </g>
        ) : isWater ? (
          <g>
            <rect x="44" y="80" width="12" height="7" rx="1" fill="#0284C7" />
            <text x="50" y="85.5" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">A</text>
          </g>
        ) : isSolk ? (
          <g>
            <rect x="40" y="80" width="6" height="6" rx="1" fill="#0284C7" />
            <rect x="47" y="80" width="6" height="6" rx="1" fill="#E11D48" />
            <rect x="54" y="80" width="6" height="6" rx="1" fill="#16A34A" />
          </g>
        ) : (
          <g>
            <rect x="40" y="80" width="6" height="6" rx="1" fill="#0284C7" />
            <rect x="47" y="80" width="6" height="6" rx="1" fill="#E11D48" />
            <rect x="54" y="80" width="6" height="6" rx="1" fill="#EAB308" />
          </g>
        )}

        <line x1="40" y1="92" x2="58" y2="92" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="40" y1="96" x2="52" y2="96" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="40" y1="100" x2="56" y2="100" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />

        {/* Hose / Horn Assembly */}
        {isCo2 ? (
          // Large High-Pressure Discharge Horn for CO2
          <g>
            <path d="M44 28 C30 28 26 36 26 50 L26 80" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <polygon points="20,80 32,80 36,110 16,110" fill="#0F172A" /> {/* Horn nozzle */}
          </g>
        ) : isK ? (
          // Wet Chemical Wand Applicator
          <g>
            <path d="M44 28 C28 28 25 40 25 65 L25 100" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <line x1="25" y1="100" x2="18" y2="108" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="17" cy="109" r="2" fill="#D97706" />
          </g>
        ) : (
          // Flexible rubber hose with nozzle
          <g>
            <path d="M44 28 C28 28 25 40 25 65 L25 105" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="23" y="105" width="4" height="12" rx="1" fill="#D97706" /> {/* Brass Nozzle */}
          </g>
        )}

        {/* Workshop Maintenance Tag / Service Seal if it's a Service / Recharge */}
        {isService && (
          <g>
            {/* Maintenance Hanging Tag */}
            <path d="M54 36 L68 44 L64 64 L50 56 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
            <circle cx="56" cy="40" r="1.5" fill="#1E293B" />
            <line x1="56" y1="40" x2="52" y2="34" stroke="#D97706" strokeWidth="1" />
            <line x1="54" y1="48" x2="64" y2="52" stroke="#854D0E" strokeWidth="1" strokeLinecap="round" />
            <line x1="53" y1="53" x2="62" y2="57" stroke="#854D0E" strokeWidth="1" strokeLinecap="round" />
            {/* Stamp Badge with Checkmark */}
            <circle cx="28" cy="122" r="10" fill="#E53935" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M25 122 L27 124 L31 119" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function ProductCard({
  product,
  onSelectNew,
  onSelectRecharge,
}) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [feedback, setFeedback] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  // Determine if item represents a technical workshop service or recharge
  const isService =
    product?.type === 'SERVICE' ||
    Boolean(product?.isService) ||
    String(product?.sku || product?.sku_code || '').startsWith('REC-') ||
    String(product?.sku || product?.sku_code || '').startsWith('PRU-') ||
    String(product?.sku || product?.sku_code || '').startsWith('MANT-') ||
    String(product?.sku || product?.sku_code || '').startsWith('CERT-');

  // Intelligent category resolution from category, SKU or product name
  const resolvedCategory = useMemo(() => {
    if (!product) return 'PQS';
    if (product.category && product.category !== 'ALL') {
      return String(product.category).toUpperCase();
    }
    const text = `${product.sku || ''} ${product.sku_code || ''} ${product.name || ''}`.toUpperCase();
    if (text.includes('CO2') || text.includes('CARBONO')) return 'CO2';
    if (text.includes('PQS') || text.includes('POLVO') || text.includes('ABC')) return 'PQS';
    if (text.includes('H2O') || text.includes('AGUA') || text.includes('WATER')) return 'WATER';
    if (text.includes('SOLK') || text.includes('SOLKAFLAM') || text.includes('LIMPIO')) return 'SOLK';
    if (text.includes('CLASE K') || text.includes('POTASIO') || text.includes('COCINA') || text.includes('-K-')) return 'K';
    if (text.includes('GAB') || text.includes('MANG') || text.includes('VALV') || text.includes('DET')) return 'ACCESSORY';
    return 'PQS';
  }, [product]);

  // Intelligent fire class resolution
  const resolvedClassType = useMemo(() => {
    if (!product) return 'Clase ABC';
    if (product.classType) return product.classType;
    if (resolvedCategory === 'CO2') return 'Clase BC';
    if (resolvedCategory === 'WATER') return 'Clase A';
    if (resolvedCategory === 'K') return 'Clase K';
    if (resolvedCategory === 'SOLK') return 'Clase ABC';
    if (resolvedCategory === 'ACCESSORY') return 'Accesorio';
    if (isService) return 'Servicio / Taller';
    return 'Clase ABC';
  }, [product, resolvedCategory, isService]);

  // Intelligent capacity resolution
  const resolvedCapacity = useMemo(() => {
    if (!product) return '10 Lbs';
    if (product.capacity) return product.capacity;
    const text = `${product.name || ''} ${product.sku || ''} ${product.sku_code || ''}`;
    const match = text.match(/(\d+(?:\.\d+)?\s*(?:Lbs|Kg|Gal|Galones|Lts|Litros|L|Pulgadas|Metros))/i);
    if (match) return match[1];
    return isService ? 'Taller Autorizado' : '10 Lbs';
  }, [product, isService]);

  // Intelligent agent spec resolution
  const resolvedAgent = useMemo(() => {
    if (!product) return 'Polvo Químico Seco ABC';
    if (product.agent) return product.agent;
    if (resolvedCategory === 'CO2') return 'Dióxido de Carbono Puro (CO2)';
    if (resolvedCategory === 'WATER') return 'Agua con Aditivo Humectante';
    if (resolvedCategory === 'K') return 'Acetato de Potasio (Agente Químico Húmedo)';
    if (resolvedCategory === 'SOLK') return 'Agente Limpio Solkaflam (No conductor)';
    if (resolvedCategory === 'ACCESSORY') return 'Protección Pasiva & Gabinetes';
    if (isService) return 'Recarga y Presurización Certificada NFPA 10';
    return 'Polvo Químico Seco ABC';
  }, [product, resolvedCategory, isService]);

  const resolvedSku = product?.sku || product?.sku_code || 'EXT-PROD';

  // Raw image handling with validation against placeholder domains
  const rawImage = product?.image || product?.imageUrl || product?.image_url;
  const isDummyUrl = typeof rawImage === 'string' && (rawImage.includes('assets.extin.com') || rawImage.trim() === '');
  const hasValidImage = Boolean(rawImage) && !isDummyUrl && !imgFailed;

  // Normalized product object to ensure safe cart additions and unified properties
  const normalizedProduct = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      id: product.id || resolvedSku,
      sku: resolvedSku,
      sku_code: resolvedSku,
      name: product.name,
      category: resolvedCategory,
      classType: resolvedClassType,
      capacity: resolvedCapacity,
      agent: resolvedAgent,
      description: product.description || `Extintor y equipo contra incendios con homologación técnica bajo normativa NFPA 10 y COVENIN.`,
      image: hasValidImage ? rawImage : undefined,
      type: isService ? 'SERVICE' : (product.type || 'PRODUCT'),
    };
  }, [product, resolvedSku, resolvedCategory, resolvedClassType, resolvedCapacity, resolvedAgent, hasValidImage, rawImage, isService]);

  if (!product || !normalizedProduct) return null;

  const handleRequestNew = () => {
    setFeedback('new');
    addToCart(normalizedProduct, 'PRODUCT');
    if (onSelectNew) {
      onSelectNew(normalizedProduct);
    }
    setTimeout(() => setFeedback(null), 1800);
  };

  const handleRequestRecharge = () => {
    setFeedback('recharge');
    addToCart(normalizedProduct, 'SERVICE');
    if (onSelectRecharge) {
      onSelectRecharge(normalizedProduct);
    }
    setTimeout(() => setFeedback(null), 1800);
  };

  // Badges color logic based on fire class
  const getClassBadgeVariant = (cls) => {
    if (cls?.includes('ABC')) return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    if (cls?.includes('BC')) return 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
    if (cls?.includes('K')) return 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
    if (cls?.includes('A')) return 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/60';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
  };

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200">
      <div>
        {/* Top Header with Image & Badges */}
        <CardHeader className="p-4 pb-2">
          {/* Badges Bar */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${getClassBadgeVariant(
                resolvedClassType
              )}`}
            >
              {resolvedClassType}
            </span>
            <Badge variant="outline" className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
              {resolvedCapacity}
            </Badge>
          </div>

          {/* Extinguisher Image Container: GUARANTEES no blank, collapsed or dark-only box */}
          <div className="relative overflow-hidden rounded-xl">
            {hasValidImage ? (
              <div className="relative w-full h-44 flex items-center justify-center p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl group-hover:bg-red-50/20 dark:group-hover:bg-red-950/20 transition-colors">
                <img
                  src={rawImage}
                  alt={normalizedProduct.name}
                  className="max-h-36 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImgFailed(true)}
                />
              </div>
            ) : (
              <ExtinguisherIcon
                type={resolvedCategory}
                classType={resolvedClassType}
                isService={isService}
              />
            )}
          </div>
        </CardHeader>

        {/* Content Body: Title, Specs & Description */}
        <CardContent className="px-4 py-2 space-y-2">
          {/* Product Title */}
          <div className="space-y-0.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              {resolvedSku}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E53935] transition-colors line-clamp-1">
              {normalizedProduct.name}
            </h3>
          </div>

          {/* Agent Spec Pill */}
          <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 font-medium line-clamp-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] shrink-0" />
            <span className="truncate">{resolvedAgent}</span>
          </div>

          {/* Description Copy */}
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {normalizedProduct.description}
          </p>
        </CardContent>
      </div>

      {/* Footer Area: Price Concealment Notice & Action Buttons */}
      <CardFooter className="flex flex-col p-4 pt-2 gap-3 border-t border-slate-100/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/60">
        {/* STRICT PRICE CONCEALMENT NOTICE - No currency, no amounts */}
        <div className="w-full flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1 text-[#E53935]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">{t('catalog.priceNotice', 'Precios corporativos a solicitud')}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">B2B</span>
        </div>

        {/* Action Buttons: Tailored for Products (Dual CTAs) or Services (Single Recharge CTA) */}
        {isService ? (
          <Button
            size="sm"
            onClick={handleRequestRecharge}
            className="w-full bg-[#E53935] hover:bg-[#b71c1c] active:bg-[#991b1b] text-white font-bold text-xs h-9 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {feedback === 'recharge' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white animate-in zoom-in" />
                <span className="truncate">¡Servicio Añadido!</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="truncate">{t('catalog.requestRecharge', 'Solicitar Servicio de Recarga')}</span>
              </>
            )}
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Button 1: Solicitar Nuevo (Solid Safety Red #E53935) */}
            <Button
              size="sm"
              onClick={handleRequestNew}
              className="w-full bg-[#E53935] hover:bg-[#b71c1c] active:bg-[#991b1b] text-white font-bold text-xs h-9 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {feedback === 'new' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white animate-in zoom-in" />
                  <span className="truncate">¡Listo!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="truncate">{t('catalog.requestNew', 'Solicitar Nuevo')}</span>
                </>
              )}
            </Button>

            {/* Button 2: Solicitar Recarga (Safety Red Outline #E53935) */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleRequestRecharge}
              className="w-full border border-[#E53935] text-[#E53935] hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-[#b71c1c] dark:hover:text-red-300 active:bg-red-100 font-bold text-xs h-9 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-white dark:bg-slate-900"
            >
              {feedback === 'recharge' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E53935] animate-in zoom-in" />
                  <span className="truncate">¡Listo!</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="truncate">{t('catalog.requestRecharge', 'Solicitar Recarga')}</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* Temporary Feedback Notification Strip */}
        {feedback && (
          <div className="w-full text-center text-[10px] font-semibold text-[#E53935] dark:text-red-400 bg-red-50 dark:bg-red-950/50 py-0.5 rounded border border-red-100 dark:border-red-900/50 animate-in fade-in duration-200">
            {feedback === 'new'
              ? t('catalog.addedNew', 'Equipo nuevo añadido a la solicitud')
              : t('catalog.addedRecharge', 'Servicio de recarga añadido a la solicitud')}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
