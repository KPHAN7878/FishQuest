import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { CommentEntity } from "../comment/comment.entity";
import { PostEntity } from "../post/post.entity";
import { UserEntity } from "../user/user.entity";

@Entity()
export class LikeEntity extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.likes)
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.likes)
  @ManyToOne(() => PostEntity, { nullable: true })
  post?: PostEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.likes)
  @ManyToOne(() => CommentEntity, { nullable: true })
  comment?: CommentEntity;
}
