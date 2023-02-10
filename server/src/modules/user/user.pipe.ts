import argon2 from "argon2";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class HashPasswordPipe<T extends { password: string }>
  implements PipeTransform<T, Promise<T>>
{
  async transform(regInfo: T, _: ArgumentMetadata): Promise<T> {
    const hashedPassword = await argon2.hash(regInfo.password);
    regInfo.password = hashedPassword;

    return regInfo;
  }
}
