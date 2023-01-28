import { ErrorRes } from "../../types";
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

const passwordMessage = (args: ValidationArguments): string => {
  const cons = args.constraints[0];
  let msg = "Password not strong enough. ";
  msg += `Must include at least ${cons.minLength} characters, `;
  msg += `${cons.minNumbers} numbers, and `;
  msg += `${cons.minUppercase} uppercase letter`;

  return msg;
};

export class Register {
  @Length(3, 16)
  username: string;

  @IsStrongPassword(passwordOptions, {
    message: passwordMessage,
  })
  password: string;

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
