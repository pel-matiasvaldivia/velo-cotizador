import React from 'react';
import { Factory } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-velo-dark text-white border-b border-white border-opacity-10 py-4 px-6 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-velo-accent p-2 rounded-velo">
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl tracking-tight leading-none uppercase">Velo <span className="text-velo-accent font-bold">Argentina</span></h1>
            <p className="text-[10px] uppercase tracking-widest opacity-60">Tanques y Maquinaria Industrial</p>
          </div>
        </div>
        
        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wider font-semibold">
          <a href="#" className="hover:text-velo-accent transition-colors">Vino</a>
          <a href="#" className="hover:text-velo-accent transition-colors">Cerveza</a>
          <a href="#" className="hover:text-velo-accent transition-colors">Industrial</a>
          <a href="#" className="hover:text-velo-accent transition-colors bg-velo-accent px-4 py-1 rounded-velo text-white">Cotizar</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
