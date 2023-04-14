import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import {
  AdventurerEntity,
  AnglerEntity,
  BiologistEntity,
  MissionEntity,
} from "./mission.entity";
import { MissionsController } from "./missions.controller";
import { MissionsService } from "./missions.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnglerEntity,
      BiologistEntity,
      AdventurerEntity,
      MissionEntity,
      UserEntity,
    ]),
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
