import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Ctx, Paginated } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";

import { PostService } from "../post/post.service";
import { GetUsersInput } from "./profile.dto";
import { UserService } from "../user/user.service";
import { GetCommentsInput } from "../comment/comment.dto";
import { CommentService } from "../comment/comment.service";

@Controller("profile")
@UseGuards(UserAuthGuard)
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly commentService: CommentService
  ) {}

  @Post("follow")
  async follow(@Body("userId") id: number, @Req() { user }: Ctx) {
    return this.userService.follow(id, user);
  }

  //followers or following users
  @Get("get-users")
  async following(
    @Body() input: GetUsersInput & Paginated,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return this.userService.getUsers(input, { ...input, myId });
  }

  @Get("posts")
  async posts(
    @Body() input: Paginated & { id: number },
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.postService.userPosts(input, input.id, myId);
  }

  @Get("comments")
  async getCommentsById(
    @Body() input: GetCommentsInput & Paginated & { id: number },
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.commentService.getComments(input, { ...input, myId });
  }

  @Get("likes")
  async likes(
    @Body() feedPagination: Paginated & { id: number },
    @Req() { user: { id: myId } }: Ctx
  ) {
    return;
  }

  @Get("feed")
  async myFeed(@Body() feedPagination: Paginated, @Req() { user }: Ctx) {
    return await this.postService.myFeed(feedPagination, user);
  }

  @Post("change-profile-picture")
  changeProfilePic(
    @Req() { user: { id: myId } }: Ctx,
    @Body("imageUri") imageUri: string
  ) {
    return this.userService.changeProfilePic(imageUri, myId);
  }
}
