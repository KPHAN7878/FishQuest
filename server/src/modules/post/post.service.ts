import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError } from "../../types";
import { PostEntity } from "./post.entity";
import { UserEntity } from "../user/user.entity";
import { CommentPost, Paginated, PostInput, UpdatePostInput } from "./post.dto";
import { CommentEntity } from "../comment/comment.entity";
import { CatchEntity } from "../catch/catch.entity";

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
    const catchEntry = await CatchEntity.findOneBy({ id: postData.catchId });
    if (!catchEntry) {
      const errors: FieldError[] = [
        {
          message: `could not find catch id: ${postData.catchId}`,
          field: "catch",
        },
      ];
      return { errors };
    }

    const postEntry = PostEntity.create({
      text: postData.text,
      catch: catchEntry!,
      user,
    });

    this.postRepository.insert(postEntry);
    return postEntry;
  }

  async update(postData: UpdatePostInput): Promise<boolean | ErrorRes> {
    const postEntry = await PostEntity.findOneBy({ id: postData.postId });
    if (!postEntry) {
      const errors: FieldError[] = [
        {
          message: `could not find post id: ${postData.postId}`,
          field: "post",
        },
      ];
      return { errors };
    }

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
