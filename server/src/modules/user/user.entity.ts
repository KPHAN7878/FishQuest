import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { TokenEntity } from "../auth/token.entity";
import { CatchEntity } from "../catch/catch.entity";

@Entity()
@Unique(["username"])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @PrimaryColumn({ unique: true })
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => CatchEntity, (userCatch) => userCatch.creator)
  catches: CatchEntity[];

  @OneToMany(() => TokenEntity, (userToken) => userToken.user)
  tokens: TokenEntity[];
}
