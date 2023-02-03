import { Inject, Injectable } from "@nestjs/common";
import { ErrorRes } from "../../types";
import { TokenInput } from "../user/user.dto";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { TokenEntity } from "./token.entity";

@Injectable()
export class AuthService {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
  async validateUser(
    username: string,
    password: string
  ): Promise<UserEntity | null> {
    return await this.userService.loginByUsername(username, password);
  }

  async validateToken(token: TokenInput): Promise<TokenEntity | ErrorRes> {
    return await this.userService.findToken(token);
  }
}
