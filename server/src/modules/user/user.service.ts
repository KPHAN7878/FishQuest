import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { RegisterInput, TokenInput } from "./user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError } from "../../types";
import argon2 from "argon2";
import { sendEmail } from "../../utils/sendEmail";
import seedrandom from "seedrandom";
import { TokenEntity } from "../auth/token.entity";
import { formErrors } from "../../utils/formError";
import { ProfileService } from "../profile/profile.service";
import { dataSource } from "../../constants";
import { formUser } from "../../utils/formEntity";
import { followingSubquery } from "../../utils/subquery";

// this is used anywhere
@Injectable()
export class UserService extends ProfileService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    @InjectRepository(UserEntity)
    protected readonly userRepository: Repository<UserEntity>
  ) {
    super(userRepository);
  }

  async insert(regInfo: RegisterInput): Promise<UserEntity | ErrorRes> {
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

  async forgotPassword(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ["tokens"],
    });
    if (!user) {
      return true;
    }

    const rng = seedrandom();
    const code = rng().toString().substring(3, 9);
    const html = `<div>
                  Code to reset ${user.username}'s password:
                  <div style="font-weight: bold;">${code}</div>
                  </div>`;

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    const hashCode = await argon2.hash(code);

    const token = await this.tokenRepository.findOne({
      where: { userId: user.id, tokenType: "password" },
    });

    if (token) {
      await this.tokenRepository.update(
        { tokenType: token.tokenType, userId: token.userId },
        {
          expiresAt: expireDate,
          code: hashCode,
        }
      );
    } else {
      const tokenEntry = TokenEntity.create({
        userId: user.id,
        tokenType: "password",
        expiresAt: expireDate,
        code: hashCode,
      });

      await this.tokenRepository.save(tokenEntry);
      user.tokens.push(tokenEntry);
      this.userRepository.save(user);
    }

    sendEmail(user.email, html, "Change Password");

    return true;
  }

  async findToken({
    username,
    code,
    tokenType,
  }: TokenInput): Promise<TokenEntity | ErrorRes> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ["tokens"],
    });
    const today = new Date();

    const token = user?.tokens.find((token: TokenEntity) => {
      return token.tokenType === tokenType;
    });

    const errors = formErrors([
      {
        value: !token,
        message: `no code for ${tokenType}`,
        field: "code",
        stopIf: true,
      },
      {
        value: await argon2.verify(token!.code, code),
        message: "invalid code",
        field: "code",
      },
      {
        value: today > token!.expiresAt,
        message: "token expired",
        field: "code",
      },
    ]);

    if (errors.length) return { errors };
    return token!;
  }

  async changeUsername(
    user: UserEntity,
    newUsername: string
  ): Promise<UserEntity | ErrorRes> {
    const userEntry = await this.userRepository.findOne({
      where: { username: newUsername },
    });

    if (userEntry) {
      const error: FieldError = {
        message: "username taken",
        field: "username",
      };
      return { errors: [error] };
    }

    user.username = newUsername;
    this.userRepository.save(user);

    return user;
  }

  async changePassword(userId: number, newPassword: string) {
    await this.userRepository.update(
      { id: userId },
      {
        password: newPassword,
      }
    );

    this.tokenRepository.delete({ userId, tokenType: "password" });
  }

  async searchUsername(
    username: string,
    myId: number
  ): Promise<(UserEntity & { following: boolean })[]> {
    const userEntry: (UserEntity & { following: boolean })[] =
      await dataSource.query(
        `
      select u.username, u."profilePicUrl", u.id, ${followingSubquery(myId)}
      from user_entity u left join rfollowing f on f."userEntityId_1" = u.id
      where username ilike '${username}%'
      limit 8
      `
      );
    return userEntry;
  }
}
