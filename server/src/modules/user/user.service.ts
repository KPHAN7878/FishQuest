import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { Register } from "./user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError } from "../../types";
import argon2 from "argon2";
import { sendEmail } from "../../utils/sendEmail";
import seedrandom from "seedrandom";
import { TokenEntity } from "../auth/token.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>
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
    if (!userEntries.length) {
      return true;
    }

    const html =
      userEntries.reduce((prev, { username }: UserEntity) => {
        return `<div>${prev + username}</div>`;
      }, "<div>") + `</div>`;

    sendEmail(email, html, "Your usernames");

    return true;
  }

  // secure
  async forgotPassword(username: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      return true;
    }

    const rng = seedrandom();
    const code = +rng().toString().substring(3, 9);
    const html = `<div>Code to reset ${user.username}'s password: ${code}</div>`;

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    const token = await this.tokenRepository.findOne({
      where: { userId: user.id, tokenId: 0 },
    });

    if (token) {
      await this.tokenRepository.update(
        { tokenId: token.tokenId, userId: token.userId },
        {
          expiresAt: expireDate,
          code,
        }
      );
    } else {
      const tokenEntry = TokenEntity.create({
        userId: user.id,
        tokenId: 0,
        expiresAt: expireDate,
        code,
      });

      this.tokenRepository.save(tokenEntry);
    }

    sendEmail(user.email, html, "Change Password");

    return true;
  }

  async changePassword(userId: number, newPassword: string) {}
}
