import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs uppercase font-bold text-velo-primary tracking-wider">{label}</label>
      <input
        ref={ref}
        className={`w-full px-4 py-2 border rounded-velo outline-none transition-all ${
          error ? 'border-velo-accent focus:ring-velo-accent' : 'border-velo-steel focus:ring-velo-primary focus:border-transparent'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] text-velo-accent font-semibold">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
