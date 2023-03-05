import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { dataSource } from "../../constants";
import { Paginated, PaginatedUser } from "./profile.dto";

// this class is responsible for whatever is on
// or from the user's profile page
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly userRepository: Repository<UserEntity>
  ) {}

  async follow(followId: number, user: UserEntity): Promise<boolean> {
    const userToFollow = await this.userRepository.findOne({
      where: { id: followId },
    });

    if (!userToFollow) {
      return false;
    }

    this.userRepository.update(
      { id: user.id },
      { following: [...user.following, userToFollow] }
    );

    return true;
  }

  async followPaginated(
    { limit, skip }: Paginated,
    userId: number,
    myId: number,
    query: string
  ): Promise<PaginatedUser> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne, userId, myId];

    if (skip) {
      replacements.push(skip);
    }

    const users = await dataSource.query(
      query + `${skip ? `offset $${replacements.length}` : ""}`
    );

    return {
      users: users.slice(0, realLimit),
      hasMore: users.length === realLimitPlusOne,
    };
  }

  async followers(
    paginate: Paginated,
    userId: number,
    myId: number
  ): Promise<PaginatedUser> {
    const query = `
    select u.*,
    json_build_object(
      'id', u.id,
      'username', u.username
    ) user,
    ${
      myId
        ? `(select exists ` +
          `(select * from u right join u.following fg on fg.id = $3)) "following"`
        : 'null as "following"'
    }
    from user_entity u right join u.followers fs on fs.id = $2
    order by u."username" ASC
    limit $1
    `;

    return this.followPaginated(paginate, userId, myId, query);
  }

  async following(
    paginate: Paginated,
    userId: number,
    myId: number
  ): Promise<PaginatedUser> {
    const query = `
    select u.*,
    json_build_object(
      'id', u.id,
      'username', u.username
    ) user,
    ${
      myId
        ? `(select exists ` +
          `(select * from u right join u.following fg on fg.id = $3)) "following"`
        : 'null as "following"'
    }
    from user_entity u right join u.following fs on fs.id = $2
    order by u."username" ASC
    limit $1
    `;

    return this.followPaginated(paginate, userId, myId, query);
  }

  //testing update user profile information
  async changeProfilePic(imageUri: string, myId: number) {
    await this.userRepository.update(
      { id: myId },
      {
        profilePicUrl: imageUri,
      }
    );
  }
}
