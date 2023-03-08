import { IsNotEmpty, IsNumber } from "class-validator";
import { CommentEntity } from "./comment.entity";

export class CommentInput {
  @IsNumber()
  commentableId: number;
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  type: "comment" | "post";
}

export class GetCommentsInput {
  commentableId: number;
  myId: number;
  type: "comment" | "post";
}

export class PaginatedComment {
  comments: CommentEntity[];
  hasMore: boolean;
}
