import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { LikeEntity } from "../like/like.entity";
import { PostEntity } from "../post/post.entity";
import { UserEntity } from "../user/user.entity";

@Entity()
export class CommentEntity extends BaseEntity {
  @Column()
  text!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @ManyToOne(() => PostEntity, { nullable: true })
  post?: PostEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.comments)
  @ManyToOne(() => CommentEntity, { nullable: true })
  comment?: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.comment)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.comment)
  likes: LikeEntity[];
}
