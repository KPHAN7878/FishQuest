import { DataSource } from "typeorm";
import path from "path";
import { SessionEntity } from "./modules/auth/session.entity";
import { TokenEntity } from "./modules/auth/token.entity";
import { CatchEntity } from "./modules/catch/catch.entity";
import { Prediction } from "./modules/prediction/prediction.entity";
import { UserEntity } from "./modules/user/user.entity";
import { PostEntity } from "./modules/post/post.entity";
import { LikeEntity } from "./modules/like/like.entity";
import { CommentEntity } from "./modules/comment/comment.entity";
import { ReactionEntity } from "./modules/reaction/reaction.entity";

export const __prod__ = process.env.NODE_ENV === "production";
export const MODEL_PATH = `${__dirname}/classifier/model.onnx`;

// FILES
export const IMG_FILE_LIMIT = 1024 * 1024 * 4;
export const entities = [
  SessionEntity,
  TokenEntity,
  CatchEntity,
  Prediction,
  UserEntity,
  PostEntity,
  LikeEntity,
  CommentEntity,
  ReactionEntity,
];

export const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities,
  logging: false,
  synchronize: !__prod__,
  migrations: [path.join(__dirname, "./migrations/*")],
});

export const COOKIE_NAME = "FISH_QUEST";

export const DEV_EMAIL_ACC = {
  user: "celestine.gutmann@ethereal.email", // generated ethereal user
  pass: "FrnH5jSnzQ62tsRJ3A", // generated ethereal password
};

export const paginateLimit = (limit: number) => {
  const realLimit = Math.min(50, limit);
  const realLimitPlusOne = realLimit + 1;
  return [realLimit, realLimitPlusOne];
};
