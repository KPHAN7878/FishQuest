import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Query,
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
    @Query() input: GetCommentsInput & Paginated,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.commentService.getComments(input, { ...input, myId });
  }

  @Get("get-commentsV2/:string")
  async getCommentsV2(
    //@Body() input: GetCommentsInput & Paginated,
    @Param("string") input: string,
    @Req() { user: { id: myId } }: Ctx
  ) {
    const splitArray = input.split(",");

    console.log("split array: " + input + "\n");

    let testObject = {
      // limit: 25,
      // skip: null,
      // userId: 1,
      // myId: 1,
      // type: "following"
      limit: parseInt(splitArray[0]),
      skip: null,
      commentableId: parseInt(splitArray[1]),
      type: splitArray[2],
    };

    let input_ = testObject as GetCommentsInput & Paginated;
    return await this.commentService.getComments(input_, { ...input_, myId });
  }
}
