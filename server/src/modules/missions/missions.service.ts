import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CatchEntity } from "../catch/catch.entity";
import { Prediction } from "../prediction/prediction.entity";
import { AdventurerEntity } from "./adventurer.entity";
import { AnglerEntity } from "./angler.entity";
import { BiologistEntity } from "./biologist.entity";

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(AnglerEntity)
    private readonly anglerRepository: Repository<AnglerEntity>,

    @InjectRepository(BiologistEntity)
    private readonly biologistRepository: Repository<BiologistEntity>,

    @InjectRepository(AdventurerEntity)
    private readonly adventurerRepository: Repository<AdventurerEntity>
  ) {}
  async insert(
    postData: Prediction & CatchEntity,
    repo: Repository<AdventurerEntity | BiologistEntity | AnglerEntity>
  ): Promise<any> {
    const missionsEntry: any = repo.findOne({
      where: { userId: postData.userId },
    });
    if (missionsEntry) {
      repo.update(
        { userId: postData.userId },
        { value: missionsEntry.value + 1 }
      );
    } else {
      repo.insert({
        userId: postData.user.id,
        user: postData.user,
      });
    }
  }

  async adventurerCheck(postData: Prediction & CatchEntity): Promise<boolean> {
    const prevLocs = await CatchEntity.find({
      relations: ["user"],
    }).then((values: CatchEntity[]): number[][] => {
      return values
        .filter((val: CatchEntity) => val.user.id === postData.user.id)
        .map((val: CatchEntity) => val.location);
    });

    if (!prevLocs.includes(postData.location)) {
      this.insert(postData, this.adventurerRepository);
      return true;
    }

    return false;
  }

  async biologistCheck(postData: Prediction & CatchEntity): Promise<boolean> {
    const prevSpecs = await Prediction.find({
      where: { userId: postData.user.id },
    }).then((values: Prediction[]): string[] => {
      return values.map((val: Prediction) => val.species);
    });

    if (!prevSpecs.includes(postData.species)) {
      this.insert(postData, this.biologistRepository);
      return true;
    }
    return false;
  }

  async anglerCheck(postData: Prediction & CatchEntity): Promise<boolean> {
    this.insert(postData, this.anglerRepository);
    return true;
  }
}
