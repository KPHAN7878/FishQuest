import { FileInterceptor } from "@nestjs/platform-express";
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  ParseIntPipe,
  Param,
  Req,
  UseGuards,
  Query,
} from "@nestjs/common";

import { AdditionalInfo, Submission } from "./catch.dto";
import multer from "multer";
import { __prod__, IMG_FILE_LIMIT } from "../../constants";
import { CatchService } from "./catch.service";
import { CatchEntity } from "./catch.entity";
import { Ctx, Paginated } from "../../types";
import { UserAuthGuard } from "../auth/auth.guard";

@Controller("catch")
@UseGuards(new UserAuthGuard())
export default class CatchController {
  constructor(private readonly catchService: CatchService) {}

  @Get("my-catches")
  getAll(
    @Query() paginated: Paginated,
    @Req() { user }: Ctx
  ): Promise<{ catches: CatchEntity[] }> {
    return this.catchService.getAll(paginated, user);
  }

  @Get()
  getAllMaps(): Promise<{ catches: CatchEntity[]; paginated?: boolean }> {
    return this.catchService.getAllMaps();
  }

  @Get(":id")
  async getCatch(@Param("id", new ParseIntPipe()) id: number) {
    return this.catchService.getCatch(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multer.memoryStorage(),
      limits: { fieldSize: IMG_FILE_LIMIT },
    })
  )
  async submitCatch(@Body() submission: Submission, @Req() { user }: Ctx) {
    const results = await this.catchService.submitCatch(submission, user);
    return results;
  }

  @Post("add-info")
  async addInfo(
    @Body() info: AdditionalInfo,
    @Body() { species }: { species: string }
  ) {
    return await this.catchService.additionalInfo(info, species);
  }
}
