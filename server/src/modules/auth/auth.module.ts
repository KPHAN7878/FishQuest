import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { LocalStrategy } from "./LocalStrategy";
import { SessionSerializer } from "./SessionSerializer";
import { TokenEntity } from "./token.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    PassportModule.register({ session: true }),
  ],
  providers: [AuthService, UserService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
