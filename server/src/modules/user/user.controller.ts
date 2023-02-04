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
import { RegisterInput, PasswordToken } from "./user.dto";
import { HashPasswordPipe } from "./user.pipe";
import { Request, Response } from "express";
import { LocalAuthGuard, UserAuthGuard } from "../auth/auth.guard";
import { COOKIE_NAME } from "../../constants";
import { Ctx } from "../../types";
import { TokenInterceptor } from "../auth/token.interceptor";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async registerUser(
    @Body(HashPasswordPipe<RegisterInput>) regInfo: RegisterInput
  ) {
    const result = await this.userService.insert(regInfo);
    return result;
  }

  // Checks to see if a token submission is valid
  // for a user. Provide username, code, and token type
  @UseInterceptors(TokenInterceptor)
  @Post("submit-token")
  submitToken(@Req() req: Ctx) {
    return req.token;
  }

  @UseInterceptors(TokenInterceptor)
  @Post("change-password")
  changePassword(
    @Body(HashPasswordPipe<PasswordToken>)
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
  forgotUsername(@Body("email") email: string) {
    return this.userService.forgotUsername(email);
  }

  @Post("forgot-password")
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

  @Get()
  async getAuthSession(@Session() session: Record<string, any>) {
    session.authorized = true;
    return session;
  }
}
