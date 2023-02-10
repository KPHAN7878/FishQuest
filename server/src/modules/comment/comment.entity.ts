import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PostEntity } from "../post/post.entity";
import { UserEntity } from "../user/user.entity";

@Entity()
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  commId!: number;

  @PrimaryColumn()
  @OneToMany(() => PostEntity, (postId) => postId.postId)
  postId!: number;

  @PrimaryColumn()
  @OneToMany(() => UserEntity, (user) => user.id )
  userId!: number;

  @Column()
  text!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
