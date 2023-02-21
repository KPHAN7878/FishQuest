import { CatchEntity } from "../catch/catch.entity";

export class PostInput {
  catch: CatchEntity;
  text: string;
}

export class UpdatePostInput extends PostInput {
  postId: string;
}

export class Paginated {
  limit: number;
  cursor: string;
}

export class LikePost {
  value: boolean;
  postId: number;
}

export class CommentPost {
  comment: string;
  postId: number;
}
