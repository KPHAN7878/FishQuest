import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileService } from "../profile/profile.service";
import { AuthService } from "../auth/auth.service";
import { TokenEntity } from "../auth/token.entity";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity])],
  controllers: [UserController],
  providers: [UserService, AuthService, ProfileService],
})
export class UserModule {}
