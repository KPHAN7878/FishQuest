import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { LikeEntity } from "../like/like.entity";
import { PostEntity } from "../post/post.entity";
import { CommentEntity } from "../comment/comment.entity";
import { PaginatedCursor, PaginatedSkip } from "../../types";
import { GetLikeInput, PaginatedLike } from "./like.dto";
import { dataSource, paginateLimit } from "../../constants";
import { likeSubquery } from "../../utils/subquery";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async likePost(postId: number, user: UserEntity): Promise<boolean> {
    const like = await LikeEntity.findOne({
      where: { userId: user.id, type: "post", likableId: postId },
      relations: ["post"],
    });
    const post = await PostEntity.findOneBy({ id: postId });
    post!.likeValue += like ? -1 : 1;

    if (like) {
      this.postRepository.update(
        { id: postId },
        { likeValue: post!.likeValue }
      );
      this.likeRepository.remove(like);
    } else {
      const newLike = LikeEntity.create({
        userId: user.id,
        post: post!,
        type: "post",
        likableId: postId,
        user,
      });
      this.likeRepository.save(newLike);
    }

    return true;
  }

  async likeComment(commentId: number, user: UserEntity): Promise<boolean> {
    const like = await LikeEntity.findOne({
      where: { userId: user.id, type: "comment", likableId: commentId },
      relations: ["comment"],
    });
    const comment = await CommentEntity.findOneBy({ id: commentId });
    comment!.likeValue += like ? -1 : 1;

    if (like) {
      this.commentRepository.update(
        { id: commentId },
        { likeValue: comment!.likeValue }
      );
      this.likeRepository.remove(like);
    } else {
      const newLike = LikeEntity.create({
        userId: user.id,
        comment: comment!,
        type: "comment",
        likableId: commentId,
        user,
      });
      this.likeRepository.save(newLike);
    }

    return true;
  }

  async getLikes(
    { limit, cursor }: PaginatedCursor,
    input: GetLikeInput
  ): Promise<PaginatedLike> {
    const [realLimit, realLimitPlusOne] = paginateLimit(limit);
    const comments = await dataSource.query(
      `
    select p.*,
    json_build_object(
      'id', c."id",
      'text', c."text"
    ) comment,
    json_build_object(
      'id', u.id,
      'username', u.username,
    ) creator,
    ${likeSubquery(undefined, input.myId)}
    from post_entity p, comment_entity c, user_entity u where (u."id" = ${
      input.id
    }) and (
    ${input.id ? `p."id" = ${input.likableId})` : ""}
    or
    ${input.id ? `c."id" = ${input.likableId})` : ""})
    ${cursor ? `p."createdAt" < ${cursor}` : ""} and
    limit ${realLimitPlusOne}
    `
    );

    return {
      comments: comments.slice(0, realLimit),
      hasMore: comments.length === realLimitPlusOne,
    };
  }
}
