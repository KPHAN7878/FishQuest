import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { Prediction } from "../prediction/prediction.entity";
import { PostEntity } from "../post/post.entity";

@Entity()
export class CatchEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.catches, { cascade: true })
  user: UserEntity;

  @Column({ nullable: true })
  note?: string;

  @Column("float", { array: true, nullable: true })
  location: number[];

  @OneToOne(() => Prediction, { cascade: true })
  @JoinColumn()
  prediction: Prediction;

  @OneToOne(() => PostEntity, (post) => post.catch, { cascade: true }) //bidirectional
  post?: PostEntity;

  @Column()
  imageUri: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  string: string;

  @Column("float", { nullable: true })
  weight: number;
}
