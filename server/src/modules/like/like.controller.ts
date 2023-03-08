import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { LikeService } from "./like.service";
import { Ctx, Paginated } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";
import { GetLikeInput } from "./like.dto";

@Controller("like")
@UseGuards(new UserAuthGuard())
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post("post")
  async likePost(@Body("postId") postId: number, @Req() { user }: Ctx) {
    return await this.likeService.likePost(postId, user);
  }

  @Post("comment")
  async likeComment(
    @Body("commentId") commentId: number,
    @Req() { user }: Ctx
  ) {
    return await this.likeService.likeComment(commentId, user);
  }

  @Get("get-likes/:id")
  async getCommentsByUserId(
    @Body() input: GetLikeInput & Paginated,
    @Param("id") id: number,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.likeService.getLikes(input, { ...input, myId, id });
  }
}
