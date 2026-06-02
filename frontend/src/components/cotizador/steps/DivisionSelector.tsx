import React from 'react';
import { Wine, Beer, Factory } from 'lucide-react';

interface DivisionSelectorProps {
  onSelect: (division: string) => void;
  selected: string;
}

const DivisionSelector: React.FC<DivisionSelectorProps> = ({ onSelect, selected }) => {
  const divisions = [
    { 
      id: 'vino', 
      name: 'División Vino', 
      icon: Wine, 
      desc: 'Tanques de fermentación, almacenamiento y plantas de filtrado para bodegas.' 
    },
    { 
      id: 'cerveza', 
      name: 'División Cerveza', 
      icon: Beer, 
      desc: 'Minicervecerías modulares, fermentadores unitank e isobáricos.' 
    },
    { 
      id: 'industrial', 
      name: 'División Industrial', 
      icon: Factory, 
      desc: 'Tanques sanitarios, reactores ASME, piping y soluciones industriales a medida.' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {divisions.map((div) => {
        const Icon = div.icon;
        const isSelected = selected === div.id;
        return (
          <button
            key={div.id}
            type="button"
            onClick={() => onSelect(div.id)}
            className={`flex flex-col items-center p-8 border-2 rounded-velo transition-all text-center group ${
              isSelected 
                ? 'border-velo-accent bg-velo-accent bg-opacity-5' 
                : 'border-velo-steel hover:border-velo-primary'
            }`}
          >
            <div className={`p-4 rounded-full mb-6 transition-colors ${
              isSelected ? 'bg-velo-accent text-white' : 'bg-velo-light text-velo-primary group-hover:bg-velo-primary group-hover:text-white'
            }`}>
              <Icon className="w-10 h-10" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-velo-accent' : 'text-velo-dark'}`}>{div.name}</h3>
            <p className="text-sm text-gray-500">{div.desc}</p>
          </button>
        );
      })}
    </div>
  );
};

export default DivisionSelector;
