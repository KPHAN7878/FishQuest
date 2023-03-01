import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities, __prod__ } from "./constants";
import { AuthModule } from "./modules/auth/auth.module";
import { CatchModule } from "./modules/catch/catch.module";
import { PostModule } from "./modules/post/post.module";
import { UserModule } from "./modules/user/user.module";
import { LikeModule } from "./modules/like/like.module";
import { CommentModule } from "./modules/comment/comment.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: !__prod__,
      autoLoadEntities: true,
      entities,
    }),
    PassportModule.register({ session: true }),
    UserModule,
    CatchModule,
    AuthModule,
    PostModule,
    LikeModule,
    CommentModule,
  ],
})
export class AppModule {}
