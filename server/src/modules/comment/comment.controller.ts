import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Ctx } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";
import { CommentPost } from "./comment.dto";
import { CommentService } from "./comment.service";

@Controller("comment")
@UseGuards(new UserAuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post("post")
  async createComment(@Body() comment: CommentPost, @Req() { user }: Ctx) {
    return await this.commentService.commentPost(comment, user);
  }
}
