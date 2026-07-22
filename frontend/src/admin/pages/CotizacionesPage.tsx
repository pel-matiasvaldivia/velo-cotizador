import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

interface Cotizacion {
  id: string;
  numeroCotizacion: string;
  division: string;
  estado: string;
  prioridadComercial: string;
  totalEstimadoUsdMin: number | null;
  totalEstimadoUsdMax: number | null;
  created_at: string;
  lead?: { nombre: string; empresa: string; email: string };
}

interface Paginated {
  data: Cotizacion[];
  total: number;
  page: number;
  totalPages: number;
}

const estados = [
  'nueva',
  'revisada',
  'enviada',
  'en_negociacion',
  'ganada',
  'perdida',
  'archivada',
];

export const estadoBadge = (estado: string) => {
  const map: Record<string, string> = {
    nueva: 'bg-blue-100 text-blue-700',
    revisada: 'bg-purple-100 text-purple-700',
    enviada: 'bg-cyan-100 text-cyan-700',
    en_negociacion: 'bg-amber-100 text-amber-700',
    ganada: 'bg-green-100 text-green-700',
    perdida: 'bg-red-100 text-red-700',
    archivada: 'bg-gray-100 text-gray-600',
  };
  return map[estado] ?? 'bg-gray-100 text-gray-600';
};

export const prioridadBadge = (p: string) => {
  const map: Record<string, string> = {
    alta: 'bg-velo-accent/15 text-velo-accent',
    media: 'bg-amber-100 text-amber-700',
    baja: 'bg-gray-100 text-gray-500',
  };
  return map[p] ?? 'bg-gray-100 text-gray-500';
};

const CotizacionesPage: React.FC = () => {
  const [result, setResult] = useState<Paginated | null>(null);
  const [estado, setEstado] = useState('');
  const [division, setDivision] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '20' };
    if (estado) params.estado = estado;
    if (division) params.division = division;
    if (search) params.search = search;
    api
      .get<Paginated>('/cotizaciones', { params })
      .then((res) => setResult(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, division, page]);

  const fmt = (min: number | null, max: number | null) =>
    min == null && max == null
      ? '—'
      : `USD ${(min ?? 0).toLocaleString()} - ${(max ?? 0).toLocaleString()}`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-velo-dark mb-1">Cotizaciones</h1>
      <p className="text-gray-500 mb-6">
        Solicitudes recibidas de los clientes.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            load();
          }}
          className="flex-1 min-w-[220px]"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por N°, cliente, empresa o email…"
            className="w-full px-4 py-2 border border-velo-steel rounded-velo outline-none focus:ring-2 focus:ring-velo-primary"
          />
        </form>
        <select
          value={estado}
          onChange={(e) => {
            setPage(1);
            setEstado(e.target.value);
          }}
          className="px-4 py-2 border border-velo-steel rounded-velo bg-white"
        >
          <option value="">Todos los estados</option>
          {estados.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select
          value={division}
          onChange={(e) => {
            setPage(1);
            setDivision(e.target.value);
          }}
          className="px-4 py-2 border border-velo-steel rounded-velo bg-white"
        >
          <option value="">Todas las divisiones</option>
          <option value="vino">Vino</option>
          <option value="cerveza">Cerveza</option>
          <option value="industrial">Industrial</option>
          <option value="multiple">Múltiple</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-velo border border-velo-steel/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-velo-light text-velo-primary uppercase text-[11px] tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">N°</th>
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-left px-4 py-3">División</th>
              <th className="text-left px-4 py-3">Estimado</th>
              <th className="text-left px-4 py-3">Prioridad</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
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
              result?.data.map((c) => (
                <tr key={c.id} className="border-t border-velo-steel/20 hover:bg-velo-light/50">
                  <td className="px-4 py-3 font-mono text-xs text-velo-primary">
                    {c.numeroCotizacion}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-velo-dark">
                      {c.lead?.nombre ?? '—'}
                    </div>
                    <div className="text-xs text-gray-400">{c.lead?.empresa}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{c.division}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {fmt(c.totalEstimadoUsdMin, c.totalEstimadoUsdMax)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${prioridadBadge(
                        c.prioridadComercial,
                      )}`}
                    >
                      {c.prioridadComercial}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${estadoBadge(
                        c.estado,
                      )}`}
                    >
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/cotizaciones/${c.id}`}
                      className="text-velo-accent font-semibold hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            {!loading && result?.data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No hay cotizaciones que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {result && result.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-500">
            Página {result.page} de {result.totalPages} · {result.total} en total
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 border border-velo-steel rounded-velo disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              disabled={page >= result.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 border border-velo-steel rounded-velo disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CotizacionesPage;
