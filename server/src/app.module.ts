import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { __prod__ } from "./constants";
import { AuthModule } from "./modules/auth/auth.module";
import { CatchModule } from "./modules/catch/catch.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      username: "admin",
      password: "",
      database: "FishQuest",
      synchronize: !__prod__,
      autoLoadEntities: true,
      entities: [__dirname + "/**/*.entity.{ts,js}"],
    }),
    PassportModule.register({ session: true }),
    UserModule,
    CatchModule,
    AuthModule,
  ],
})
export class AppModule {}
