import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PostEntity } from "../post/post.entity";

@Entity()
export class ReactionEntity extends BaseEntity {
  @PrimaryColumn()
  @OneToMany(() => PostEntity, (postId) => postId.postId)
  postId!: number;

  @PrimaryColumn()
  @OneToMany(() => UserEntity, (user) => user.id )
  userId!: number;

  @Column()
  type!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

 

}

