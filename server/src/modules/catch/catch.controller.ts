import { FileInterceptor } from "@nestjs/platform-express";
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  ParseIntPipe,
  Param,
} from "@nestjs/common";

import { Pred, Submission } from "./catch.dto";
import multer from "multer";
import { __prod__, IMG_FILE_LIMIT } from "../../constants";
import { CatchService } from "./catch.service";
import { CatchEntity } from "./catch.entity";

@Controller("catch")
export default class CatchController {
  constructor(private readonly catchService: CatchService) {}

  @Get()
  getAll(): Promise<{ catches: CatchEntity[]; paginated?: boolean }> {
    return this.catchService.getAll();
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
  async submitCatch(@Body() submission: Submission) {
    const results = await this.catchService.submitCatch(submission);
    // ...
    return results;
  }
}
