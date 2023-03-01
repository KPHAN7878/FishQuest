import { FieldError } from "../types";

type ErrorResolver = {
  value: boolean;
  message: string;
  field: string;
  stopIf?: boolean;
};

export const formErrors = (
  predicates: Array<ErrorResolver> | ErrorResolver
): FieldError[] => {
  let errors: (FieldError | undefined)[] = [];
  let stop = false;

  if (Array.isArray(predicates)) {
    errors = (predicates as Array<ErrorResolver>)
      .map((predicate: ErrorResolver) => {
        if (predicate.value && !stop) {
          if (predicate.stopIf) stop = true;
          const error: FieldError = {
            field: predicate.field,
            message: predicate.message,
          };
          return error;
        } else {
          return undefined;
        }
      })
      .filter((val: FieldError | undefined) => val !== undefined);
  } else {
    if ((predicates as ErrorResolver).value) {
      const error: FieldError = {
        field: (predicates as ErrorResolver).field,
        message: (predicates as ErrorResolver).message,
      };
      errors = [error];
    }
  }

  return errors as FieldError[];
};
