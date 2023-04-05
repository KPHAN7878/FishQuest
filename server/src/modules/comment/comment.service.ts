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
import { PaginatedCursor, PaginatedSkip } from "../../types";
import { exclude, include } from "../../utils/formEntity";

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
    commentable!.save();

    const commentProps = {
      ...(commentInput.type === "post"
        ? { post: commentable as PostEntity }
        : { comment: commentable as CommentEntity }),
      creatorId: user.id,
      user,
    };

    let newComment = CommentEntity.create({
      ...commentProps,
      ...commentInput,
    });
    newComment = await this.commentRepository.save(newComment);
    newComment = {
      ...exclude<CommentEntity>(newComment, [
        ["creatorId", "updatedAt", "comment", "post"],
      ]),
      ...include<CommentEntity>(newComment, [
        { user: ["username", "id", "profilePicUrl"] },
      ]),
    } as CommentEntity;

    return newComment;
  }

  async getComments(
    paginate: PaginatedSkip | PaginatedCursor,
    input: GetCommentsInput & { id?: number }
  ): Promise<PaginatedComment> {
    const [realLimit, realLimitPlusOne] = paginateLimit(paginate.limit);

    const byUser = (paginate as PaginatedCursor).cursor
      ? `u."id" = ${input.id} and c."createdAt" < '${
          (paginate as PaginatedCursor).cursor
        }'`
      : "";
    const byComment = `c."commentableId" = ${input.commentableId} and
      c."type" = '${input.type}'`;

    const comments = await dataSource.query(
      `
    select * from (
    select distinct on (c.id) c.text, c.id, c."commentableId",
    c."createdAt", c."likeValue", c."commentValue",
    json_build_object(
      'id', u.id,
      'username', u.username,
      'profilePicUrl', u."profilePicUrl"
    ) creator,
    ${likeSubquery("comment", input.myId)}
    from post_entity p, user_entity u
    inner join comment_entity c on u.id = c."creatorId"
    where ${input.id ? byUser : byComment}
    order by c.id, ${input.id ? 'c."createdAt"' : 'c."likeValue"'} DESC
    limit ${realLimitPlusOne}
     ${
       input.id
         ? ""
         : `${
             (paginate as PaginatedSkip).skip
               ? `offset ${(paginate as PaginatedSkip).skip}`
               : ""
           }`
     }) c
    order by ${input.id ? 'c."createdAt"' : 'c."likeValue"'} DESC
    `
    );

    return {
      comments: comments.slice(0, realLimit),
      hasMore: comments.length === realLimitPlusOne,
    };
  }
}
