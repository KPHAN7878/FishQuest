import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "../comment/comment.entity";
import { CommentPost } from "./comment.dto";
import { UserEntity } from "../user/user.entity";
import { PostEntity } from "../post/post.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async commentPost(
    comment: CommentPost,
    user: UserEntity
  ): Promise<CommentEntity> {
    const post = await PostEntity.findOneBy({ id: comment.postId });

    const newComment = CommentEntity.create({
      text: comment.text,
      userId: user.id,
      post: post!,
      type: "post",
      user,
    });
    this.commentRepository.save(newComment);

    return newComment;
  }
}
