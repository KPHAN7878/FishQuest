import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Ctx } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";

import { PostService } from "../post/post.service";
import { Paginated } from "./profile.dto";
import { UserService } from "../user/user.service";

@Controller("profile")
@UseGuards(UserAuthGuard)
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService
  ) {}

  @Post("follow")
  async follow(@Body("userId") id: number, @Req() { user }: Ctx) {
    return this.userService.follow(id, user);
  }

  @Get("followers")
  async followers(
    @Body() pagination: Paginated,
    @Body("userId") userId: number,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return this.userService.followers(pagination, userId, myId);
  }

  @Get("following")
  async following(
    @Body() pagination: Paginated,
    @Body("userId") userId: number,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return this.userService.following(pagination, userId, myId);
  }

  @Get("posts")
  async posts(
    @Body() pagination: Paginated,
    @Body("userId") userId: number,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.postService.userPosts(pagination, userId, myId);
  }

  @Get("likes")
  async likes(
    @Body() feedPagination: Paginated,
    @Body("userId") userId: number,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return;
  }

  @Get("comments")
  async comments(
    @Body() feedPagination: Paginated,
    @Body("userId") userId: number,
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
