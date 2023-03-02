import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LikeEntity } from "../like/like.entity";
import { PostEntity } from "../post/post.entity";
import { UserEntity } from "../user/user.entity";

@Entity()
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: "post" | "comment";

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  commentableId: number;

  @Column()
  text!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  likeValue!: number;

  @ManyToOne(() => UserEntity, (user) => user.comments, { cascade: true })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments, { cascade: true })
  @ManyToOne(() => PostEntity, { nullable: true })
  post?: PostEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.comments)
  @ManyToOne(() => CommentEntity, { nullable: true, cascade: ["update"] }) // reflexive
  comment?: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.comment)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.comment)
  likes: LikeEntity[];
}
