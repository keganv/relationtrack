import * as React from "react";
import { FieldError } from "react-hook-form";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fieldErrors?: FieldError | undefined;
  apiErrors?: string[] | undefined;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, apiErrors, fieldErrors, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={props.id}>
          {props.label}{props.required && <span className="required">*</span>}
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
);

const Checkbox = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, apiErrors, fieldErrors, ...props }, ref) => {
    return (
      <div className="flex flex-1 items-center">
        <label htmlFor={props.id} className="flex items-center m-0 gap-2">
          <input
            ref={ref}
            type={type}
            className={className}
            {...props}
          />
          {props.label}{props.required && <span className="required">*</span>}
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
);

export { Checkbox, Input };
