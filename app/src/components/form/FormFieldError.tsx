import { createUniqueKey } from '../../lib/utils.ts';
import type { AppInputError } from '../../types/Errors.ts';

type FormFieldErrorProps = { errors: AppInputError };

export default function FormFieldError({ errors }: FormFieldErrorProps) {
  return (
    <>
      {Array.isArray(errors) ? errors.map((error: string, i) => (
        <div className="error" key={createUniqueKey(`${i}${error}`, 5)} role="alert">
          {error}
        </div>)
      ) : errors && (
        <div className="error" role="alert">
          {errors?.message ?? errors.toString()}
        </div>
      )}
    </>
  );
}
