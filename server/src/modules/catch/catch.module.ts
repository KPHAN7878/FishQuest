import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prediction } from "../prediction/prediction.entity";
import CatchController from "./catch.controller";
import { CatchEntity } from "./catch.entity";
import { CatchService } from "./catch.service";

@Module({
  imports: [TypeOrmModule.forFeature([CatchEntity, Prediction])],
  controllers: [CatchController],
  providers: [CatchService],
})
export class CatchModule {}
