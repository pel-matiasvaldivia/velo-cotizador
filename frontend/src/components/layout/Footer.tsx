import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-velo-dark text-white py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">VELO <span className="text-velo-accent">ARGENTINA</span></h2>
          <p className="text-gray-400 max-w-md">
            Líderes en fabricación de soluciones de acero inoxidable para la industria alimenticia, 
            vitivinícola y cervecera. Calidad, precisión e innovación desde Mendoza para el mundo.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-velo-accent">Contacto</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Calle N°7 y Santa Rita, Parque Industrial Eje Norte</li>
            <li>Las Heras, Mendoza (5543)</li>
            <li>+54 261 447 3015/3017</li>
            <li>info@velo-argentina.com.ar</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-velo-accent">Redes</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white border-opacity-10 mt-12 pt-8 flex flex-col md:row justify-between text-xs text-gray-500 uppercase tracking-widest">
        <p>© {new Date().getFullYear()} Velo Argentina S.A. Todos los derechos reservados.</p>
        <a href="/admin" className="hover:text-velo-accent transition-colors">
          Acceso equipo comercial
        </a>
      </div>
    </footer>
  );
};

export default Footer;
