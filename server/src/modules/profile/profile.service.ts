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
    type: "followers" | "following"
  ): Promise<PaginatedUser> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const users = await dataSource.query(
      `
    select u.*,
    json_build_object(
      'id', u.id,
      'username', u.username
    ) user,
    ${
      myId
        ? `(select exists ` +
          `(select * from u right join u.following fg on fg.id = ${myId})) "following"`
        : 'null as "following"'
    }
    from user_entity u right join u.${type} fs on fs.id = ${userId}
    order by u."username" ASC
    limit ${realLimitPlusOne}
   ${skip ? `offset ${skip}` : ""}
    `
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
    return this.followPaginated(paginate, userId, myId, "followers");
  }

  async following(
    paginate: Paginated,
    userId: number,
    myId: number
  ): Promise<PaginatedUser> {
    return this.followPaginated(paginate, userId, myId, "following");
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
