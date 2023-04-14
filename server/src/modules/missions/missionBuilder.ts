import { classList } from "../../classifier/imagenet";
import { MissionEntity } from "./mission.entity";
import {
  AnyDetail,
  Description,
  Difficulty,
  LocationDetail,
  missionMap,
  Missions,
  MissionSpecifier,
  MissionEnum,
  NUM_MISSION_VALUES,
  SpeciesDetail,
  StandardDetail,
  MissionEntityPrototype,
} from "./missionTypes";

export const maxDifficulty = (level: number): Difficulty => {
  if (level < 10) {
    return Difficulty.easy;
  } else if (level < 25) {
    return Difficulty.medium;
  } else if (level < 50) {
    return Difficulty.hard;
  } else {
    return Difficulty.expert;
  }
};

const generateSpecifier = (numSpecifiers: Difficulty): MissionSpecifier => {
  const specTypes: MissionEnum[] = [];

  for (let i = 0; i < numSpecifiers; ++i) {
    const rand = Math.ceil(Math.random() * NUM_MISSION_VALUES);
    const T = resolveSpecifierTypeConflicts(specTypes, rand);
    specTypes.push(T);
  }

  const classes = classList
    .sort(() => 0.5 - Math.random())
    .slice(0, classList.length);
  let specs = specTypes.reduce(
    (specs: MissionSpecifier, specT: MissionEnum): MissionSpecifier => {
      const rand = Math.ceil(Math.random() * numSpecifiers);
      let detail: AnyDetail = {
        value: rand,
      };
      if (specT & MissionEnum.biologist) {
        [detail.species] = classes.splice(0, 1);
      }

      if (Math.ceil(Math.random() * 5) === 5 && numSpecifiers > 1) {
        detail.bonus = Math.ceil(Math.random() * 50 * numSpecifiers);
      }

      return buildMission(specT, specs, detail);
    },
    {}
  );

  specs = resolveValueConflicts(
    specs,
    minimumCatches(specs),
    numSpecifiers * numSpecifiers
  );
  return specs;
};

const resolveSpecifierTypeConflicts = (
  specTypes: MissionEnum[],
  specT: MissionEnum
): MissionEnum => {
  if (!specTypes.includes(specT)) return specT;
  const a = specTypes.find((val) => val & MissionEnum.biologist);
  const b = specTypes.find((val) => val & MissionEnum.adventurer);
  const c = specTypes.find((val) => val & MissionEnum.angler);

  if (a && b && c) return MissionEnum.biologist;
  if (a && specT & a) return MissionEnum.adventurer;
  if (b && specT & b) return MissionEnum.biologist;
  return specT;
};

const resolveValueConflicts = (
  specs: MissionSpecifier,
  minCatches: number,
  maxCatches: number
): MissionSpecifier => {
  if (specs.angler && specs.angler.details[0].value <= minCatches) {
    specs.angler.details[0].value = Math.min(
      specs.angler.details[0].value + minCatches,
      maxCatches
    );
  }
  if (specs.adventurer && specs.adventurer.details[0].value === 1) {
    specs.adventurer.details[0].value = 2;
  }
  return specs;
};

const minimumCatches = (specs: MissionSpecifier): number => {
  let count = 0;
  if (specs.angler && specs.angler.details[0].value > count) {
    count = specs.angler.details[0].value;
  }

  if (specs.biologist) {
    const sum = specs.biologist.details.reduce(
      (sum: number, curr: StandardDetail) => {
        return sum + curr.value;
      },
      0
    );
    if (sum > count) count += sum;
  }

  if (specs.adventurer && specs.adventurer.details[0].value > count) {
    count = specs.adventurer.details[0].value;
  }

  return count;
};

const buildMission = (
  val: MissionEnum,
  specs: MissionSpecifier,
  spec: AnyDetail
): MissionSpecifier => {
  let mission = specs[missionMap[val] as keyof MissionSpecifier];
  switch (val) {
    case MissionEnum.angler:
      var fn: (detail: AnyDetail) => string = (detail: StandardDetail) =>
        `a total of ${detail.value} fish`;
      break;
    case MissionEnum.biologist:
      var fn: (detail: AnyDetail) => string = (detail: SpeciesDetail) =>
        `${detail.value} ${detail.species}`;
      break;
    case MissionEnum.adventurer:
      var fn: (detail: AnyDetail) => string = (detail: LocationDetail) =>
        `from ${detail.value} different locations`;
      break;
  }

  mission?.details.push(spec) ??
    (mission = {
      details: [spec],
      call: (details: SpeciesDetail[]): Description[] => {
        return details.map((detail: SpeciesDetail): Description => {
          return { text: fn(detail) };
        });
      },
    });
  specs[missionMap[val] as keyof MissionSpecifier] = mission;

  return specs;
};

const resolveSpecifier = (
  values: Description[],
  and: number,
  last: boolean
): string => {
  const size = values.length;
  let line: string = "";
  for (let i = 0; i < size; ++i) {
    const spacePre = values[i].pretext ? " " : "";
    const spacePost = values[i].postext ? " " : "";

    line += `${
      (last && size - 1 === i) || (and - 1 === i && last) ? "and " : ""
    }${values[i].pretext ?? ""}${spacePre}${values[i].text}${spacePost}${
      values[i].postext ?? ""
    }${(last && size - 1 === i) || (last && and === 1) ? " " : ", "}`;
  }

  return line;
};

const generateDescription = (mission: MissionSpecifier): string => {
  let result = "Submit ";
  const size = Object.keys(mission).length;
  let idx = 0;
  for (const key in mission) {
    const details = mission[key as Missions]!.details;
    const desc = mission[key as Missions]!.call(details);
    result += resolveSpecifier(
      desc,
      details.length,
      idx++ === size - 1 && size !== 1
    );
  }

  if (result.indexOf(",", result.indexOf(",") + 1) === -1)
    result = result.replace(",", "");

  return result.trim();
};

export const assignMissions = (
  difficulty: Difficulty,
  amount: number
): [number, MissionSpecifier][] => {
  const diffs: number[] = [...Array(difficulty + 1).keys()];
  let take: number[] = [];
  const diffSelections: number[] = [];
  diffs.splice(0, 1);

  for (let i = 0; i < amount; i++) {
    take = [...take, ...diffs];
    const randix = Math.floor(Math.random() * take.length);
    diffSelections.push(...take.splice(randix, 1));
  }

  return diffSelections.map((val: number) => [val, generateSpecifier(val)]);
};

export const formMissions = (
  level: number,
  amount: number = 3
): MissionEntityPrototype[] => {
  const maxDiff = maxDifficulty(level);
  const missions = assignMissions(maxDiff, amount);

  const res: MissionEntityPrototype[] = [];
  for (const [difficulty, m] of missions) {
    const description = generateDescription(m);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (3 * difficulty + (difficulty - 1)));
    res.push({
      specifier: JSON.stringify(m),
      description,
      difficulty,
      deadline,
    });
  }

  return res;
};
