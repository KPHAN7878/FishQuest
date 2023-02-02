import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { Register, UserResponse } from "./user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError } from "../../types";
import argon2 from "argon2";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async insert(regInfo: Register): Promise<UserEntity | ErrorRes> {
    const userEntry = UserEntity.create(regInfo as UserEntity);

    try {
      await this.userRepository.save(userEntry);
    } catch (err: any) {
      if (err.code === "23505") {
        const error: FieldError = {
          message: "username taken",
          field: "username",
        };
        return { errors: [error] };
      }
    }

    return userEntry;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await UserEntity.find();
  }

  findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async loginByUsername(
    username: string,
    password: string
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      return null;
    }

    const valid = await argon2.verify(user.password, password);
    return valid ? user : null;
  }

  async forgotUsername(email: string): Promise<boolean> {
    const userEntries = await this.userRepository.findBy({ email });
    if (!userEntries) {
      return true;
    }

    const usernames =
      userEntries.reduce((prev, { username }: UserEntity) => {
        return `<div>${prev + username}</div>`;
      }, "<div>") + `</div>`;

    return true;
  }

  async forgotPassword(username: string) {}

  async changePassword(userId: number, newPassword: string) {}
}
