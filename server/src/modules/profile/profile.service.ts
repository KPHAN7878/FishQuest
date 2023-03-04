import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";

// this class is responsible for whatever is on the user's profile page
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly userRepository: Repository<UserEntity>
  ) {}

  async follow() {}

  //testing update user profile information
  async changeUserProfile(username: string, newImageURL: string) {
    await this.userRepository.update(
      { username: username },
      {
        profilePicUrl: newImageURL,
      }
    );
  }
}
