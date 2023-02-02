import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

// user can only have one token for each type
@Entity()
export class TokenEntity extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  tokenId!: number; //  0 forgot password

  @Column()
  code!: number;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user: UserEntity;
}
