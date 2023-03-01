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
            ...predicate,
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
        ...(predicates as ErrorResolver),
      };
      errors = [error];
    }
  }

  return errors as FieldError[];
};
