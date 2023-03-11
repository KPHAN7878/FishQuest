import { CommentEntity } from "../comment/comment.entity";
import { UserEntity } from "../user/user.entity";

export class GetLikeInput {
  id?: number;
  myId: number;
}

export class PaginatedLike {
  likes: (CommentEntity | UserEntity)[];
  hasMore: boolean;
}
