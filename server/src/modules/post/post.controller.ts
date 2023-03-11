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
import { Ctx, Paginated } from "../../types";
import { PostInput, UpdatePostInput } from "./post.dto";
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
  async updatePost(@Body() postData: UpdatePostInput, @Req() { user }: Ctx) {
    return await this.postService.update(postData, user);
  }

  @Post("delete")
  async deletePost(@Body("postId") postId: number) {
    return await this.postService.delete(postId);
  }

  @Get(":id")
  async getById(@Param("id") postId: number) {
    return await this.postService.getById(postId);
  }

  @Get("get-posts/:id")
  async getPostsByUserId(
    @Body() input: Paginated,
    @Req() { user: { id: myId } }: Ctx,
    @Param("id") userId: number
  ) {
    return await this.postService.userPosts(input, userId, myId);
  }
}
