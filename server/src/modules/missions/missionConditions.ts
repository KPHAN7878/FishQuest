import { classList } from "../../classifier/imagenet";

type StandardDetail = {
  value: number;
  bonus?: number;
};

export type MissionSpecifier = {
  biologist?: StandardDetail[];
  adventurer?: StandardDetail[];
  angler?: StandardDetail[];
} & Object;

export type MissionInfo = {
  missionSpecifier: MissionSpecifier;
  description: string;
  deadline: Date | null;
  complete: boolean;
};

type AnyMission = "biologist" | "adventurer" | "angler";

const NUM_MISSION_VALUES = 3;

export enum MissionValueType {
  biologist = 1,
  adventurer,
  angler,
}

export enum Difficulty {
  easy = 1,
  medium,
  hard,
  expert,
}

export const generateSpecifier = (
  numSpecifiers: Difficulty
): MissionSpecifier => {
  const specTypes: MissionValueType[] = [];

  for (let i = 0; i < numSpecifiers; ++i) {
    const rand = Math.ceil(Math.random() * NUM_MISSION_VALUES);
    const T = resolveSpecifierTypeConflicts(specTypes, rand);
    specTypes.push(T);
  }

  let specs = specTypes.reduce(
    (specs: MissionSpecifier, specT: MissionValueType): MissionSpecifier => {
      let detail: StandardDetail = {
        value: Math.ceil(Math.random() * numSpecifiers),
      };
      if (Math.ceil(Math.random() * 5) === 5) {
        detail.bonus = Math.ceil(Math.random() * 50 * numSpecifiers);
      }

      return mapMission(specT, specs, detail);
    },
    {}
  );

  specs = resolveValueConflicts(specs, minimumCatches(specs));
  return specs;
};

const resolveSpecifierTypeConflicts = (
  specTypes: MissionValueType[],
  specT: MissionValueType
): MissionValueType => {
  if (!specTypes.includes(specT)) return specT;
  const a = specTypes.find((val) => val & MissionValueType.biologist);
  const b = specTypes.find((val) => val & MissionValueType.adventurer);
  const c = specTypes.find((val) => val & MissionValueType.angler);

  if (a && b && c) return MissionValueType.biologist;
  if (a && specT & a) return MissionValueType.adventurer;
  if (b && specT & b) return MissionValueType.biologist;
  return specT;
};

const resolveValueConflicts = (
  specs: MissionSpecifier,
  minimumCatches: number
): MissionSpecifier => {
  if (specs.angler && specs.angler[0].value < minimumCatches) {
    specs.angler[0].value += minimumCatches;
  }
  return specs;
};

const minimumCatches = (specs: MissionSpecifier): number => {
  let count = 0;
  if (specs.angler && specs.angler[0].value > count) {
    count = specs.angler[0].value;
  }

  if (specs.biologist) {
    const sum = specs.biologist.reduce((sum: number, curr: StandardDetail) => {
      return sum + curr.value;
    }, 0);
    if (sum > count) count = sum;
  }

  if (specs.adventurer && specs.adventurer[0].value > count) {
    count = specs.adventurer[0].value;
  }

  return count;
};

const mapMission = (
  val: MissionValueType,
  specs: MissionSpecifier,
  spec: StandardDetail
): MissionSpecifier => {
  switch (val) {
    case MissionValueType.biologist:
      specs.biologist ? specs.biologist.push(spec) : (specs.biologist = [spec]);
      break;
    case MissionValueType.adventurer:
      specs.adventurer
        ? specs.adventurer.push(spec)
        : (specs.adventurer = [spec]);
      break;
    case MissionValueType.angler:
      specs.angler ? specs.angler.push(spec) : (specs.angler = [spec]);
      break;
  }
  return specs;
};

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

type Description = {
  pretext?: string;
  text: string;
  postext?: string;
  plural?: boolean;
};

const resolveSpecifier = (
  details: StandardDetail[],
  mission: AnyMission,
  last?: boolean
): string => {
  let values: Description[] = [];
  let line = "";
  switch (mission) {
    case "biologist":
      var missionValueLabel = "species";
      values = classList
        .sort(() => 0.5 - Math.random())
        .slice(0, details.length)
        .map((val: string, idx: number): Description => {
          return {
            text: `${details[idx].value} ${val}`,
          };
        });
      break;
    case "adventurer":
      var missionValueLabel = "location";
      for (let i = 0; i < details.length; ++i) {
        values.push({
          pretext: "at",
          text: `${details[i].value} different ${missionValueLabel}`,
        });
      }
      break;
    case "angler":
      var missionValueLabel = "fish";
      for (let i = 0; i < details.length; ++i) {
        values.push({
          pretext: "at least",
          text: `${details[i].value} ${missionValueLabel}`,
        });
      }
      break;
  }
  const size = details.length;
  for (let i = 0; i < size; ++i) {
    const spacePre = values[i].pretext ? " " : "";
    const spacePost = values[i].postext ? " " : "";

    line += `${last && size - 1 === i ? "and " : ""}${
      values[i].pretext ?? ""
    }${spacePre}${values[i].text}${spacePost}${values[i].postext ?? ""}${
      last && size - 1 === i ? "" : ", "
    }`;
  }
  return line;
};

export const generateDescription = (mission: MissionSpecifier): string => {
  let result = "Catch ";
  const size = Object.keys(mission).length;
  let idx = 0;
  for (const [m, val] of Object.entries(mission)) {
    result += resolveSpecifier(val, m as AnyMission, idx++ === size - 1);
  }

  return result;
};

export const assignMission = (level: number): MissionSpecifier => {
  const difficulty: Difficulty = Math.ceil(
    Math.random() * maxDifficulty(level)
  );

  const mission: MissionSpecifier = generateSpecifier(difficulty);
  return mission;
};

const main = async () => {
  for (let i = 0; i < 10; i++) {
    const mission = assignMission(100);

    const desc = generateDescription(mission);
    console.log(JSON.stringify(desc, null, 2));
    console.log("---------------------------------");
  }
};

main().catch((err: any) => console.log(err));
