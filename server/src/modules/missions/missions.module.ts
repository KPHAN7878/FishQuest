import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  AdventurerEntity,
  AnglerEntity,
  BiologistEntity,
} from "./mission.entity";
import { MissionsController } from "./missions.controller";
import { MissionsService } from "./missions.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([AnglerEntity, BiologistEntity, AdventurerEntity]),
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
