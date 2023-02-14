import { DataSource } from "typeorm";

export const connectionSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "DataDolphin973",
  database: "postgres",
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
});
