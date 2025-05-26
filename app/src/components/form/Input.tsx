import * as React from 'react';

import { cn } from '../../lib/utils';
import type { AppInputError } from '../../types/Errors';
import FormFieldError from './FormFieldError.tsx';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  errors?: AppInputError;
  type: string;
  required?: boolean;
  ref: React.Ref<HTMLInputElement>;
}

function Input({ className, type, errors, id, label, required, ref, ...props }: InputProps) {
  return (
    <div title={props.title}>
      <label htmlFor={id}>
        {label}{required && <span className="required">*</span>}
      </label>
      <input
        id={id}
        ref={ref}
        type={type}
        className={cn(className, errors ? ' error' : ' valid')}
        required={required}
        {...props}
      />
      {errors && <FormFieldError errors={errors} />}
    </div>
  )
}


function Checkbox({ className, type, errors, id, label, required, ref, ...props }: InputProps ) {
  return (
    <div className={cn('flex flex-1 items-center', className,  errors ? ' error' : ' valid')}>
      <label htmlFor={id} className="flex items-center m-0 gap-2">
        <input
          ref={ref}
          type={type}
          className={cn(className,  errors ? ' error' : ' valid')}
          {...props}
        />
        {label}{required && <span className="required">*</span>}
      </label>
      {errors && <FormFieldError errors={errors} />}
    </div>
  )
}

type RadioOption = {
  id: string;
  value: string | number;
  label: string;
}

type RadioGroupProps = {
  className?: string;
  label: string;
  options: RadioOption[];
  id: string;
  name: string;
  errors?: AppInputError;
  required?: boolean;
  ref: React.Ref<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

function RadioGroup({ className, errors, label, name, options, id, ref, ...props}: RadioGroupProps) {
  return (
    <div className={cn('h-full w-full', className)} id={id}>
      <p className="text-sm mb-3">{label}</p>
      <div className="flex items-center gap-3">
        {options.map((option: RadioOption, i: number) => {
          return (
            <label key={`${i}-${option.value}`}
                   htmlFor={option.id}
                   className="flex items-center gap-1 cursor-pointer">
              <input
                {...props}
                ref={ref}
                type="radio"
                id={option.id}
                name={name}
                value={option.value}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {errors && <FormFieldError errors={errors} />}
    </div>
  );
}

export { Checkbox, Input, RadioGroup };
