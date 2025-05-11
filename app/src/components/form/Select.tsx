import * as React from "react";
import type { FieldError } from 'react-hook-form';

import { cn, createUniqueKey } from '../../lib/utils';

type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean
};

type SelectProps = {
  className?: string;
  label: string;
  options: SelectOption[];
  errors?: FieldError | string[] | undefined;
  required?: boolean;
  ref: React.Ref<HTMLSelectElement>;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

function Select({ className, errors, id, label, options, required, ref, ...props }: SelectProps ) {
  return (
    <div>
      <label htmlFor={id}>
        {label}{required && <span className="required">*</span>}
      </label>
      <select
        ref={ref}
        className={cn(className, errors ? ' error' : ' valid')}
        {...props}
      >
        {options.map((o) => {
          return (
            <option key={o.value}
                    value={o.value}
                    disabled={o.disabled || false}>
              {o.label}
            </option>
          );
        })}
      </select>
      {Array.isArray(errors) && errors.map((error, i) => (
        <div className="error" key={createUniqueKey(`${i}${error}`, 5)} role="alert">
          {error}
        </div>)
      )}
    </div>
  )
}

export { Select };
