import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { LikeEntity } from "../like/like.entity";
import { PostEntity } from "../post/post.entity";
import { CommentEntity } from "../comment/comment.entity";
import { PaginatedCursor } from "../../types";
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
      return false;
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
    const commentSelector = `
    json_build_object(
      'text', c.text,
      'id', c.id,
      'commentableId', c."commentableId",
      'createdAt', c."createdAt",
      'likeValue', c."likeValue",
      'commentValue', c."commentValue"
    ) "likeContent",
    `;
    const commentJoin = `
    (like_entity l inner join comment_entity c
    on c.id = l."likableId" and l."type" = 'comment'
    inner join user_entity u on u.id = l."userId")
    `;

    const postSelector = `
    json_build_object(
      'text', p.text,
      'id', p.id,
      'createdAt', p."createdAt",
      'likeValue', p."likeValue",
      'commentValue', p."commentValue",
      'catch', json_build_object(
        'id', ca."id",
        'note', ca."note",
        'imageUri', ca."imageUri",
        'location', ca."location"
      )
    ) "likeContent",
    `;
    const postJoin = `
    (like_entity l inner join post_entity p on p.id = l."likableId"
    and l."type" = 'post'
    right join catch_entity ca on ca."id" = p."catchId"
    inner join user_entity u on u.id = l."userId")
    `;

    const formQuery = (
      selector: string,
      join: string,
      type: "post" | "comment"
    ) => {
      return `
    select ${selector}
    json_build_object(
      'id', u.id,
      'username', u.username,
      'profilePicUrl', u."profilePicUrl"
    ) creator,
    l.type "likeType",
    l."createdAt" "likedAt",
    ${likeSubquery(type, input.id)}
    from ${join}
    ${
      cursor
        ? `where l."createdAt" < '${cursor}' and u."id" = '${input.id}'`
        : ""
    }
    order by l."createdAt" DESC
    limit ${realLimitPlusOne}
    `;
    };

    const postCommentUnion = await dataSource.query(
      `
      select * from 
      (${formQuery(postSelector, postJoin, "post")}) lp
      union all
      select * from 
      (${formQuery(commentSelector, commentJoin, "comment")}) lc
      order by "likedAt" DESC
      `
    );

    return {
      likes: postCommentUnion.slice(0, realLimit),
      hasMore: postCommentUnion.length === realLimitPlusOne,
    };
  }
}
