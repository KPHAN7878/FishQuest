import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes } from "../../types";
import { PostEntity } from "./post.entity";
import { UserEntity } from "../user/user.entity";
import { CommentPost, Paginated, PostInput, UpdatePostInput } from "./post.dto";
import { CommentEntity } from "../comment/comment.entity";
import { CatchEntity } from "../catch/catch.entity";
import { formErrors } from "../../utils/formError";

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
