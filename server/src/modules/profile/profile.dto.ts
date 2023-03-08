import { UserEntity } from "../user/user.entity";

export class PaginatedUser {
  users: UserEntity[];
  hasMore: boolean;
}

export class GetUsersInput {
  userId: number;
  myId: number;
  type: "followers" | "following";
}
