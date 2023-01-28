import {
  Body,
  Controller,
  Get,
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

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async registerUser(@Body(HashPwdPipe<Register>) regInfo: Register) {
    const result = await this.userService.insert(regInfo);
    return result;
  }

  // @UseGuards(UserAuthGuard)
  // @Post("changePassword")
  // changePassword(@Req() req: Request) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: Request) {
    return req.user;
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
        res.redirect("");
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
  getProfile(@Req() { user }: Request) {
    return user;
  }

  @Get()
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log(session);
    session.authorized = true;
    return session;
  }
}
