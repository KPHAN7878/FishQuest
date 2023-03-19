import { Body, Controller, Get, Post, Req, UseGuards, Param } from "@nestjs/common";
import { Ctx, Paginated } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";

import { PostService } from "../post/post.service";
import { GetUsersInput } from "./profile.dto";
import { UserService } from "../user/user.service";
import { GetCommentsInput } from "../comment/comment.dto";
import { CommentService } from "../comment/comment.service";
import { LikeService } from "../like/like.service";
import { GetLikeInput } from "../like/like.dto";

@Controller("profile")
@UseGuards(UserAuthGuard)
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly likeService: LikeService
  ) {}

  @Post("follow") async follow(
    @Body("userId") id: number,
    @Req() { user }: Ctx
  ) {
    console.log("id: " + id)
    return this.userService.follow(id, user);
  }

  @Get("posts")
  async posts(
    @Body() input: Paginated & { id: number },
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.postService.userPosts(input, input.id, myId);
  }

  //followers or following users
  @Get("get-users")
  async following(
    @Body() input: GetUsersInput & Paginated,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return this.userService.getUsers(input, { ...input, myId });
  }

  @Get("comments")
  async getCommentsById(
    @Body() input: GetCommentsInput & Paginated,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.commentService.getComments(input, { ...input, myId });
  }

  @Get("likes")
  async likes(
    @Body() input: GetLikeInput & Paginated,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return this.likeService.getLikes(input, { ...input, myId });
  }

  @Get("feed")
  async myFeed(@Body() feedPagination: Paginated, @Req() { user }: Ctx) {
    return await this.postService.myFeed(feedPagination, user);
  }

  //testing feed with @Param instead of @Body becuase axios GET does not allow body in request
  @Get("feedV2/:string")
  async myFeedVersion2(@Param('string') feedPagination: string, @Req() { user }: Ctx) {

    const splitArray = feedPagination.split(",")

    let testObject = {
      limit: parseInt(splitArray[0]),
      cursor: splitArray[1]
    }

    let test = testObject as Paginated
    return await this.postService.myFeed(test, user);
  }

  @Post("change-profile-picture")
  changeProfilePic(
    @Req() { user: { id: myId } }: Ctx,
    @Body("imageUri") imageUri: string
  ) {
    return this.userService.changeProfilePic(imageUri, myId);
  }

  // add bio
}
