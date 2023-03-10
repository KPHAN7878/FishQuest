import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "../comment/comment.entity";
import {
  CommentInput,
  GetCommentsInput,
  PaginatedComment,
} from "./comment.dto";
import { UserEntity } from "../user/user.entity";
import { PostEntity } from "../post/post.entity";
import { dataSource, paginateLimit } from "../../constants";
import { likeSubquery } from "../../utils/subquery";
import { PaginatedSkip } from "../../types";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async comment(
    commentInput: CommentInput,
    user: UserEntity
  ): Promise<CommentEntity> {
    const commentable =
      commentInput.type === "post"
        ? await PostEntity.findOneBy({
            id: commentInput.commentableId,
          })
        : await CommentEntity.findOneBy({
            id: commentInput.commentableId,
          });
    commentable!.commentValue += 1;

    const commentProps = {
      ...(commentInput.type === "post"
        ? { post: commentable as PostEntity }
        : { comment: commentable as CommentEntity }),
      userId: user.id,
      user,
    };

    const newComment = CommentEntity.create({
      ...commentProps,
      ...commentInput,
    });
    this.commentRepository.save(newComment);

    return newComment;
  }

  async getComments(
    { limit, skip }: PaginatedSkip,
    input: GetCommentsInput & { id?: number }
  ): Promise<PaginatedComment> {
    const [realLimit, realLimitPlusOne] = paginateLimit(limit);
    const comments = await dataSource.query(
      `
    select
    json_build_object(
      'id', c."id",
      'text', c."text"
    ) comment,
    json_build_object(
      'id', u.id,
      'username', u.username,
    ) creator,
    ${likeSubquery("comment", input.myId)}
    from post_entity p, comment_entity c, user_entity u
    where ${
      input.id
        ? `u."id" = ${input.id}` // date > ~~
        : `c."commentableId" = ${input.commentableId}`
    }
    order by c."likeValue" DESC
    limit ${realLimitPlusOne}
   ${skip ? `offset ${skip}` : ""}
    `
    );

    return {
      comments: comments.slice(0, realLimit),
      hasMore: comments.length === realLimitPlusOne,
    };
  }
}
