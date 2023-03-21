import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { dataSource, paginateLimit } from "../../constants";
import { GetUsersInput, PaginatedUser } from "./profile.dto";
import { followingSubquery } from "../../utils/subquery";
import { PaginatedSkip } from "../../types";

// this class is responsible for whatever is on
// or from the user's profile page
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly userRepository: Repository<UserEntity>
  ) {}

  async follow(followId: number, user: UserEntity): Promise<boolean> {
    console.log("followId: " + followId)
    console.log("current user: " + JSON.stringify(user))
    if (followId === user.id) {
      return false;
    }

    const userToFollow = await this.userRepository.findOne({
      where: { id: followId },
      relations: ["followers"],
    });

    if (!userToFollow) {
      return false;
    }
    userToFollow.followers.push(user);
    this.userRepository.save(userToFollow);

    try {
      const query =
        `insert into rfollowers values ` +
        `(${user.id}, '${user.username}', ${followId}, '${userToFollow.username}')`;
      await dataSource.query(query);
    } catch (err: any) {
      if (err.code === "23505") {
        const query1 =
          `delete from rfollowers ` +
          `where "userEntityId_1" = '${user.id}' and "userEntityId_2" = '${followId}'`;
        const query2 =
          `delete from rfollowing ` +
          `where "userEntityId_2" = '${user.id}' and "userEntityId_1" = '${followId}'`;
        await dataSource.query(query1);
        await dataSource.query(query2);
      } else {
        console.log(err);
      }
    }

    return true;
  }

  async getUsers(
    { limit, skip }: PaginatedSkip,
    input: GetUsersInput
  ): Promise<PaginatedUser> {
    const [realLimit, realLimitPlusOne] = paginateLimit(limit);
    const users = await dataSource.query(
      `
    select
    json_build_object(
      'id', f."userEntityId_1",
      'username', f."userEntityUsername_1",
      'profilePicUrl', u."profilePicUrl"
    ) user,
    ${followingSubquery(input.myId)} from user_entity
    u right join r${input.type} f on f."userEntityId_1" = u.id
    where f."userEntityId_2" = ${input.userId}
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
