import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError } from "../../types";
import { UserEntity } from "../user/user.entity";
import { LikeEntity } from "../like/like.entity";
import { PostEntity } from "../post/post.entity";
import { LikePost } from "./like.dto";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>
  ) {}

  async like(likeInput: LikePost, user: UserEntity): Promise<boolean> {
    const like = await LikeEntity.findOne({
      where: { userId: user.id },
      relations: ["post"],
    });
    const post = await PostEntity.findOneBy({ id: likeInput.postId });

    if (like) {
      this.likeRepository.remove(like);
    } else {
      const newLike = LikeEntity.create({ userId: user.id, user, post: post! });
      this.likeRepository.save(newLike);
    }

    console.log(post!.likes.length);

    return true;
  }
}
