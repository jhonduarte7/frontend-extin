import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <h1 className="text-6xl font-black text-safety-600">404</h1>
      <h2 className="text-xl font-bold text-slate-900">Página No Encontrada</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        La dirección solicitada no existe o ha sido movida dentro del portal de Equi-Extin.
      </p>
      <Button asChild className="bg-safety-600 hover:bg-safety-700 text-white font-semibold text-xs">
        <Link to="/">Volver al Inicio</Link>
      </Button>
    </div>
  );
}
