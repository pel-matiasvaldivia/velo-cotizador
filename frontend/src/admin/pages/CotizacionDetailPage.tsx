import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../api/client';
import { estadoBadge } from './CotizacionesPage';

interface Item {
  id: string;
  descripcion: string;
  detalleTecnico: string;
  precioMinUsd: number | null;
  precioMaxUsd: number | null;
  tiempoFabricacionSemanas: number | null;
}

interface Cotizacion {
  id: string;
  numeroCotizacion: string;
  division: string;
  estado: string;
  prioridadComercial: string;
  asignadoA: string | null;
  notasInternas: string | null;
  descripcionProyecto: string;
  totalEstimadoUsdMin: number | null;
  totalEstimadoUsdMax: number | null;
  tiempoFabricacionSemanas: number | null;
  requiereVisitaTecnica: boolean;
  created_at: string;
  lead?: {
    nombre: string;
    empresa: string;
    email: string;
    telefono: string;
    provincia: string;
  };
  items?: Item[];
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

const CotizacionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cot, setCot] = useState<Cotizacion | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<Cotizacion>(`/cotizaciones/${id}`).then((res) => setCot(res.data));
  }, [id]);

  const patch = (changes: Partial<Cotizacion>) => {
    setCot((prev) => (prev ? { ...prev, ...changes } : prev));
    setSaved(false);
  };

  const save = async () => {
    if (!cot) return;
    setSaving(true);
    try {
      const res = await api.patch<Cotizacion>(`/cotizaciones/${cot.id}`, {
        estado: cot.estado,
        prioridadComercial: cot.prioridadComercial,
        asignadoA: cot.asignadoA,
        notasInternas: cot.notasInternas,
      });
      setCot(res.data);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!cot) return <div className="text-gray-400">Cargando…</div>;

  const money = (v: number | null) => (v == null ? '—' : `USD ${v.toLocaleString()}`);

  return (
    <div>
      <Link
        to="/admin/cotizaciones"
        className="inline-flex items-center gap-2 text-sm text-velo-primary mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a cotizaciones
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="font-mono text-velo-accent text-sm">{cot.numeroCotizacion}</div>
          <h1 className="text-2xl font-bold text-velo-dark">
            {cot.lead?.nombre}{' '}
            <span className="text-gray-400 text-lg font-normal">
              · {cot.lead?.empresa || 'Particular'}
            </span>
          </h1>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge(cot.estado)}`}
        >
          {cot.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-velo border border-velo-steel/30 p-6">
            <h2 className="font-bold text-velo-dark mb-3">Proyecto</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {cot.descripcionProyecto || 'Sin descripción'}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <div className="text-[11px] uppercase text-gray-400">Estimado total</div>
                <div className="font-bold text-velo-dark">
                  {money(cot.totalEstimadoUsdMin)} - {money(cot.totalEstimadoUsdMax)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-gray-400">Plazo</div>
                <div className="font-bold text-velo-dark">
                  {cot.tiempoFabricacionSemanas ?? '—'} semanas
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-gray-400">Visita técnica</div>
                <div className="font-bold text-velo-dark">
                  {cot.requiereVisitaTecnica ? 'Requerida' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-gray-400">División</div>
                <div className="font-bold text-velo-dark capitalize">{cot.division}</div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-velo border border-velo-steel/30 p-6">
            <h2 className="font-bold text-velo-dark mb-3">Equipamiento propuesto</h2>
            <div className="space-y-3">
              {(cot.items ?? []).map((item) => (
                <div key={item.id} className="border border-velo-steel/20 rounded-velo p-4">
                  <div className="font-semibold text-velo-dark">{item.descripcion}</div>
                  <div className="text-xs text-gray-500 mb-2">{item.detalleTecnico}</div>
                  <div className="flex justify-between text-xs text-velo-primary font-semibold">
                    <span>
                      {money(item.precioMinUsd)} - {money(item.precioMaxUsd)}
                    </span>
                    <span>{item.tiempoFabricacionSemanas ?? '—'} semanas</span>
                  </div>
                </div>
              ))}
              {(!cot.items || cot.items.length === 0) && (
                <div className="text-sm text-gray-400">Sin ítems cargados.</div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-velo border border-velo-steel/30 p-6">
            <h2 className="font-bold text-velo-dark mb-3">Contacto</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Email: </span>
                <span className="text-velo-dark">{cot.lead?.email}</span>
              </div>
              <div>
                <span className="text-gray-400">Teléfono: </span>
                <span className="text-velo-dark">{cot.lead?.telefono || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400">Provincia: </span>
                <span className="text-velo-dark">{cot.lead?.provincia || '—'}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right: management */}
        <div className="space-y-4">
          <section className="bg-white rounded-velo border border-velo-steel/30 p-6 space-y-4 sticky top-8">
            <h2 className="font-bold text-velo-dark">Gestión</h2>

            <div>
              <label className="text-[11px] uppercase font-bold text-velo-primary">Estado</label>
              <select
                value={cot.estado}
                onChange={(e) => patch({ estado: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo bg-white"
              >
                {estados.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-velo-primary">
                Prioridad
              </label>
              <select
                value={cot.prioridadComercial}
                onChange={(e) => patch({ prioridadComercial: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo bg-white"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-velo-primary">
                Asignado a
              </label>
              <input
                value={cot.asignadoA ?? ''}
                onChange={(e) => patch({ asignadoA: e.target.value })}
                placeholder="Nombre del comercial"
                className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-velo-primary">
                Notas internas
              </label>
              <textarea
                rows={4}
                value={cot.notasInternas ?? ''}
                onChange={(e) => patch({ notasInternas: e.target.value })}
                placeholder="Notas del seguimiento…"
                className="w-full mt-1 px-3 py-2 border border-velo-steel rounded-velo"
              />
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="w-full bg-velo-accent text-white font-semibold py-2.5 rounded-velo hover:bg-opacity-90 disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            {saved && (
              <div className="text-center text-green-600 text-sm">Cambios guardados ✓</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CotizacionDetailPage;
