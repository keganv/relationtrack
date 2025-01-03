import * as React from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fieldErrors?: FieldError | undefined;
  apiErrors?: string[] | undefined;
  required?: boolean;
  ref: React.Ref<HTMLInputElement>;
}

function Input ({ className, type, apiErrors, fieldErrors, id, label, required, ref, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id}>
        {label}{required && <span className="required">*</span>}
      </label>
      <input
        ref={ref}
        type={type}
        className={className}
        {...props}
      />
      {Array.isArray(apiErrors) && apiErrors.map((error, i) => (
        <div className="error" key={error.replace(/\s+/g, '').substring(0, 5) + i} role="alert">
          {error}
        </div>)
      )}
      {fieldErrors && <div className="error" role="alert">{fieldErrors.message}</div>}
    </div>
  )
}

function Checkbox ({ className, type, apiErrors, fieldErrors, id, label, required, ref, ...props }: InputProps ) {
  return (
    <div className="flex flex-1 items-center">
      <label htmlFor={id} className="flex items-center m-0 gap-2">
        <input
          ref={ref}
          type={type}
          className={className}
          {...props}
        />
        {label}{required && <span className="required">*</span>}
      </label>
      {apiErrors && apiErrors.map((error, i) => (
        <div className="error" key={error.replace(/\s+/g, '').substring(0, 5) + i} role="alert">
          {error}
        </div>)
      )}
      {fieldErrors && <div className="error" role="alert">{fieldErrors.message}</div>}
    </div>
  )
}

export { Checkbox, Input };
