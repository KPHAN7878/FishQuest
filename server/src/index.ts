import express from "express";
import cors from "cors";

import { __prod__, dataSource, COOKIE_NAME } from "./constants";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import session from "express-session";
import { SessionEntity } from "./modules/auth/session.entity";
import { TypeormStore } from "connect-typeorm";
import ClassValidationPipe from "./utils/ClassValidatorPipe";
import "dotenv-save/config";

const main = async () => {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await dataSource.initialize();
  const sessionRepository = dataSource.getRepository(SessionEntity);

  app.use(cors());
  app.use(express.json());
  app.use(
    session({
      name: COOKIE_NAME,
      store: new TypeormStore({
        cleanupLimit: 1,
      }).connect(sessionRepository),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 3,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const passport = require("passport");
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalPipes(new ClassValidationPipe({ whitelist: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.listen(process.env.PORT, () => {
    console.log(`server started on localhost:${process.env.PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
