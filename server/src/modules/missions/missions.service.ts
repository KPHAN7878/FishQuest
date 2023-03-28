import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { dataSource } from "../../constants";
import { CatchEntity } from "../catch/catch.entity";
import { Prediction } from "../prediction/prediction.entity";
import { UserEntity } from "../user/user.entity";
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
    postData: any,
    user: UserEntity,
    repo: any,
    entity: any
  ): Promise<any> {
    const missionsEntry = entity.findOneby({
      where: { userId: postData.userId },
    });
    if (missionsEntry) {
      repo.update(
        { userId: postData.userId },
        { value: missionsEntry.value + 1 }
      );
    }
  }

  async adventurer_check(
    postData: CatchEntity,
    user: UserEntity,
    adv: AdventurerEntity
  ): Promise<boolean> {
    const uniques: any[] = [];
    const allLocs = await dataSource.query(
      //get all user's catches' locations
      `select location from catch_entity
          where catch_entity."userId" = ${user.id};`
    );
    const prevLocs = await dataSource.query(
      //get number of unique locations previously logged
      `select value from adventurer_entity
          where adventurer_entity."userId" =  ${user.id}`
    );
    for (const value of allLocs) {
      //check number of unique locations currently logged
      if (!uniques.includes(value)) {
        uniques.push(value);
      }
    }
    if (uniques.length > prevLocs) {
      //if current number of unqiues is more than previously logged then a new location has been used
      this.insert(
        postData,
        postData.user,
        this.adventurerRepository,
        AdventurerEntity
      );
      await dataSource.query(
        `update adventurer_entity
            set value = value +1
            where "userId" = ${user.id};
            `
      );
      return true;
    }
    if (uniques.length == prevLocs) {
      return false;
    }
    return true;
  }

  async biologist_check(
    postData: Prediction,
    user: UserEntity
  ): Promise<boolean> {
    const uniques: string[] = [];
    const allSpec = await dataSource.query(
      //get all user's logged species
      `select species from prediction
          where prediction."userId" = ${user.id};
        `
    );
    const prevSpec = await dataSource.query(
      //get number of unique species previously logged
      `select value from biologist_entity
          where biologist_entity."userId" =  ${user.id}`
    );
    for (const value of allSpec) {
      //check number of unique species currently logged
      if (!uniques.includes(value)) {
        uniques.push(value);
      }
    }
    if (uniques.length > prevSpec) {
      //if current number of unqiues is more than previously logged then a new species has been caught and we can add one
      this.insert(postData, user, this.biologistRepository, BiologistEntity);
      await dataSource.query(
        `update biologist_entity
            set value = value +1
            where "userId" = ${user.id};
            `
      );
      return true;
    }
    if (uniques.length == prevSpec) {
      return false;
    }
    return false;
  }

  async angler_check(postData: any, user: UserEntity): Promise<boolean> {
    this.insert(postData, postData.user, this.anglerRepository, AnglerEntity);
    await dataSource.query(
      `update angler_entity
          set value = value +1
          where "userId" = ${user.id};
          `
    );
    return true;
    //since missions will only be called if a successful catch is made we can just go ahead and use insert for angler
  }
}
