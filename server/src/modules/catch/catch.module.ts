import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import CatchController from "./catch.controller";
import { CatchEntity } from "./catch.entity";
import { CatchService } from "./catch.service";

@Module({
  imports: [TypeOrmModule.forFeature([CatchEntity])],
  controllers: [CatchController],
  providers: [CatchService],
})
export class CatchModule {}
