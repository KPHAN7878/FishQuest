import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";
import { ISession } from "connect-typeorm";

@Entity()
export class SessionEntity implements ISession {
  @Index()
  @Column("bigint")
  expiredAt = Date.now();

  @PrimaryColumn("varchar", { length: 255 })
  id: string;

  @Column("text")
  json: string;

  @DeleteDateColumn()
  public destroyedAt?: Date;
}
