import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Ctx } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";

import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import path, { join } from "path";
import { PostService } from "../post/post.service";
import { Paginated } from "../post/post.dto";
import { UserService } from "../user/user.service";

@Controller("profile")
@UseGuards(UserAuthGuard)
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService
  ) {}

  @Post("follow")
  async follow(@Body("userId") req: Ctx) {
    return;
  }

  @Get("followers")
  async followers(@Body("userId") req: Ctx) {
    return;
  }

  @Get("following")
  async following(@Body("userId") req: Ctx) {
    return;
  }

  @Get("posts")
  async posts(
    @Body() feedPagination: Paginated,
    @Body("userId") userId: number,
    @Req() { user: { id: myId } }: Ctx
  ) {
    return await this.postService.userPosts(feedPagination, userId, myId);
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

  //testing update profile image
  @Put(":username")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/profileimages",
        filename: (_, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, "") + uuidv4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    })
  )
  changeUserProfile(
    //could also replace with update
    @Param("username") username: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(file);
    const filepath = join(
      process.cwd(),
      "uploads/profileimages/" + file.filename
    );
    console.log(filepath);
    return this.userService.changeUserProfile(username, filepath);
  }
}
