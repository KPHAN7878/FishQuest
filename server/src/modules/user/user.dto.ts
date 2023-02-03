import { ErrorRes, Tokens } from "../../types";
import { UserEntity } from "./user.entity";
import {
  ValidationArguments,
  IsStrongPassword,
  Length,
  IsEmail,
} from "class-validator";

const passwordOptions = {
  minLength: 6,
  minNumbers: 2,
  minUppercase: 1,
  minSymbols: 0,
};

export const passwordMessage = (args: ValidationArguments): string => {
  const cons = args.constraints[0];
  let msg = "Password not strong enough. ";
  msg += `Must include at least ${cons.minLength} characters, `;
  msg += `${cons.minNumbers} numbers, and `;
  msg += `${cons.minUppercase} uppercase letter`;

  return msg;
};

export class Password {
  @IsStrongPassword(passwordOptions, {
    message: passwordMessage,
  })
  password: string;
}

export class Register extends Password {
  @Length(3, 16)
  username: string;

  @IsEmail()
  email: string;
}

export class User {
  username: string;
  id: number;
}

export class UserResponse {
  entry?: UserEntity;
  errors?: ErrorRes[];
}

export class TokenInput {
  username: string;
  code: string;
  tokenType: Tokens;
}
