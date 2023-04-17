import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { MissionsService } from "./missions.service";
import { Ctx, Paginated } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";

@Controller("mission")
@UseGuards(new UserAuthGuard())
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  async createPost(@Req() { user }: Ctx) {
    return await this.missionsService.missionAssigner(user);
  }

  @Get("experience")
  async experience(@Req() { user }: Ctx) {
    return this.missionsService.levelUpInfo(user);
  }
}
