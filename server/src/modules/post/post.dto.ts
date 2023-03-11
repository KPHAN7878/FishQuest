import { IsNumber, IsNotEmpty, IsString } from "class-validator";
import { PostEntity } from "./post.entity";

export class PostInput {
  @IsNumber()
  catchId: number;
  @IsString()
  text: string;
}

export class UpdatePostInput {
  @IsNumber()
  postId: number;
  @IsString()
  text: string;
}

export class PaginatedPost {
  posts: PostEntity[];
  hasMore: boolean;
}
