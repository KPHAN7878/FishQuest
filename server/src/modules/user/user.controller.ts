import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Register } from "./user.dto";
import { HashPwdPipe } from "./user.pipe";
import { Request, Response } from "express";
import { LocalAuthGuard, UserAuthGuard } from "../auth/auth.guard";
import { COOKIE_NAME } from "../../constants";
import { Ctx } from "../../types";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async registerUser(@Body(HashPwdPipe<Register>) regInfo: Register) {
    const result = await this.userService.insert(regInfo);
    return result;
  }

  // @UseGuards(UserAuthGuard)
  // @Post("changePassword/:token")
  // changePassword(
  //   @Param("token") token: number,
  //   @Body("newPassword") newPassword: string
  // ) {
  //   return this.userService.changePassword(number, newPassword);
  // }

  @Post("forgotUsername")
  forgotUsername(@Body("email") email: string) {
    return this.userService.forgotUsername(email);
  }

  @Post("forgotPassword")
  forgotPassword(@Body("username") username: string) {
    return this.userService.forgotPassword(username);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() { user }: Ctx) {
    return user;
  }

  @UseGuards(UserAuthGuard)
  @Post("logout")
  async logout(@Req() { session }: Request, @Res() res: Response) {
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

  @Get()
  async getAuthSession(@Session() session: Record<string, any>) {
    session.authorized = true;
    return session;
  }
}
