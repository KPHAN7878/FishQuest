import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { Ctx } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";

@Controller("like")
@UseGuards(new UserAuthGuard())
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post("post")
  async likePost(@Body("postId") postId: number, @Req() { user }: Ctx) {
    return await this.likeService.likePost(postId, user);
  }
}
