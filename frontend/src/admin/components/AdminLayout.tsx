import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../AuthContext';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-velo text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-velo-accent text-white'
      : 'text-gray-300 hover:bg-white/10 hover:text-white'
  }`;

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-velo-light">
      {/* Sidebar */}
      <aside className="w-64 bg-velo-dark text-white flex flex-col fixed h-full">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="text-xl font-bold">
            VELO <span className="text-velo-accent">ARGENTINA</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
            Portal Comercial
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink to="/admin" end className={navItemClass}>
            <LayoutDashboard className="w-4 h-4" /> Panel
          </NavLink>
          <NavLink to="/admin/cotizaciones" className={navItemClass}>
            <FileText className="w-4 h-4" /> Cotizaciones
          </NavLink>
          <NavLink to="/admin/catalogo" className={navItemClass}>
            <Package className="w-4 h-4" /> Catálogo
          </NavLink>
          {user?.rol === 'admin' && (
            <NavLink to="/admin/usuarios" className={navItemClass}>
              <Users className="w-4 h-4" /> Usuarios
            </NavLink>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="px-2 mb-3">
            <div className="text-sm font-semibold truncate">{user?.nombre}</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wide">
              {user?.rol}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-velo text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
