import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../AuthContext';

interface Producto {
  id: string;
  division: string;
  categoria: string | null;
  nombre: string;
  descripcion: string | null;
  unidad: string;
  costoBaseUsd: number;
  margenPct: number;
  precioVentaUsd: number;
  activo: boolean;
}

const empty = {
  division: 'industrial',
  categoria: '',
  nombre: '',
  descripcion: '',
  unidad: 'unidad',
  costoBaseUsd: 0,
  margenPct: 30,
  activo: true,
};

type FormState = typeof empty & { id?: string };

const CatalogoPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';
  const [productos, setProductos] = useState<Producto[]>([]);
  const [division, setDivision] = useState('');
  const [editing, setEditing] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (division) params.division = division;
    api
      .get<Producto[]>('/productos', { params })
      .then((res) => setProductos(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division]);

  const save = async () => {
    if (!editing) return;
    const payload = {
      division: editing.division,
      categoria: editing.categoria || undefined,
      nombre: editing.nombre,
      descripcion: editing.descripcion || undefined,
      unidad: editing.unidad,
      costoBaseUsd: Number(editing.costoBaseUsd),
      margenPct: Number(editing.margenPct),
      activo: editing.activo,
    };
    if (editing.id) {
      await api.patch(`/productos/${editing.id}`, payload);
    } else {
      await api.post('/productos', payload);
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este producto del catálogo?')) return;
    await api.delete(`/productos/${id}`);
    load();
  };

  const preview = editing
    ? Math.round(Number(editing.costoBaseUsd) * (1 + Number(editing.margenPct) / 100) * 100) / 100
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-velo-dark">Catálogo</h1>
        {isAdmin && (
          <button
            onClick={() => setEditing({ ...empty })}
            className="flex items-center gap-2 bg-velo-accent text-white px-4 py-2 rounded-velo font-semibold hover:bg-opacity-90"
          >
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        )}
      </div>
      <p className="text-gray-500 mb-6">
        Productos, costos, márgenes y precios de venta.
      </p>

      <div className="mb-5">
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="px-4 py-2 border border-velo-steel rounded-velo bg-white"
        >
          <option value="">Todas las divisiones</option>
          <option value="vino">Vino</option>
          <option value="cerveza">Cerveza</option>
          <option value="industrial">Industrial</option>
          <option value="multiple">Múltiple</option>
        </select>
      </div>

      <div className="bg-white rounded-velo border border-velo-steel/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-velo-light text-velo-primary uppercase text-[11px] tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3">División</th>
              <th className="text-right px-4 py-3">Costo</th>
              <th className="text-right px-4 py-3">Margen</th>
              <th className="text-right px-4 py-3">Precio venta</th>
              <th className="text-center px-4 py-3">Estado</th>
              {isAdmin && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Cargando…
                </td>
              </tr>
            )}
            {!loading &&
              productos.map((p) => (
                <tr key={p.id} className="border-t border-velo-steel/20 hover:bg-velo-light/50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-velo-dark">{p.nombre}</div>
                    <div className="text-xs text-gray-400">
                      {p.categoria} · {p.unidad}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.division}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    USD {p.costoBaseUsd.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.margenPct}%</td>
                  <td className="px-4 py-3 text-right font-bold text-velo-dark">
                    USD {p.precioVentaUsd.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setEditing({
                              id: p.id,
                              division: p.division,
                              categoria: p.categoria ?? '',
                              nombre: p.nombre,
                              descripcion: p.descripcion ?? '',
                              unidad: p.unidad,
                              costoBaseUsd: p.costoBaseUsd,
                              margenPct: p.margenPct,
                              activo: p.activo,
                            })
                          }
                          className="text-velo-primary hover:text-velo-accent"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="text-gray-400 hover:text-velo-accent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            {!loading && productos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No hay productos cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-velo shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-velo-dark mb-4">
              {editing.id ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="col-span-2 text-sm">
                Nombre
                <input
                  value={editing.nombre}
                  onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
              <label className="text-sm">
                División
                <select
                  value={editing.division}
                  onChange={(e) => setEditing({ ...editing, division: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo bg-white"
                >
                  <option value="vino">Vino</option>
                  <option value="cerveza">Cerveza</option>
                  <option value="industrial">Industrial</option>
                  <option value="multiple">Múltiple</option>
                </select>
              </label>
              <label className="text-sm">
                Categoría
                <input
                  value={editing.categoria}
                  onChange={(e) => setEditing({ ...editing, categoria: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
              <label className="text-sm">
                Unidad
                <input
                  value={editing.unidad}
                  onChange={(e) => setEditing({ ...editing, unidad: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
              <label className="text-sm">
                Costo base (USD)
                <input
                  type="number"
                  value={editing.costoBaseUsd}
                  onChange={(e) =>
                    setEditing({ ...editing, costoBaseUsd: Number(e.target.value) })
                  }
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
              <label className="text-sm">
                Margen (%)
                <input
                  type="number"
                  value={editing.margenPct}
                  onChange={(e) => setEditing({ ...editing, margenPct: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
              <label className="text-sm flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={editing.activo}
                  onChange={(e) => setEditing({ ...editing, activo: e.target.checked })}
                />
                Activo
              </label>
              <label className="col-span-2 text-sm">
                Descripción
                <textarea
                  rows={2}
                  value={editing.descripcion}
                  onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
                />
              </label>
            </div>

            <div className="bg-velo-light rounded-velo px-4 py-3 mt-4 flex justify-between text-sm">
              <span className="text-gray-500">Precio de venta calculado</span>
              <span className="font-bold text-velo-dark">USD {preview.toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border border-velo-steel rounded-velo"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={!editing.nombre}
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

export default CatalogoPage;
