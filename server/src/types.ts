import { Request } from "express";
import { Session } from "express-session";
import { TokenEntity } from "./modules/auth/token.entity";
import { UserEntity } from "./modules/user/user.entity";

export class FieldError {
  message: string;
  field: string;
}

export class ErrorRes {
  errors: FieldError[];
}

export type Ctx = Request & {
  user: UserEntity;
  token?: TokenEntity | ErrorRes;
  session?: Session;
};

export type Tokens = "password";

export type PaginatedCursor = {
  limit: number;
  cursor?: string;
};

export type PaginatedSkip = {
  limit: number;
  skip?: number;
};

export type Paginated = PaginatedCursor | PaginatedSkip;
