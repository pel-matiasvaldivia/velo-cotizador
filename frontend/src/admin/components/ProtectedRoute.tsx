import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-velo-primary">
        Cargando…
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (requireAdmin && user.rol !== 'admin') return <Navigate to="/admin" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
