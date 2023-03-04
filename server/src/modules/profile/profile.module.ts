import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenEntity } from "../auth/token.entity";
import { PostEntity } from "../post/post.entity";
import { PostService } from "../post/post.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { ProfileController } from "./profile.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity, PostEntity])],
  controllers: [ProfileController],
  providers: [UserService, PostService],
})
export class ProfileModule {}
