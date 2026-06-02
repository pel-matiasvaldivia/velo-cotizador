import React from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface TechnicalSpecsProps {
  division: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ division, register, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-velo-accent pl-4 mb-8">
        <h2 className="text-2xl font-bold text-velo-dark uppercase">Especificaciones Técnicas</h2>
        <p className="text-gray-500 text-sm">Contanos más sobre el equipamiento que necesitás.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {division === 'vino' && (
          <>
            <Input 
              label="Capacidad Total Requerida (Litros)" 
              type="number" 
              placeholder="Ej: 10000"
              {...register('capacidad', { required: 'La capacidad es requerida' })}
              error={errors.capacidad?.message as string}
            />
            <Select 
              label="Tipo de Equipo"
              options={[
                { value: 'fermentacion', label: 'Tanque de Fermentación' },
                { value: 'almacenamiento', label: 'Tanque de Almacenamiento' },
                { value: 'filtracion', label: 'Equipo de Filtración' },
                { value: 'refrigeracion', label: 'Sistema de Refrigeración' },
                { value: 'cip', label: 'Planta CIP' },
                { value: 'llave_en_mano', label: 'Proyecto Llave en Mano' },
              ]}
              {...register('tipoEquipo', { required: 'El tipo de equipo es requerido' })}
              error={errors.tipoEquipo?.message as string}
            />
          </>
        )}

        {division === 'cerveza' && (
          <>
            <Input 
              label="Litros por Cocción" 
              type="number" 
              placeholder="Ej: 500"
              {...register('litrosCoccion', { required: 'Los litros son requeridos' })}
              error={errors.litrosCoccion?.message as string}
            />
            <Select 
              label="Configuración"
              options={[
                { value: 'minicerveceria', label: 'Minicervecería Completa' },
                { value: 'fermentadores', label: 'Fermentadores (Unitank/Isobáricos)' },
                { value: 'coccion', label: 'Bloque de Cocción' },
                { value: 'automatizacion', label: 'Upgrade Automatización' },
              ]}
              {...register('tipoEquipo', { required: 'El tipo de equipo es requerido' })}
              error={errors.tipoEquipo?.message as string}
            />
            <Select 
              label="Nivel de Automatización"
              options={[
                { value: 'manual', label: 'Manual' },
                { value: 'semi-auto', label: 'Semiautomatizado' },
                { value: 'full-auto', label: 'Full Automatizado (Panel Táctil)' },
              ]}
              {...register('automatizacion', { required: 'El nivel de automatización es requerido' })}
              error={errors.automatizacion?.message as string}
            />
          </>
        )}

        {division === 'industrial' && (
          <>
            <Select 
              label="Sector Industrial"
              options={[
                { value: 'alimenticia', label: 'Alimenticia' },
                { value: 'farmaceutica', label: 'Farmacéutica / Cosmética' },
                { value: 'quimica', label: 'Química' },
                { value: 'oil_gas', label: 'Oil & Gas / Energía' },
                { value: 'mineria', label: 'Minería' },
                { value: 'otra', label: 'Otra Industria' },
              ]}
              {...register('sector', { required: 'El sector es requerido' })}
              error={errors.sector?.message as string}
            />
            <Select 
              label="Tipo de Recipiente/Instalación"
              options={[
                { value: 'tanque_sanitario', label: 'Tanque Sanitario' },
                { value: 'reactor', label: 'Reactor con Agitador / Camisa' },
                { value: 'presion', label: 'Recipiente a Presión (ASME)' },
                { value: 'piping', label: 'Piping Industrial' },
                { value: 'custom', label: 'Diseño Especial' },
              ]}
              {...register('tipoEquipo', { required: 'El tipo de equipo es requerido' })}
              error={errors.tipoEquipo?.message as string}
            />
          </>
        )}

        <Select 
          label="Material Requerido"
          options={[
            { value: 'aisi_304', label: 'Acero Inoxidable AISI 304' },
            { value: 'aisi_316l', label: 'Acero Inoxidable AISI 316L (Premium)' },
            { value: 'consultar', label: 'No estoy seguro / Consultar' },
          ]}
          {...register('material', { required: 'El material es requerido' })}
          error={errors.material?.message as string}
        />
      </div>
    </div>
  );
};

export default TechnicalSpecs;
