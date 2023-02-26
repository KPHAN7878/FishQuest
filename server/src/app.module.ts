import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { __prod__ } from "./constants";
import { AuthModule } from "./modules/auth/auth.module";
import { SessionEntity } from "./modules/auth/session.entity";
import { TokenEntity } from "./modules/auth/token.entity";
import { CatchEntity } from "./modules/catch/catch.entity";
import { CatchModule } from "./modules/catch/catch.module";
import { PostEntity } from "./modules/post/post.entity";
import { Prediction } from "./modules/prediction/prediction.entity";
import { UserEntity } from "./modules/user/user.entity";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: !__prod__,
      autoLoadEntities: true,
      //entities: [__dirname + "/**/*.entity.{ts,js}"],
      entities: [SessionEntity, TokenEntity, CatchEntity, Prediction, UserEntity, PostEntity],
    }),
    PassportModule.register({ session: true }),
    UserModule,
    CatchModule,
    AuthModule,
  ],
})
export class AppModule {}
