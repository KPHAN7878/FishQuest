import express from "express";
import cors from "cors";

import { PORT, HOST, __prod__, dataSource, COOKIE_NAME } from "./constants";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import session from "express-session";
import { SessionEntity } from "./modules/auth/session.entity";
import { TypeormStore } from "connect-typeorm";
import { ValidationPipe } from "@nestjs/common";

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
      store: new TypeormStore().connect(sessionRepository),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      },
      saveUninitialized: false,
      secret: "f412FE23shf982hqf78",
      resave: false,
    })
  );

  const passport = require("passport");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.listen(PORT, () => {
    console.log(`server started on ${HOST}:${PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});