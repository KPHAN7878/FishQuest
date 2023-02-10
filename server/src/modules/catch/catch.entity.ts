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
  createdAt?: Date;

  @Column()
  creatorId: number;

  @ManyToOne(() => UserEntity, (user) => user.catches)
  creator: UserEntity;

  @Column()
  comment?: string;

  @Column("int", { array: true })
  location: number[];

  @OneToOne(() => Prediction) // info gathered after processing catch
  @JoinColumn()
  predData: Prediction;

  @OneToOne(() => PostEntity)
  post?: PostEntity;

  @Column()
  dataUri: string; // cloud storage | local fs
}
