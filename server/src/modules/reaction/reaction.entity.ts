import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PostEntity } from "../post/post.entity";

@Entity()
export class ReactionEntity extends BaseEntity {
  @PrimaryColumn()
  postId: number;

  @PrimaryColumn()
  userId: number;

  @Column()
  type!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.reactions)
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.likes)
  @ManyToOne(() => PostEntity)
  post: PostEntity;
}
