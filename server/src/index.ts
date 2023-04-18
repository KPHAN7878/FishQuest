import "dotenv-safe/config";

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

const main = async () => {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  try {
    await dataSource.initialize();
    // await dataSource.runMigrations();
  } catch (err: any) {
    if (err.code === "42P07") {
      return;
    }
  }

  const sessionRepository = dataSource.getRepository(SessionEntity);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(
    session({
      name: COOKIE_NAME,
      store: new TypeormStore({
        cleanupLimit: 1,
      }).connect(sessionRepository),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 3,
        domain: __prod__ ? ".fishquest.net" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string | string[],
      resave: false,
    })
  );

  const passport = require("passport");
  app.useGlobalPipes(new ClassValidationPipe({ whitelist: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.listen(process.env.PORT as string | number, () => {
    console.log(
      `server started on ${process.env.CORS_ORIGIN}, port ${process.env.PORT}`
    );
  });
};

main().catch((err) => {
  console.log(err);
});
