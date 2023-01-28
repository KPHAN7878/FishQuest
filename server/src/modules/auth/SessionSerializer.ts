import { Inject } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

// this attaches the user entity on req if authenticated
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(UserService) private readonly userService: UserService) {
    super();
  }

  serializeUser(user: UserEntity, done: (err: any, user: UserEntity) => void) {
    console.log("serializeUser");
    done(null, user);
  }

  async deserializeUser(
    user: UserEntity,
    done: (err: any, user: UserEntity | null) => void
  ) {
    console.log("deserializeUser");
    const userDB = await this.userService.findUserById(user.id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
