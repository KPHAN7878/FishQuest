import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdventurerEntity } from "../missions/adventurer.entity";
import { AnglerEntity } from "../missions/angler.entity";
import { BiologistEntity } from "../missions/biologist.entity";
import { MissionsService } from "../missions/missions.service";
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
    ]),
  ],
  controllers: [CatchController],
  providers: [CatchService, MissionsService],
})
export class CatchModule {}
