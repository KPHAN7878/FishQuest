import { IsNumber, IsNotEmpty, IsString } from "class-validator";
import { PostEntity } from "./post.entity";

export class PostInput {
  @IsNumber()
  catchId: number;
  @IsString()
  text: string;
}

export class UpdatePostInput extends PostInput {
  @IsNumber()
  postId: number;
}

export class Paginated {
  limit: number;
  cursor?: string;
}

export class PaginatedPost {
  posts: PostEntity[];
  hasMore: boolean;
}
