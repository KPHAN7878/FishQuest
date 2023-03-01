import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "../comment/comment.entity";
import { CommentComment, CommentPost } from "./comment.dto";
import { UserEntity } from "../user/user.entity";
import { PostEntity } from "../post/post.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async commentPost(
    commentInput: CommentPost,
    user: UserEntity
  ): Promise<CommentEntity> {
    const post = await PostEntity.findOneBy({
      id: commentInput.postId,
    });

    const newComment = CommentEntity.create({
      text: commentInput.text,
      userId: user.id,
      post: post!,
      type: "post",
      user,
    });
    this.commentRepository.save(newComment);

    return newComment;
  }

  async commentComment(
    commentInput: CommentComment,
    user: UserEntity
  ): Promise<CommentEntity> {
    const comment = await CommentEntity.findOneBy({
      id: commentInput.commentId,
    });

    const newComment = CommentEntity.create({
      text: commentInput.text,
      userId: user.id,
      type: "comment",
      comment: comment!,
      user,
    });
    this.commentRepository.save(newComment);

    return newComment;
  }
}
