import { DataSource } from "typeorm";
import { entities } from "./constants";

// production ds
export const connectionSource = new DataSource({
  url: "postgres://postgres:Spencer900469@database-1.clkq93nyrm67.us-east-1.rds.amazonaws.com/postgres",
  type: "postgres",
  migrations: ["dist/migrations/*.js"],
  entities,
});
