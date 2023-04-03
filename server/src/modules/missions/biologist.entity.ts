import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity()
export class BiologistEntity extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: "1" })
  value!: number;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  user: UserEntity;
}
