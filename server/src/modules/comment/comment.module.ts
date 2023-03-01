import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentController } from "./comment.controller";
import { CommentEntity } from "./comment.entity";
import { CommentService } from "./comment.service";

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
