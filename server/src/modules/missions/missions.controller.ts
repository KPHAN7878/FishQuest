import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { MissionsService } from "./missions.service";
import { Ctx, Paginated } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";

@Controller("missons")
@UseGuards(new UserAuthGuard())
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post("create")
  async createPost(@Body() missionsData: {}, @Req() { user }: Ctx) {
    //return await this.missionsService.insert(missionsData, user);
  }
}
