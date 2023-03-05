import { UserEntity } from "../user/user.entity";

export class PaginatedUser {
  users: UserEntity[];
  hasMore: boolean;
}

export class Paginated {
  limit: number;
  skip?: string;
}
