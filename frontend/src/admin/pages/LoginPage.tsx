import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in -> go to the panel.
  React.useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch {
      setError('Credenciales inválidas. Verificá tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-velo-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-white">
            VELO <span className="text-velo-accent">ARGENTINA</span>
          </div>
          <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">
            Portal Comercial
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-velo shadow-2xl p-8 space-y-5"
        >
          <h1 className="text-xl font-bold text-velo-dark">Iniciar sesión</h1>

          {error && (
            <div className="bg-velo-accent/10 text-velo-accent text-sm rounded-velo px-4 py-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold text-velo-primary tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-velo-steel rounded-velo outline-none focus:ring-2 focus:ring-velo-primary"
              placeholder="tu@velo-argentina.com.ar"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold text-velo-primary tracking-wider">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-velo-steel rounded-velo outline-none focus:ring-2 focus:ring-velo-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-velo-accent text-white font-semibold py-2.5 rounded-velo hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
