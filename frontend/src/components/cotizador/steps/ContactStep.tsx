import React from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ContactStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ContactStep: React.FC<ContactStepProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-velo-accent pl-4 mb-8">
        <h2 className="text-2xl font-bold text-velo-dark uppercase">Datos de Contacto</h2>
        <p className="text-gray-500 text-sm">Pronto nos pondremos en contacto con vos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Nombre y Apellido" 
          placeholder="Juan Pérez"
          {...register('nombre', { required: 'El nombre es requerido' })}
          error={errors.nombre?.message as string}
        />
        <Input 
          label="Empresa" 
          placeholder="Nombre de tu empresa o bodega"
          {...register('empresa', { required: 'La empresa es requerida' })}
          error={errors.empresa?.message as string}
        />
        <Input 
          label="Email" 
          type="email"
          placeholder="juan@ejemplo.com"
          {...register('email', { 
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido"
            }
          })}
          error={errors.email?.message as string}
        />
        <Input 
          label="Teléfono" 
          placeholder="+54 261 5110282"
          {...register('telefono', { required: 'El teléfono es requerido' })}
          error={errors.telefono?.message as string}
        />
        <Select 
          label="¿Cómo nos conociste?"
          options={[
            { value: 'google', label: 'Búsqueda en Google' },
            { value: 'referido', label: 'Referido de un colega' },
            { value: 'redes', label: 'Redes Sociales' },
            { value: 'cliente', label: 'Ya somos clientes' },
            { value: 'otro', label: 'Otro' },
          ]}
          {...register('como_conocio')}
        />
      </div>
    </div>
  );
};

export default ContactStep;
