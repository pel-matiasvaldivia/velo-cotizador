import React from 'react';
import { Download, MessageCircle, Mail, MapPin, Calendar, Clock } from 'lucide-react';
import Button from '../ui/Button';

interface CotizacionResultProps {
  data: any;
  onBack: () => void;
}

const CotizacionResult: React.FC<CotizacionResultProps> = ({ data, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-velo shadow-2xl overflow-hidden border border-velo-steel border-opacity-30">
        {/* Header Ribbon */}
        <div className="bg-velo-dark p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-velo-accent flex items-center justify-center rounded-velo text-3xl font-bold">V</div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">Propuesta Técnica Preliminar</h2>
              <p className="text-velo-accent font-mono text-sm tracking-widest uppercase">Ref: {data.numeroCotizacion || 'PRE-LUD-2024'}</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-center md:items-end">
            <p className="text-xs uppercase opacity-60 mb-1">Inversión Estimada</p>
            <p className="text-3xl font-bold text-velo-accent">
              USD {data.totalEstimadoUsdMin?.toLocaleString()} - {data.totalEstimadoUsdMax?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-velo-primary border-b border-velo-steel border-opacity-30 pb-2 mb-4">Descripción del Proyecto</h3>
              <p className="text-gray-600 leading-relaxed italic border-l-4 border-velo-accent pl-4 bg-velo-light p-4 rounded-r-velo">
                "{data.descripcionProyecto || 'Sin descripción disponible'}"
              </p>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-velo-primary border-b border-velo-steel border-opacity-30 pb-2 mb-4">Equipamiento Detallado</h3>
              <div className="space-y-4">
                {data.items?.map((item: any, i: number) => (
                  <div key={i} className="p-4 border border-velo-steel border-opacity-20 rounded-velo hover:bg-velo-light transition-colors">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold text-velo-dark">{item.descripcion}</h4>
                      <span className="text-xs bg-velo-primary text-white px-2 py-0.5 rounded-full">Item {i+1}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{item.detalleTecnico}</p>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-velo-primary">
                      <span>Rango: USD {item.precioMinUsd?.toLocaleString()} - {item.precioMaxUsd?.toLocaleString()}</span>
                      <span>Entrega: {item.tiempoFabricacionSemanas} semanas</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 bg-velo-light p-6 rounded-velo border border-velo-steel border-opacity-20 flex flex-col h-fit">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-velo-primary mb-4">Especificaciones</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-velo-accent" />
                  <span className="text-gray-600">Ubicación: <strong className="text-velo-dark">{data.lead?.provincia || 'Consultar'}</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-velo-accent" />
                  <span className="text-gray-600">Espera: <strong className="text-velo-dark">{data.tiempoFabricacionSemanas} semanas</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-velo-accent" />
                  <span className="text-gray-600">Prioridad: <strong className="text-velo-dark uppercase">{data.prioridadComercial}</strong></span>
                </li>
              </ul>
            </section>

            <div className="flex flex-col gap-3 pt-6 border-t border-velo-steel border-opacity-30">
              <Button variant="primary" className="w-full">
                <Download className="w-4 h-4" /> Descargar PDF
              </Button>
              <Button variant="accent" className="w-full">
                <MessageCircle className="w-4 h-4" /> Hablar con Asesor
              </Button>
              <Button variant="outline" className="w-full" onClick={onBack}>
                Nueva Consulta
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="bg-velo-light p-4 text-[10px] text-center text-gray-400 uppercase tracking-widest border-t border-velo-steel border-opacity-20">
          Los precios expresados son estimados en USD. La cotización final requiere una visita técnica obligatoria in situ.
        </div>
      </div>
    </div>
  );
};

export default CotizacionResult;
