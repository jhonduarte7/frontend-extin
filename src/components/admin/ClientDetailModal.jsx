import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Flame,
  RefreshCw,
  Wrench,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * ClientDetailModal
 * Corporate B2B CRM Modal for inspecting customer details, managing associated fire extinguishers,
 * and monitoring Hydrostatic Test (PH) and recharge expiration alerts.
 */
export default function ClientDetailModal({
  customer,
  isOpen,
  onClose,
  onAddEquipment,
  onPerformRecharge,
}) {
  const { t } = useTranslation();

  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [newEq, setNewEq] = useState({
    serialNumber: '',
    equipmentType: 'Extintor PQS 10 Lbs ABC',
    capacity: '10 Lbs',
    location: 'Área Principal',
    lastRefillDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  if (!isOpen || !customer) return null;

  const equipmentList = customer.equipment || [];
  const today = new Date();

  // Helper to determine status and days remaining
  const getHydrostaticStatus = (expirationDateStr) => {
    if (!expirationDateStr) return { status: 'VALID', label: 'VIGENTE', diffDays: 999 };

    const expDate = new Date(expirationDateStr);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'EXPIRED',
        label: t('admin.clients.statusExpired', 'PRUEBA VENCIDA'),
        diffDays,
      };
    }
    if (diffDays <= 30) {
      return {
        status: 'EXPIRING_SOON',
        label: t('admin.clients.statusExpiringSoon', 'POR VENCER'),
        diffDays,
      };
    }
    return {
      status: 'VALID',
      label: t('admin.clients.statusValid', 'OPERATIVO / VIGENTE'),
      diffDays,
    };
  };

  // Submit new equipment association
  const handleSaveEquipment = (e) => {
    e.preventDefault();
    if (!newEq.serialNumber.trim()) return;

    const createdEquipment = {
      id: `eq-${Date.now().toString().slice(-6)}`,
      serialNumber: newEq.serialNumber.trim().toUpperCase(),
      equipmentType: newEq.equipmentType,
      capacity: newEq.capacity,
      location: newEq.location.trim() || 'Planta Principal',
      lastRefillDate: newEq.lastRefillDate,
      expirationDate: newEq.expirationDate,
      notes: newEq.notes.trim(),
    };

    if (onAddEquipment) {
      onAddEquipment(customer.id || customer.tax_id, createdEquipment);
    }

    setIsAddingEquipment(false);
    setNewEq({
      serialNumber: '',
      equipmentType: 'Extintor PQS 10 Lbs ABC',
      capacity: '10 Lbs',
      location: 'Área Principal',
      lastRefillDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      notes: '',
    });
  };

  // Quick recharge registration (renews hydrostatic/recharge validity for 1 year)
  const handleQuickRecharge = (equipment) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextYearStr = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];

    const updatedEq = {
      ...equipment,
      lastRefillDate: todayStr,
      expirationDate: nextYearStr,
      notes: `Recarga certificada Equi-Extin realizada el ${todayStr}`,
    };

    if (onPerformRecharge) {
      onPerformRecharge(customer.id || customer.tax_id, updatedEq);
    }
  };

  // Count expired and expiring
  const expiredCount = equipmentList.filter((eq) => getHydrostaticStatus(eq.expirationDate).status === 'EXPIRED').length;
  const expiringCount = equipmentList.filter((eq) => getHydrostaticStatus(eq.expirationDate).status === 'EXPIRING_SOON').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6 text-center">
        <div
          className="w-full max-w-4xl transform rounded-2xl bg-white dark:bg-slate-900 text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#E53935] flex items-center justify-center border border-red-100 dark:border-red-900/50 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {customer.business_name || customer.name}
                  </h3>
                  {expiredCount > 0 ? (
                    <Badge variant="destructive" className="bg-[#E53935] text-[10px] font-black uppercase tracking-wider animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {expiredCount} {expiredCount === 1 ? 'VENCIDO' : 'VENCIDOS'}
                    </Badge>
                  ) : expiringCount > 0 ? (
                    <Badge variant="outline" className="text-[10px] font-bold text-amber-600 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40">
                      <Clock className="w-3 h-3 mr-1" />
                      {expiringCount} POR VENCER
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  RIF: {customer.tax_id || customer.document_number} • {customer.city || 'Caracas'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Customer Details & Contact Actions Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              {/* Contact Info */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Persona de Contacto
                </span>
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#E53935]" />
                  <span>{customer.contact_person || 'Responsable de Seguridad'}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${customer.phone}`} className="hover:text-[#E53935] font-semibold font-mono">
                    {customer.phone || '+58 212-0000000'}
                  </a>
                </div>
                <div className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${customer.email}`} className="hover:text-[#E53935] truncate">
                    {customer.email || 'contacto@empresa.com'}
                  </a>
                </div>
              </div>

              {/* Fiscal Address */}
              <div className="space-y-1.5 md:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dirección Fiscal & Despacho
                </span>
                <div className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E53935] shrink-0 mt-0.5" />
                  <span>{customer.address || 'Caracas, Edo. Miranda'}</span>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <a
                    href={`tel:${customer.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold hover:bg-emerald-100"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Llamar al Cliente</span>
                  </a>

                  <a
                    href={`mailto:${customer.email}?subject=Aviso de Vencimiento de Extintores - Equi-Extin`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold hover:border-[#E53935]"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Enviar Notificación</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Warning Alert Banner if Expired */}
            {expiredCount > 0 && (
              <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 flex items-start gap-3 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">
                    ¡Atención! Este cliente posee {expiredCount} equipo(s) con la prueba hidrostática o recarga vencida.
                  </p>
                  <p className="text-[11px] text-red-700 dark:text-red-400 mt-0.5 leading-snug">
                    Según la norma COVENIN 1040 y NFPA 10, estos cilindros no garantizan presión de descarga y representan un riesgo de seguridad. Contactar de inmediato para coordinar el retiro y recarga en taller.
                  </p>
                </div>
              </div>
            )}

            {/* Equipment Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#E53935]" />
                  <span>{t('admin.clients.equipmentTitle', 'Equipos y Recargas Registradas')}</span>
                  <span className="text-slate-400 font-mono font-normal">({equipmentList.length})</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Historial de cilindros en comodato o propiedad con seguimiento de prueba hidrostática (PH).
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddingEquipment(!isAddingEquipment)}
                className="bg-[#E53935] hover:bg-[#b71c1c] text-white font-bold text-xs shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isAddingEquipment ? 'Cancelar Registro' : 'Asociar Nuevo Extintor'}
              </Button>
            </div>

            {/* Form to Add Equipment */}
            {isAddingEquipment && (
              <form
                onSubmit={handleSaveEquipment}
                className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-red-200 dark:border-red-900/50 space-y-3 animate-in fade-in duration-200 text-xs"
              >
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-[#E53935]" />
                  <span>Asociar Extintor al Cliente</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Serie / Folio <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. SN-2026-9041"
                      value={newEq.serialNumber}
                      onChange={(e) => setNewEq({ ...newEq, serialNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Extintor
                    </label>
                    <select
                      value={newEq.equipmentType}
                      onChange={(e) => setNewEq({ ...newEq, equipmentType: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="Extintor PQS 10 Lbs ABC">Extintor PQS 10 Lbs ABC</option>
                      <option value="Extintor PQS 20 Lbs ABC">Extintor PQS 20 Lbs ABC</option>
                      <option value="Extintor CO2 10 Lbs BC">Extintor CO2 10 Lbs BC</option>
                      <option value="Extintor CO2 15 Lbs BC">Extintor CO2 15 Lbs BC</option>
                      <option value="Extintor Agua Presurizada 2.5 Gal">Extintor Agua Presurizada 2.5 Gal</option>
                      <option value="Extintor Acetato de Potasio 6 Lts (K)">Extintor Acetato de Potasio 6 Lts (K)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ubicación en Empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Piso 2 - Servidores"
                      value={newEq.location}
                      onChange={(e) => setNewEq({ ...newEq, location: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha de Última Recarga
                    </label>
                    <input
                      type="date"
                      required
                      value={newEq.lastRefillDate}
                      onChange={(e) => setNewEq({ ...newEq, lastRefillDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Vencimiento Prueba Hidrostática (PH)
                    </label>
                    <input
                      type="date"
                      required
                      value={newEq.expirationDate}
                      onChange={(e) => setNewEq({ ...newEq, expirationDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingEquipment(false)}
                    className="text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#E53935] hover:bg-[#b71c1c] text-white font-bold text-xs">
                    Guardar Equipo
                  </Button>
                </div>
              </form>
            )}

            {/* Equipment Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Serial / ID</th>
                    <th className="px-4 py-3">Equipo & Capacidad</th>
                    <th className="px-4 py-3">Ubicación en Planta</th>
                    <th className="px-4 py-3">Última Recarga</th>
                    <th className="px-4 py-3">Vencimiento PH</th>
                    <th className="px-4 py-3 text-center">Estado Hidrostático</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {equipmentList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No hay extintores registrados para esta empresa todavía.
                      </td>
                    </tr>
                  ) : (
                    equipmentList.map((eq, idx) => {
                      const { status, label, diffDays } = getHydrostaticStatus(eq.expirationDate);
                      const isExpired = status === 'EXPIRED';
                      const isExpiring = status === 'EXPIRING_SOON';

                      return (
                        <tr
                          key={eq.id || idx}
                          className={`transition-colors ${
                            isExpired
                              ? 'bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100/70 dark:hover:bg-red-900/40'
                              : isExpiring
                              ? 'bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100/60'
                              : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          {/* Serial */}
                          <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                            {eq.serialNumber || `SN-${idx + 1000}`}
                          </td>

                          {/* Type */}
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {eq.equipmentType}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Capacidad: {eq.capacity || '10 Lbs'}
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            {eq.location || 'Pasillo General'}
                          </td>

                          {/* Last Refill */}
                          <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                            {eq.lastRefillDate || '2025-05-10'}
                          </td>

                          {/* Expiration Date */}
                          <td className="px-4 py-3 font-mono font-bold">
                            <span className={isExpired ? 'text-[#E53935]' : isExpiring ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}>
                              {eq.expirationDate}
                            </span>
                            {isExpired && (
                              <span className="text-[10px] font-sans font-bold text-[#E53935] block">
                                (Venció hace {Math.abs(diffDays)} días)
                              </span>
                            )}
                            {isExpiring && (
                              <span className="text-[10px] font-sans font-bold text-amber-600 block">
                                (Vence en {diffDays} días)
                              </span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="px-4 py-3 text-center">
                            {isExpired ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E53935] text-white shadow-2xs animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                {label}
                              </span>
                            ) : isExpiring ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Clock className="w-3 h-3" />
                                {label}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                {label}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickRecharge(eq)}
                              title="Registrar recarga certificada y renovar vigencia 1 año"
                              className="h-7 text-xs border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 dark:text-slate-300"
                            >
                              <RefreshCw className="w-3 h-3 mr-1 text-emerald-600" />
                              Recargar
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400 font-mono">
              Equi-Extin CRM • Mantenimiento Preventivo NFPA 10
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
