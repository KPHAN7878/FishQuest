import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Ctx, Paginated } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";
import { CommentInput, GetCommentsInput } from "./comment.dto";
import { CommentService } from "./comment.service";

@Controller("comment")
@UseGuards(new UserAuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async comment(@Body() comment: CommentInput, @Req() { user }: Ctx) {
    return await this.commentService.comment(comment, user);
  }

  @Get("get-comments")
  async getComments(
    @Body() input: GetCommentsInput & Paginated,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.commentService.getComments(input, { ...input, myId });
  }

  @Get("get-comments/:id")
  async getCommentsByUserId(
    @Body() input: GetCommentsInput & Paginated,
    @Param("id") id: number,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.commentService.getComments(input, { ...input, myId, id });
  }
}
