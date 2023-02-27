import { DataSource } from "typeorm";
import { entities } from "./constants";

// production ds
export const connectionSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "DataDolphin973",
  database: "fishquest",
  migrations: ["dist/migrations/*.js"],
  entities,
});
