import React from 'react';
import VeloLayout from './components/layout/VeloLayout';
import CotizadorForm from './components/cotizador/CotizadorForm';

const App: React.FC = () => {
  return (
    <VeloLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
          <span className="bg-velo-accent bg-opacity-10 text-velo-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block italic">
            Potenciado por Inteligencia Artificial
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-velo-dark mb-6 leading-tight">
            Cotización Técnica <br /> <span className="text-velo-primary">en tiempo real</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Combinamos décadas de experiencia industrial con tecnología de punta para brindarte 
            propuestas comerciales precisas y personalizadas para tu proyecto.
          </p>
        </section>

        <section className="relative z-10">
          <CotizadorForm />
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-velo-steel border-opacity-20 pt-16">
          <div>
            <div className="text-velo-accent font-bold text-4xl mb-2 italic">01</div>
            <h3 className="font-bold text-lg mb-2 uppercase tracking-wide">Precisión</h3>
            <p className="text-sm text-gray-400">Nuestro motor de IA utiliza el catálogo real de Velo para cálculos técnicos exactos.</p>
          </div>
          <div>
            <div className="text-velo-accent font-bold text-4xl mb-2 italic">02</div>
            <h3 className="font-bold text-lg mb-2 uppercase tracking-wide">Inmediatez</h3>
            <p className="text-sm text-gray-400">Recibí una propuesta preliminar estructurada en minutos, no en días.</p>
          </div>
          <div>
            <div className="text-velo-accent font-bold text-4xl mb-2 italic">03</div>
            <h3 className="font-bold text-lg mb-2 uppercase tracking-wide">Personalización</h3>
            <p className="text-sm text-gray-400">Cada solución es diseñada a medida según las necesidades específicas de tu planta.</p>
          </div>
        </section>
      </div>
    </VeloLayout>
  );
};

export default App;
