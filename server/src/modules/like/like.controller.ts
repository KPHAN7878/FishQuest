import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { Ctx } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";
import { LikePost } from "./like.dto";

@Controller("post")
@UseGuards(new UserAuthGuard())
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post("like")
  async like(@Body() postIdandValue: LikePost, @Req() { user }: Ctx) {
    return await this.likeService.like(postIdandValue, user);
  }
}
