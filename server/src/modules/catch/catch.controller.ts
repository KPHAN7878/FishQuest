import { FileInterceptor } from "@nestjs/platform-express";
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  ParseIntPipe,
  Param,
  UploadedFile,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AdditionalInfo, Catch, Submission } from "./catch.dto";
import multer, { diskStorage } from "multer";
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
    @Body() input: Paginated,
    @Req() { user }: Ctx
  ): Promise<{ catches: CatchEntity[] }> {
    return this.catchService.getAll(input, user);
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
    console.log(info, species);
    return await this.catchService.additionalInfo(info, species);
  }
}
