import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

interface Stats {
  total: number;
  totalLeads: number;
  porEstado: { estado: string; total: number }[];
  porDivision: { division: string; total: number }[];
}

const estadoLabels: Record<string, string> = {
  nueva: 'Nuevas',
  revisada: 'Revisadas',
  enviada: 'Enviadas',
  en_negociacion: 'En negociación',
  ganada: 'Ganadas',
  perdida: 'Perdidas',
  archivada: 'Archivadas',
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Stats>('/cotizaciones/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('No se pudieron cargar las estadísticas.'));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-velo-dark mb-1">Panel general</h1>
      <p className="text-gray-500 mb-8">Resumen del circuito comercial.</p>

      {error && <div className="text-velo-accent mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-velo p-6 border border-velo-steel/30">
          <div className="text-4xl font-bold text-velo-accent">{stats?.total ?? '—'}</div>
          <div className="text-sm text-gray-500 mt-1 uppercase tracking-wide">
            Cotizaciones
          </div>
        </div>
        <div className="bg-white rounded-velo p-6 border border-velo-steel/30">
          <div className="text-4xl font-bold text-velo-primary">
            {stats?.totalLeads ?? '—'}
          </div>
          <div className="text-sm text-gray-500 mt-1 uppercase tracking-wide">Leads</div>
        </div>
        <div className="bg-white rounded-velo p-6 border border-velo-steel/30">
          <div className="text-4xl font-bold text-velo-dark">
            {stats?.porEstado.find((e) => e.estado === 'nueva')?.total ?? 0}
          </div>
          <div className="text-sm text-gray-500 mt-1 uppercase tracking-wide">
            Sin revisar
          </div>
        </div>
        <div className="bg-white rounded-velo p-6 border border-velo-steel/30">
          <div className="text-4xl font-bold text-green-600">
            {stats?.porEstado.find((e) => e.estado === 'ganada')?.total ?? 0}
          </div>
          <div className="text-sm text-gray-500 mt-1 uppercase tracking-wide">Ganadas</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-velo p-6 border border-velo-steel/30">
          <h2 className="font-bold text-velo-dark mb-4">Por estado</h2>
          <div className="space-y-2">
            {(stats?.porEstado ?? []).map((e) => (
              <div key={e.estado} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {estadoLabels[e.estado] ?? e.estado}
                </span>
                <span className="font-bold text-velo-dark">{e.total}</span>
              </div>
            ))}
            {stats && stats.porEstado.length === 0 && (
              <div className="text-sm text-gray-400">Sin datos todavía.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-velo p-6 border border-velo-steel/30">
          <h2 className="font-bold text-velo-dark mb-4">Por división</h2>
          <div className="space-y-2">
            {(stats?.porDivision ?? []).map((d) => (
              <div key={d.division} className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">{d.division}</span>
                <span className="font-bold text-velo-dark">{d.total}</span>
              </div>
            ))}
            {stats && stats.porDivision.length === 0 && (
              <div className="text-sm text-gray-400">Sin datos todavía.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
