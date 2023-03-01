import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { CommentEntity } from "../comment/comment.entity";
import { PostEntity } from "../post/post.entity";
import { UserEntity } from "../user/user.entity";

@Entity()
export class LikeEntity extends BaseEntity {
  @PrimaryColumn()
  type: "post" | "comment";

  @PrimaryColumn()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.likes, { cascade: true })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.likes)
  @ManyToOne(() => PostEntity, { nullable: true, cascade: true })
  post?: PostEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.likes)
  @ManyToOne(() => CommentEntity, { nullable: true, cascade: true })
  comment?: CommentEntity;
}
