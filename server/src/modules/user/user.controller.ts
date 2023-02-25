import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
  UseInterceptors,
  Put,
  Param,
  UploadedFile,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  RegisterInput,
  PasswordToken,
  EmailInput,
  UsernameInput,
  ProfileImageInput,
} from "./user.dto";
import { HashPipe } from "./user.pipe";
import { Request, Response } from "express";
import { LocalAuthGuard, UserAuthGuard } from "../auth/auth.guard";
import { COOKIE_NAME } from "../../constants";
import { Ctx, ErrorRes } from "../../types";
import { TokenInterceptor } from "../auth/token.interceptor";
import { TokenEntity } from "../auth/token.entity";

import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import {v4 as uuidv4} from 'uuid';
import path, { join } from "path";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async registerUser(@Body(HashPipe<RegisterInput>) regInfo: RegisterInput) {
    const result = await this.userService.insert(regInfo);

    return result;
  }

  @UseInterceptors(TokenInterceptor)
  @Post("submit-token")
  submitToken(@Req() req: Ctx): ErrorRes | TokenEntity {
    return req.token!;
  }

  @UseInterceptors(TokenInterceptor)
  @Post("change-password")
  changePassword(
    @Body(HashPipe<PasswordToken>)
    { password }: PasswordToken,
    @Req() { token }: Ctx
  ) {
    if ((token && "errors" in token) || !token) {
      return;
    } else {
      return this.userService.changePassword(token.userId, password);
    }
  }

  @Post("forgot-username")
  forgotUsername(@Body() { email }: EmailInput) {
    return this.userService.forgotUsername(email);
  }

  @Post("forgot-password")
  forgotPassword(@Body() { username }: UsernameInput) {
    return this.userService.forgotPassword(username);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() { user }: Ctx) {
    return user;
  }

  @UseGuards(UserAuthGuard)
  @Post("logout")
  async logout(@Req() { session }: Ctx, @Res() res: Response) {
    return new Promise((resolve) =>
      session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
        res.send(true);
      })
    );
  }

  // Checks if user is logged in
  @UseGuards(UserAuthGuard)
  @Get("status")
  async getAuthStatus(@Req() req: Request) {
    return { status: req.isAuthenticated() };
  }

  @UseGuards(UserAuthGuard)
  @Get("profile")
  getProfile(@Req() { user }: Ctx) {
    return user;
  }

  @UseGuards(UserAuthGuard)
  @Post("change-username")
  changeUsername(
    @Req() { user }: Ctx,
    @Body("newUsername") newUsername: string
  ) {
    return this.userService.changeUsername(user!, newUsername);
  }

  @Get()
  async getAuthSession(@Session() session: Record<string, any>) {
    session.authorized = true;
    return session;
  }

  //testing update profile image 
  @UseGuards(UserAuthGuard)
  @Put(':username')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profileimages',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`)
      }
    })
  }))
  changeUserProfile(  //could also replace with update
    @Param('username') username: string,
    @UploadedFile() file: Express.Multer.File
  )
  {
    console.log(file);
    const filepath = join(process.cwd(), 'uploads/profileimages/' + file.filename)
    console.log(filepath)
    return this.userService.changeUserProfile(username, filepath);
  }
}
