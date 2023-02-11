import argon2 from "argon2";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

const Sp = ["password"] as const;
type SecureProp = typeof Sp[number];

@Injectable()
export class HashPipe<T> implements PipeTransform<T, Promise<T>> {
  isSecureProp = (key: string): key is SecureProp => {
    return Sp.includes(key as SecureProp);
  };

  async transform(
    regInfo: { [key: string]: string } & T,
    _: ArgumentMetadata
  ): Promise<T> {
    for (let key in regInfo) {
      if (this.isSecureProp(key)) {
        const hashedKey = await argon2.hash(regInfo[key]);
        (regInfo as { [key: string]: string })[key] = hashedKey;
      }
    }

    return regInfo;
  }
}
