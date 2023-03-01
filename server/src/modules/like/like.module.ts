import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "../post/post.entity";
import { LikeController } from "./like.controller";
import { LikeEntity } from "./like.entity";
import { LikeService } from "./like.service";

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity, PostEntity])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
