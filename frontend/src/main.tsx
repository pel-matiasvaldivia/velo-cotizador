import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './admin/AuthContext'
import ProtectedRoute from './admin/components/ProtectedRoute'
import AdminLayout from './admin/components/AdminLayout'
import LoginPage from './admin/pages/LoginPage'
import DashboardPage from './admin/pages/DashboardPage'
import CotizacionesPage from './admin/pages/CotizacionesPage'
import CotizacionDetailPage from './admin/pages/CotizacionDetailPage'
import CatalogoPage from './admin/pages/CatalogoPage'
import UsuariosPage from './admin/pages/UsuariosPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Público: cotizador para clientes */}
          <Route path="/" element={<App />} />

          {/* Portal comercial */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="cotizaciones" element={<CotizacionesPage />} />
            <Route path="cotizaciones/:id" element={<CotizacionDetailPage />} />
            <Route path="catalogo" element={<CatalogoPage />} />
            <Route
              path="usuarios"
              element={
                <ProtectedRoute requireAdmin>
                  <UsuariosPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
