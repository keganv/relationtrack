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

Input.displayName = "Input";

export { Input };
