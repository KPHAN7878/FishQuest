import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { TokenEntity } from "../auth/token.entity";
import { CatchEntity } from "../catch/catch.entity";
import { CommentEntity } from "../comment/comment.entity";
import { LikeEntity } from "../like/like.entity";
import { PostEntity } from "../post/post.entity";
import { ReactionEntity } from "../reaction/reaction.entity";

@Entity()
@Unique(["username"])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @PrimaryColumn({ unique: true })
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  profilePicUrl: string;

  @Column()
  exp: number;
  
  //achievement ranks 0-3 bronze, silver, gold, diamond
  @Column()
  ang: number;

  @Column()
  bio: number;

  @Column()
  adv: number;
  
  //ADD ACH ONETOONES

  @OneToMany(() => TokenEntity, (userToken) => userToken.user)
  tokens: TokenEntity[];

  @ManyToMany(() => UserEntity, (user) => user.following, { cascade: true })
  @JoinTable({
    name: "rfollowers",
  })
  followers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.followers, {
    cascade: ["insert", "update"],
  })
  @JoinTable({
    name: "rfollowing",
  })
  following: UserEntity[];

  // catches that the user has submitted
  @OneToMany(() => CatchEntity, (userCatch) => userCatch.user)
  catches: CatchEntity[];

  // posts that the user has created
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  // likes of comments or posts
  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  // comments on user posts and other comments
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  // reactions to a post
  @OneToMany(() => ReactionEntity, (reaction) => reaction.user)
  reactions: ReactionEntity[];
}
