import { dataSource } from "../../constants";
import { UserEntity } from "../user/user.entity";
import { AnglerEntity } from "./mission.entity";
import {
  LocationDetail,
  MissionSpecifier,
  MissionValueSnapshot,
  SpeciesDetail,
  StandardDetail,
  MissionProgress,
} from "./missionTypes";

export const progressCheck = async (
  values: MissionValueSnapshot,
  specifier: MissionSpecifier,
  user: UserEntity
): Promise<Record<string, MissionProgress[]>> => {
  const res: Record<string, MissionProgress[]> = {};
  if (values.angler && specifier.angler)
    res["angler"] = await diffAmountCaught(
      values.angler.value,
      specifier.angler.details,
      user
    );
  if (values.biologist && specifier.biologist)
    res["biologist"] = await diffFishSpecies(
      values.biologist,
      specifier.biologist.details,
      user
    );
  if (values.adventurer && specifier.adventurer)
    res["adventurer"] = await diffLocations(
      values.adventurer.lastCatchDate,
      specifier.adventurer.details,
      user
    );

  return res;
};

const diffLocations = async (
  lastDate: Date,
  details: StandardDetail[],
  user: UserEntity
): Promise<MissionProgress[]> => {
  const uniqueDatesAfterSnapshot = (await dataSource.query(
    `
      select distinct from
      catch_entity c inner join user_entity u
      on u.id = c."userId"
      where u.id = '${user.id}' and c."createdAt" > '${JSON.stringify(
      lastDate
    )}'
      `
  )) as { location: number[] }[];

  return details.map((detail): MissionProgress => {
    const currentValue = uniqueDatesAfterSnapshot.length;
    const completionValue = detail.value;
    const complete = currentValue === completionValue;
    return { currentValue, completionValue, complete };
  });
};

const diffAmountCaught = async (
  value: number,
  details: LocationDetail[],
  user: UserEntity
): Promise<MissionProgress[]> => {
  const ae = await AnglerEntity.findOne({ where: { userId: user.id } });

  return details.map((detail): MissionProgress => {
    const currentValue = ae!.value - value;
    const completionValue = detail.value;
    const complete = currentValue === completionValue;
    return { currentValue, completionValue, complete };
  });
};

const diffFishSpecies = async (
  prevSpecCount: {
    [fish: string]: number;
  },
  details: SpeciesDetail[],
  user: UserEntity
): Promise<MissionProgress[]> => {
  const currSpecCount = (await dataSource.query(`
      select species, count(species) from prediction group by species;
      `)) as {
    [fish: string]: number;
  }[];

  const prevCount = currSpecCount.reduce(
    (prev: Record<string, number>, curr) => {
      return { ...prev, ...curr };
    },
    {}
  );

  return details.map((detail, index): MissionProgress => {
    const currentValue =
      prevCount[detail.species!] - prevSpecCount[detail.species!];
    const completionValue = detail.value;
    const complete = currentValue === completionValue;
    return { currentValue, completionValue, complete };
  });
};
