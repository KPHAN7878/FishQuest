import { CommentEntity } from "../comment/comment.entity";
import { UserEntity } from "../user/user.entity";

export class GetLikeInput {
  likableId: number;
  id?: number;
  myId: number;
}

export class PaginatedLike {
  comments: (CommentEntity | UserEntity)[];
  hasMore: boolean;
}
