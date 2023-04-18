import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  AdventurerEntity,
  AnglerEntity,
  BiologistEntity,
  MissionEntity,
} from "../missions/mission.entity";
import { MissionsService } from "../missions/missions.service";
import { UserEntity } from "../user/user.entity";
import CatchController from "./catch.controller";
import { CatchEntity } from "./catch.entity";
import { CatchService } from "./catch.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CatchEntity,
      AnglerEntity,
      BiologistEntity,
      AdventurerEntity,
      UserEntity,
      MissionEntity,
    ]),
  ],
  controllers: [CatchController],
  providers: [CatchService, MissionsService],
})
export class CatchModule {}
