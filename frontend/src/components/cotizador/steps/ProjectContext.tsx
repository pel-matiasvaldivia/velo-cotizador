import React from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ProjectContextProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ProjectContext: React.FC<ProjectContextProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-velo-accent pl-4 mb-8">
        <h2 className="text-2xl font-bold text-velo-dark uppercase">Contexto del Proyecto</h2>
        <p className="text-gray-500 text-sm">Contanos los detalles generales para una mejor estimación.</p>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-xs uppercase font-bold text-velo-primary tracking-wider">Descripción del Proyecto</label>
        <textarea
          rows={4}
          className={`w-full px-4 py-2 border rounded-velo outline-none transition-all ${
            errors.descripcionProyecto ? 'border-velo-accent focus:ring-velo-accent' : 'border-velo-steel focus:ring-velo-primary focus:border-transparent'
          }`}
          placeholder="Ej: Necesito una línea completa de almacenamiento para una nueva nave industrial..."
          {...register('descripcionProyecto', { required: 'La descripción es requerida' })}
        />
        {errors.descripcionProyecto && <span className="text-[10px] text-velo-accent font-semibold">{errors.descripcionProyecto.message as string}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Ubicación (Provincia / Localidad)" 
          placeholder="Ej: Mendoza, Maipú"
          {...register('ubicacion', { required: 'La ubicación es requerida' })}
          error={errors.ubicacion?.message as string}
        />
        <Select 
          label="Tiempo Estimado de Ejecución"
          options={[
            { value: 'urgente', label: 'Urgente (< 1 mes)' },
            { value: 'corto', label: 'Corto Plazo (1-3 meses)' },
            { value: 'mediano', label: 'Mediano/Largo Plazo (> 6 meses)' },
            { value: 'planificacion', label: 'Solo planificando/presupuestando' },
          ]}
          {...register('timeline', { required: 'El tiempo es requerido' })}
          error={errors.timeline?.message as string}
        />
      </div>
    </div>
  );
};

export default ProjectContext;
