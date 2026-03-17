'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', roles: ['ADMIN', 'OPERADOR', 'SUPERVISOR'] },
    { name: 'Generar Etiquetas', path: '/admin/generar', roles: ['ADMIN'] },
    { name: 'Activar Etiqueta', path: '/operador/activar', roles: ['ADMIN', 'OPERADOR'] },
    { name: 'Impresión QR', path: '/operador/imprimir', roles: ['ADMIN', 'OPERADOR'] },
    { name: 'Reportes', path: '/supervisor/reportes', roles: ['ADMIN', 'SUPERVISOR'] },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-2xl z-20">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          AeroEmpaque
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{user?.rol}</p>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menuItems
          .filter(item => !user || item.roles.includes(user.rol))
          .map((item) => {
            const isActive = pathname.startsWith(item.path) && item.path !== '/dashboard' || pathname === item.path;
            
            return (
              <Link key={item.path} href={item.path}
                className={`block px-4 py-3 rounded-xl transition-all-smooth font-medium ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.nombre}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 mt-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
