import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { CatchEntity } from "../catch/catch.entity";
import { LikeEntity } from "../like/like.entity";
import { CommentEntity } from "../comment/comment.entity";

@Entity()
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  creatorId: number;

  @Column()
  text!: string;

  @Column({ default: 0 })
  likeValue!: number;

  @Column({ default: 0 })
  commentValue!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: UserEntity;

  @OneToOne(() => CatchEntity, (_catch) => _catch.post)
  @JoinColumn()
  catch!: CatchEntity;

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];
}
