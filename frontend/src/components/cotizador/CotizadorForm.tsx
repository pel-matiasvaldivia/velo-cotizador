import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import DivisionSelector from './steps/DivisionSelector';
import TechnicalSpecs from './steps/TechnicalSpecs';
import ProjectContext from './steps/ProjectContext';
import ContactStep from './steps/ContactStep';
import CotizacionResult from './CotizacionResult';
import StepIndicator from './StepIndicator';
import Button from '../ui/Button';

const CotizadorForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [division, setDivision] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm();

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    if (step === 2) {
      if (division === 'vino') fieldsToValidate = ['capacidad', 'tipoEquipo', 'material'];
      if (division === 'cerveza') fieldsToValidate = ['litrosCoccion', 'tipoEquipo', 'automatizacion', 'material'];
      if (division === 'industrial') fieldsToValidate = ['sector', 'tipoEquipo', 'material'];
    } else if (step === 3) {
      fieldsToValidate = ['descripcionProyecto', 'ubicacion', 'timeline'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleDivisionSelect = (id: string) => {
    setDivision(id);
    setStep(2);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const {
        ubicacion,
        timeline,
        descripcionProyecto,
        capacidad,
        litrosCoccion,
        sector,
        tipoEquipo,
        automatizacion,
        material,
        ...contacto
      } = data;

      // Consolidate the technical specs (otherwise discarded) into the
      // description so the AI actually receives them.
      const specLines = [
        capacidad && `Capacidad requerida: ${capacidad} L`,
        litrosCoccion && `Litros por cocción: ${litrosCoccion} L`,
        sector && `Sector industrial: ${sector}`,
        tipoEquipo && `Tipo de equipo: ${tipoEquipo}`,
        automatizacion && `Nivel de automatización: ${automatizacion}`,
        material && `Material: ${material}`,
        timeline && `Plazo estimado: ${timeline}`,
      ].filter(Boolean);

      const payload = {
        ...contacto,
        division,
        provincia: ubicacion,
        descripcionProyecto: [descripcionProyecto, ...specLines]
          .filter(Boolean)
          .join('\n'),
      };

      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const resultData = await response.json();
      
      if (response.ok) {
        setResult(resultData);
      } else {
        // Handle error
        console.error('API Error:', resultData);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error('Fetch Error:', error);
      setIsSubmitting(false);
    }
  };

  if (result) {
    return <CotizacionResult data={result} onBack={() => setResult(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 bg-white rounded-velo shadow-2xl border border-velo-steel border-opacity-30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-velo-accent"></div>
      
      <StepIndicator currentStep={step} totalSteps={4} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-velo-dark uppercase mb-2">¿En qué división necesitás ayuda?</h2>
                <p className="text-gray-500">Seleccioná el área de tu proyecto para comenzar.</p>
              </div>
              <DivisionSelector onSelect={handleDivisionSelect} selected={division} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TechnicalSpecs division={division} register={register} errors={errors} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ProjectContext register={register} errors={errors} />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ContactStep register={register} errors={errors} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-velo-steel border-opacity-20 flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          )}
          <div className="ml-auto">
            {step < 4 && step > 1 && (
              <Button type="button" variant="primary" onClick={nextStep}>
                Siguiente
              </Button>
            )}
            {step === 4 && (
              <Button type="submit" variant="accent" isLoading={isSubmitting}>
                Generar Cotización Inteligente
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CotizadorForm;
