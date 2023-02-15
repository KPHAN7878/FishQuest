import { DataSource } from "typeorm";

// production ds
export const connectionSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "DataDolphin973",
  database: "postgres",
  entities: [__dirname + "/**/*.entity.{ts,js}"],
  migrations: ["dist/migrations/*.js"],
});
