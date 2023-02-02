import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
  async validateUser(
    username: string,
    password: string
  ): Promise<UserEntity | null> {
    return await this.userService.loginByUsername(username, password);
  }
}
