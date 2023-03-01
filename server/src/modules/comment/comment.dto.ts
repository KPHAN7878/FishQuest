import { IsNotEmpty, IsNumber } from "class-validator";

export class CommentPost {
  @IsNumber()
  postId: number;
  @IsNotEmpty()
  text: string;
}

export class CommentComment {
  @IsNumber()
  commentId: number;
  @IsNotEmpty()
  text: string;
}
