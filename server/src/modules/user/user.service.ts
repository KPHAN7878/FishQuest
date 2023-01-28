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

  async findUserByUsername(
    username: string,
    password: string
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      return user;
    }

    const valid = await argon2.verify(user.password, password);
    return valid ? user : null;
  }
}
