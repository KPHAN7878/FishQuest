import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { dataSource } from "../../constants";
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
  ): Promise<number> {
    const missionsEntry: any = await repo.findOne({
      where: { userId: postData.userId },
    });

    if (missionsEntry) {
      return repo
        .update({ userId: postData.userId }, { value: missionsEntry.value + 1 })
        .then((val: any) => val.value);
    } else {
      // console.log("here");
      return repo
        .insert({
          userId: postData.user.id,
          user: postData.user,
        })
        .then((val: any) => val.value);
    }
  }

  async adventurerCheck(
    postData: Prediction & CatchEntity
  ): Promise<null | number> {
    const prevLocs = await dataSource.query(
      `
      select location from
      catch_entity c inner join user_entity u
      on u.id = c."userId"
      where u.id = c."userId"
      `
    );

    if (!prevLocs.includes(postData.location)) {
      return this.insert(postData, this.adventurerRepository);
    }

    return null;
  }

  async biologistCheck(
    postData: Prediction & CatchEntity
  ): Promise<null | number> {
    const prevSpecs = await Prediction.find({
      where: { userId: postData.user.id },
    }).then((values: Prediction[]): string[] => {
      return values.map((val: Prediction) => val.species);
    });

    console.log("bio");
    if (!prevSpecs.includes(postData.species)) {
      return this.insert(postData, this.biologistRepository);
    }
    return null;
  }

  async anglerCheck(postData: Prediction & CatchEntity): Promise<number> {
    return this.insert(postData, this.anglerRepository);
  }

  async allChecks(results: CatchEntity & Prediction): Promise<{
    adventure: null | number;
    biologist: null | number;
    angler: number;
  } | null> {
    if (results.status !== null)
      return {
        adventure: await this.adventurerCheck(results),
        biologist: await this.biologistCheck(results),
        angler: await this.anglerCheck(results),
      };
    return null;
  }
}
