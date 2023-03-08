import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, PaginatedCursor } from "../../types";
import { PostEntity } from "./post.entity";
import { UserEntity } from "../user/user.entity";
import { PaginatedPost, PostInput, UpdatePostInput } from "./post.dto";
import { CatchEntity } from "../catch/catch.entity";
import { formErrors } from "../../utils/formError";
import { dataSource, paginateLimit } from "../../constants";
import { likeSubquery } from "../../utils/subquery";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>
  ) {}

  async insert(
    postData: PostInput,
    user: UserEntity
  ): Promise<PostEntity | ErrorRes> {
    const catchEntry = await CatchEntity.findOne({
      where: { id: postData.catchId },
      relations: ["user", "post"], // attach relations
    });

    const errors = formErrors([
      {
        value: !catchEntry,
        message: `could not find catch id: ${postData.catchId}`,
        field: "catch",
        stopIf: true,
      },
      {
        value: catchEntry?.user.id !== user.id,
        message: `id mismatch`,
        field: "catch",
      },
      {
        value: catchEntry?.post !== null,
        message: `post for this catch already exists`,
        field: "catch",
      },
    ]);

    if (errors.length) return { errors };

    const postEntry = PostEntity.create({
      text: postData.text,
      catch: catchEntry!,
      creatorId: user.id,
      user,
    });

    this.postRepository.save(postEntry);
    return postEntry;
  }

  async update(postData: UpdatePostInput): Promise<boolean | ErrorRes> {
    const postEntry = await PostEntity.findOneBy({ id: postData.postId });

    const errors = formErrors({
      value: !postEntry,
      message: `could not find post id: ${postData.postId}`,
      field: "post",
    });
    if (errors) return { errors };

    await this.postRepository.update(
      { id: postData.postId },
      { text: postData.text }
    );

    return true;
  }

  async delete(postId: number): Promise<boolean> {
    this.postRepository.delete({ id: postId });
    return true;
  }

  async getById(postId: number): Promise<PostEntity | null> {
    return this.postRepository.findOneBy({ id: postId });
  }

  async userPosts(
    { limit, cursor }: PaginatedCursor,
    userId: number,
    myId: number
  ): Promise<PaginatedPost> {
    const [realLimit, realLimitPlusOne] = paginateLimit(limit);

    const posts = await dataSource.query(
      `
    select p.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
    ) creator,
    ${likeSubquery("post", myId)}
    from post_entity p inner join public.user_entity u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < ${cursor} and p.id = ${userId}` : ""}
    order by p."createdAt" DESC
    limit ${realLimitPlusOne}
    `
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  async myFeed(
    { limit, cursor }: PaginatedCursor,
    user: UserEntity
  ): Promise<PaginatedPost> {
    return {} as any;
  }
}
