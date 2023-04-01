import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdventurerEntity } from "./adventurer.entity";
import { AnglerEntity } from "./angler.entity";
import { BiologistEntity } from "./biologist.entity";
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
