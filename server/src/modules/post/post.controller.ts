import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { Ctx } from "../../types";
import { Paginated, PostInput, UpdatePostInput } from "./post.dto";
import { UserAuthGuard } from "../auth/auth.guard";

@Controller("post")
@UseGuards(new UserAuthGuard())
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post("create")
  async createPost(@Body() postData: PostInput, @Req() { user }: Ctx) {
    return await this.postService.insert(postData, user);
  }

  @Post("update")
  async updatePost(@Body() postData: UpdatePostInput) {
    return await this.postService.update(postData);
  }

  @Post("delete")
  async deletePost(@Body("postId") postId: number) {
    return await this.postService.delete(postId);
  }
  @Get("user")
  async posts(
    @Body() feedPagination: Paginated,
    @Body("userId") userId: number,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.postService.userPosts(feedPagination, userId, myId);
  }

  @Get("my-feed")
  async myFeed(@Body() feedPagination: Paginated, @Req() { user }: Ctx) {
    return await this.postService.myFeed(feedPagination, user);
  }

  @Get(":id")
  async getById(@Param("id") postId: number) {
    return await this.postService.getById(postId);
  }
}
