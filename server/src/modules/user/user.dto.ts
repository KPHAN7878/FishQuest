import { ErrorRes, Tokens } from "../../types";
import { UserEntity } from "./user.entity";
import {
  ValidationArguments,
  IsStrongPassword,
  Length,
  IsEmail,
  IsString,
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

export class RegisterInput extends Password {
  @Length(3, 16)
  username: string;

  @IsEmail()
  email: string;
}

export class User {
  username: string;
  id: number;
}

export interface TokenInput {
  username: string;
  code: string;
  tokenType: Tokens;
}

export class PasswordToken extends Password implements TokenInput {
  @IsString()
  username: string;
  @IsString()
  code: string;
  @IsString()
  tokenType: Tokens;
}
