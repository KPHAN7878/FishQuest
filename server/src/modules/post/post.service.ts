import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError } from "../../types";
import { PostEntity } from "./post.entity";
import { UserEntity } from "../user/user.entity";
import {
  CommentPost,
  LikePost,
  Paginated,
  PostInput,
  UpdatePostInput,
} from "./post.dto";
import { CommentEntity } from "../comment/comment.entity";

// Note: typeorm has a querybuilder where u can write and
// execute raw SQL if you need to use it for more advanced
// queries.
//
// Make sure to resolve errors and return them with the
// correct format. Look at user.service for reference.

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
    // insert into post table with input parameters

    return {} as any;
  }

  async update(
    postData: UpdatePostInput,
    userId: number
  ): Promise<PostEntity | ErrorRes> {
    // find post where userId and postData.postId and update with postData

    return {} as any;
  }

  async delete(postId: number, userId: number): Promise<boolean> {
    // delete post where userId and postId

    return true;
  }

  async like(likeInput: LikePost, userId: number): Promise<boolean> {
    // Create LikeEntity for this with relationships

    return true;
  }

  async createComment(
    comment: CommentPost,
    userId: number
  ): Promise<boolean | ErrorRes> {
    // Create CommentEntity for this with relationships

    return {} as any;
  }

  async getById(postId: number): Promise<PostEntity | ErrorRes> {
    // find post where postId

    return {} as any;
  }

  async feed(
    feedPagination: Paginated,
    userId: number
  ): Promise<PostEntity[] | ErrorRes> {
    return {} as any;
  }

  async getComments(
    comment: CommentPost,
    commentPagination: Paginated,
    userId: number
  ): Promise<CommentEntity[] | ErrorRes> {
    return {} as any;
  }
}
