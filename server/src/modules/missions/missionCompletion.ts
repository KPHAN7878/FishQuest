import { dataSource } from "../../constants";
import { UserEntity } from "../user/user.entity";
import { AnglerEntity, MissionEntity } from "./mission.entity";
import {
  LocationDetail,
  MissionSpecifier,
  MissionValueSnapshot,
  SpeciesDetail,
  StandardDetail,
  MissionProgress,
  DigestedProgress,
} from "./missionTypes";

export const snapshot = async (
  user: UserEntity
): Promise<MissionValueSnapshot> => {
  const res: MissionValueSnapshot = {};

  res.angler = await anglerSnapshot(user);
  res.biologist = await biologistSnapshot(user);
  res.adventurer = adventurerSnapshot();

  return res;
};

const anglerSnapshot = async (user: UserEntity): Promise<{ value: number }> => {
  const [value] = (await dataSource.query(
    ` 
    select value from angler_entity where "userId" = '${user.id}'
    `
  )) as { value: number }[];
  return value;
};

const biologistSnapshot = async (
  user: UserEntity
): Promise<{
  [fish: string]: number;
}> => {
  const currSpecCount = (await dataSource.query(`
      select species, count(species) from prediction
      where "userId" = '${user.id}' group by species;
      `)) as {
    [_: string]: number;
  }[];
  const res = currSpecCount.reduce((prev: Record<string, number>, curr) => {
    return { ...prev, [curr.species]: curr.count };
  }, {});

  return res;
};

const adventurerSnapshot = (): { lastCatchDate: string } => {
  return { lastCatchDate: new Date().toLocaleString("en-US") };
};

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
  lastDate: string,
  details: StandardDetail[],
  user: UserEntity
): Promise<MissionProgress[]> => {
  const uniqueDatesAfterSnapshot = (await dataSource.query(
    `
      select distinct location from
      catch_entity c inner join user_entity u
      on u.id = c."userId"
      where u.id = '${user.id}' and c."createdAt" > '${JSON.stringify(
      lastDate
    )}'
      `
  )) as { location: number[] }[];
  console.log(JSON.stringify(lastDate));
  console.log(new Date());

  return details.map((detail): MissionProgress => {
    const currentValue = uniqueDatesAfterSnapshot.length;
    const completionValue = detail.value;
    const complete = currentValue >= completionValue;
    return { currentValue, completionValue, complete };
  });
};

const diffAmountCaught = async (
  value: number,
  details: LocationDetail[],
  user: UserEntity
): Promise<MissionProgress[]> => {
  const ae = await anglerSnapshot(user);

  return details.map((detail): MissionProgress => {
    const currentValue = ae!.value - value;
    const completionValue = detail.value;
    const complete = currentValue >= completionValue;
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
  const prevCount = await biologistSnapshot(user);

  return details.map((detail: SpeciesDetail): MissionProgress => {
    const currentValue =
      (prevCount[detail.species!] ?? 0) - (prevSpecCount[detail.species!] ?? 0);
    const completionValue = detail.value;
    const complete = currentValue >= completionValue;

    return { currentValue, completionValue, complete };
  });
};

const weightedValues = (label: string, value: number) => {
  return value;
};

export const digestProgress = (
  progress: Record<string, MissionProgress[]>,
  match: MissionSpecifier
): DigestedProgress => {
  const res: DigestedProgress = {
    fullCompletion: true,
    bonusXp: 0,
    accumlatedValue: 0,
  };

  // only return bonus xp for completed portion
  for (const [label, progressDetails] of Object.entries(progress)) {
    res.fullCompletion &&= progressDetails.reduce(
      (curr: boolean, mp: MissionProgress, idx: number) => {
        if (match[label][idx]?.bonus)
          res.bonusXp += match[label][idx].bonus ?? 0;
        res.accumlatedValue += weightedValues(label, mp.completionValue);
        return curr && mp.complete;
      },
      res.fullCompletion
    );
  }
  return res;
};
