import React, { useEffect, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { api } from '../../api/client';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'comercial';
  activo: boolean;
  created_at: string;
}

interface FormState {
  id?: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'comercial';
  activo: boolean;
}

const empty: FormState = {
  nombre: '',
  email: '',
  password: '',
  rol: 'comercial',
  activo: true,
};

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get<Usuario[]>('/usuarios')
      .then((res) => setUsuarios(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    setError('');
    try {
      if (editing.id) {
        const payload: Record<string, unknown> = {
          nombre: editing.nombre,
          email: editing.email,
          rol: editing.rol,
          activo: editing.activo,
        };
        if (editing.password) payload.password = editing.password;
        await api.patch(`/usuarios/${editing.id}`, payload);
      } else {
        await api.post('/usuarios', {
          nombre: editing.nombre,
          email: editing.email,
          password: editing.password,
          rol: editing.rol,
        });
      }
      setEditing(null);
      load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo guardar el usuario.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-velo-dark">Usuarios</h1>
        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 bg-velo-accent text-white px-4 py-2 rounded-velo font-semibold hover:bg-opacity-90"
        >
          <Plus className="w-4 h-4" /> Nuevo usuario
        </button>
      </div>
      <p className="text-gray-500 mb-6">Equipo con acceso al portal comercial.</p>

      <div className="bg-white rounded-velo border border-velo-steel/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-velo-light text-velo-primary uppercase text-[11px] tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Rol</th>
              <th className="text-center px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Cargando…
                </td>
              </tr>
            )}
            {!loading &&
              usuarios.map((u) => (
                <tr key={u.id} className="border-t border-velo-steel/20 hover:bg-velo-light/50">
                  <td className="px-4 py-3 font-semibold text-velo-dark">{u.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        u.rol === 'admin'
                          ? 'bg-velo-primary/10 text-velo-primary'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        setEditing({
                          id: u.id,
                          nombre: u.nombre,
                          email: u.email,
                          password: '',
                          rol: u.rol,
                          activo: u.activo,
                        })
                      }
                      className="text-velo-primary hover:text-velo-accent"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-velo shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-velo-dark mb-4">
              {editing.id ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            {error && (
              <div className="bg-velo-accent/10 text-velo-accent text-sm rounded-velo px-4 py-2 mb-4">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <label className="block text-sm">
                Nombre
                <input
                  value={editing.nombre}
                  onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
              <label className="block text-sm">
                Email
                <input
                  type="email"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
              <label className="block text-sm">
                {editing.id ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                <input
                  type="password"
                  value={editing.password}
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })}
                  placeholder={editing.id ? 'Dejar vacío para no cambiar' : ''}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
              <label className="block text-sm">
                Rol
                <select
                  value={editing.rol}
                  onChange={(e) =>
                    setEditing({ ...editing, rol: e.target.value as 'admin' | 'comercial' })
                  }
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo bg-white"
                >
                  <option value="comercial">Comercial</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              {editing.id && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.activo}
                    onChange={(e) => setEditing({ ...editing, activo: e.target.checked })}
                  />
                  Activo
                </label>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setEditing(null);
                  setError('');
                }}
                className="px-4 py-2 border border-velo-steel rounded-velo"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={!editing.nombre || !editing.email || (!editing.id && !editing.password)}
                className="px-4 py-2 bg-velo-accent text-white rounded-velo font-semibold disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
