export class FieldError {
  message: string;
  field: string;
}

export class ErrorRes {
  errors: FieldError[];
}
