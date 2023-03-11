import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenEntity } from "../auth/token.entity";
import { CommentEntity } from "../comment/comment.entity";
import { CommentService } from "../comment/comment.service";
import { LikeEntity } from "../like/like.entity";
import { LikeService } from "../like/like.service";
import { PostEntity } from "../post/post.entity";
import { PostService } from "../post/post.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { ProfileController } from "./profile.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TokenEntity,
      PostEntity,
      CommentEntity,
      LikeEntity,
    ]),
  ],
  controllers: [ProfileController],
  providers: [UserService, PostService, CommentService, LikeService],
})
export class ProfileModule {}
