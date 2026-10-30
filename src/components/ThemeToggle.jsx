import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className, size = 'default' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E53935]/30',
        'border-slate-200 bg-white text-slate-700 hover:border-[#E53935] hover:text-[#E53935]',
        'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#E53935] dark:hover:text-[#E53935]',
        size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm',
        className
      )}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
