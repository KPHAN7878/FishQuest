import { Catch, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { update } from "lodash";
import { Repository } from "typeorm";
import { dataSource } from "../../constants";
import { CatchEntity } from "../catch/catch.entity";
import { Prediction } from "../prediction/prediction.entity";
import { UserEntity } from "../user/user.entity";
import {
  AdventurerEntity,
  AnglerEntity,
  BiologistEntity,
  MissionEntity,
} from "./mission.entity";
import { formMissions } from "./missionBuilder";
import { digestProgress, progressCheck } from "./missionCompletion";
import {
  DigestedProgress,
  MAX_MISSIONS,
  MissionProgress,
  MissionSpecifier,
  MissionValueSnapshot,
} from "./missionTypes";

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(AnglerEntity)
    private readonly anglerR: Repository<AnglerEntity>,
    @InjectRepository(BiologistEntity)
    private readonly biologistR: Repository<BiologistEntity>,
    @InjectRepository(AdventurerEntity)
    private readonly adventurerR: Repository<AdventurerEntity>,

    @InjectRepository(UserEntity)
    private readonly userR: Repository<UserEntity>,
    @InjectRepository(MissionEntity)
    private readonly missionR: Repository<MissionEntity>
  ) {}
  async insert(
    postData: Prediction & CatchEntity,
    repo: Repository<AdventurerEntity | BiologistEntity | AnglerEntity>
  ): Promise<number> {
    const missionsEntry: any = await repo.findOne({
      where: { userId: postData.userId },
    });

    if (missionsEntry) {
      repo.update(
        { userId: postData.userId },
        { value: missionsEntry.value + 1 }
      );

      return missionsEntry.value + 1;
    } else {
      repo.insert({
        userId: postData.user.id,
        user: postData.user,
      });

      return 1;
    }
  }

  async adventurerCheck(
    postData: Prediction & CatchEntity
  ): Promise<null | number> {
    const prevLocs = (await dataSource.query(
      `
      select location from
      catch_entity c inner join user_entity u
      on u.id = c."userId"
      where u.id = '${postData.user.id}'
      `
    )) as { location: number[] }[];

    if (
      !prevLocs.some((elem: { location: number[] }) => {
        return (
          JSON.stringify(elem) ===
          JSON.stringify({ location: postData.location })
        );
      })
    ) {
      return this.insert(postData, this.adventurerR);
    }

    return null;
  }

  async biologistCheck(
    postData: Prediction & CatchEntity
  ): Promise<null | number> {
    const prevSpecs = await Prediction.find({
      where: { userId: postData.user.id },
    }).then((values: Prediction[]): (null | string)[] => {
      return values.map((val: Prediction) => val.species);
    });

    if (!prevSpecs.includes(postData.species)) {
      return this.insert(postData, this.biologistR);
    }
    return null;
  }

  async anglerCheck(postData: Prediction & CatchEntity): Promise<number> {
    return this.insert(postData, this.anglerR);
  }

  async allChecks(results: CatchEntity & Prediction): Promise<{
    adventure: null | number;
    biologist: null | number;
    angler: number;
  } | null> {
    // update values for missions
    if (results.status !== null)
      return {
        adventure: await this.adventurerCheck(results),
        biologist: await this.biologistCheck(results),
        angler: await this.anglerCheck(results),
      };

    //  check if a mission was completed,
    //  if complete return to user and assign new mission

    return null;
  }

  async updateUser(
    user: UserEntity,
    value: number,
    fn: (missionValue: number) => number
  ) {
    const newExp = user.exp + fn(value);
    const newLevel = this.levelUp(user.level, newExp);
    this.userR.update({ id: user.id }, { exp: newExp, level: newLevel });
  }

  levelUp(level: number, exp: number) {
    return exp >= Math.min(100 + (level - 1) * 10, 500) ? level + 1 : level;
  }

  async selectMissions(user: UserEntity): Promise<MissionEntity[]> {
    const missions: MissionEntity[] = await dataSource.query(
      `
      select * from mission_entity m
      where m."userId" = '${user.id}' 
      `
    );

    return missions;
  }

  async missionAssigner(user: UserEntity): Promise<any> {
    // check current missions to see if any passed or deadlines met
    const missions = await this.selectMissions(user);

    // deadline check

    const now = new Date();
    const missionsLeft = missions.filter(
      (mission: MissionEntity) => now < mission.deadline
    );

    const invalidMissions = missions.filter(
      (mission: MissionEntity) => now >= mission.deadline
    );

    const progressAll = missionsLeft.map(async (m) => {
      return await progressCheck(
        JSON.parse(m.startSnapshot) as MissionValueSnapshot,
        JSON.parse(m.specifier) as MissionSpecifier,
        user
      );
    });

    const completionInfo = progressAll.map(
      async (
        value: Promise<Record<string, MissionProgress[]>>,
        throwAway: number
      ): Promise<{ throwAway: number } & DigestedProgress> => {
        return {
          throwAway,
          ...digestProgress(
            await value,
            JSON.parse(missionsLeft[throwAway].specifier) as MissionSpecifier
          ),
        };
      }
    );

    const completed = completionInfo.filter(
      async (mission) => await mission.then((v) => v.fullCompletion)
    );

    const more = Math.min(
      MAX_MISSIONS,
      MAX_MISSIONS - (invalidMissions.length + completed.length)
    );

    if (more) {
      let updateMissions = missionsLeft
        .filter((_, idx) =>
          completed.some(
            async (info) => await info.then((v) => v.throwAway === idx)
          )
        )
        .concat(invalidMissions);

      const newMissions = formMissions(user.level, more);
      updateMissions.slice(0, more).forEach((val: MissionEntity, idx) => {
        MissionEntity.update({ id: val.id }, { ...newMissions[idx] });
      });
    }
  }
}
