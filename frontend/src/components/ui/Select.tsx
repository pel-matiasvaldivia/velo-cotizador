import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ label, options, error, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs uppercase font-bold text-velo-primary tracking-wider">{label}</label>
      <select
        ref={ref}
        className={`w-full px-4 py-2 border rounded-velo outline-none transition-all bg-white ${
          error ? 'border-velo-accent focus:ring-velo-accent' : 'border-velo-steel focus:ring-velo-primary focus:border-transparent'
        } ${className}`}
        {...props}
      >
        <option value="">Seleccionar...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] text-velo-accent font-semibold">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
