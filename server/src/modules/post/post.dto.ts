import { IsNumber, IsNotEmpty } from "class-validator";

export class PostInput {
  @IsNumber()
  catchId: number;
  @IsNotEmpty()
  text: string;
}

export class UpdatePostInput extends PostInput {
  postId: number;
}

export class Paginated {
  limit: number;
  cursor: string;
}

export class CommentPost {
  @IsNumber()
  postId: number;
  @IsNotEmpty()
  comment: string;
}
