import { Request } from "express";
import { UserEntity } from "./modules/user/user.entity";

export class FieldError {
  message: string;
  field: string;
}

export class ErrorRes {
  errors: FieldError[];
}

export type Ctx = Request & { user?: UserEntity };
