import { DataSource } from "typeorm";

// ENVIRONMENT
export const HOST = "10.219.66.101";
export const PORT = 3000;
// export const __prod__ = process.env.NODE_ENV === "production";
export const __prod__ = false;
export const MODEL_PATH = `${__dirname}/classifier/model.onnx`;

// FILES
export const IMG_FILE_LIMIT = 1024 * 1024 * 8;

export const dataSource = new DataSource({
  type: "postgres",
  username: "admin",
  password: "",
  database: "FishQuest",
  entities: [__dirname + "/**/*.entity.{ts,js}"],
  logging: false,
  synchronize: !__prod__,
});

export const COOKIE_NAME = "FISH_QUEST";

export const DEV_EMAIL_ACC = {
  user: "conner.kessler@ethereal.email", // generated ethereal user
  pass: "m2t5Pcv4CTmUCEWfDu", // generated ethereal password
};
