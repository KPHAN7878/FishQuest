import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Tokens } from "../../types";
import { UserEntity } from "../user/user.entity";

// user can only have one token for each type
@Entity()
export class TokenEntity extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  tokenType!: Tokens; //  0 forgot password

  @Column()
  code!: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.tokens, { cascade: true })
  user: UserEntity;
}
