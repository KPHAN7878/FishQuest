import { classList } from "../../classifier/imagenet";

type StandardDetail = {
  value: number;
  bonus?: number;
};

type LocationDetail = {
  joinWith?: MissionType.biologist | MissionType.adventurer;
  index?: number;
} & StandardDetail;

type AllDetails = LocationDetail & StandardDetail;

type StandardDescGen = {
  call: (details: AllDetails[]) => Description[];
};

type MissionSpecifier = {
  biologist?: { details: StandardDetail[] } & StandardDescGen;
  angler?: { details: StandardDetail[] } & StandardDescGen;
  adventurer?: { details: LocationDetail[] } & StandardDescGen; // no more than one
} & Object;

export type MissionInfo = {
  missionSpecifier: MissionSpecifier;
  description: string;
  deadline: Date | null;
  complete: boolean;
};

type Missions = "biologist" | "adventurer" | "angler";

const NUM_MISSION_VALUES = 3;

enum MissionType {
  biologist = 1,
  adventurer,
  angler,
}

enum Difficulty {
  easy = 1,
  medium,
  hard,
  expert,
}

// will add later if I have time but too much trouble
const locSpecJoin = (
  specifier: MissionSpecifier,
  joiner: LocationDetail
): LocationDetail => {
  joiner.joinWith = Math.ceil(Math.random() * NUM_MISSION_VALUES);
  let n: number | undefined;
  if (MissionType.adventurer & joiner.joinWith) {
    joiner.joinWith = undefined;
    return joiner;
  } else if (MissionType.angler & joiner.joinWith) {
    n = specifier.angler?.details.length;
  } else if (MissionType.biologist & joiner.joinWith) {
    n = specifier.angler?.details.length;
  }

  if (n) {
    const randidx = Math.ceil(Math.random() * n);
    joiner.index = randidx;
  } else {
    joiner.joinWith = undefined;
  }
  return joiner;
};

const generateSpecifier = (numSpecifiers: Difficulty): MissionSpecifier => {
  const specTypes: MissionType[] = [];

  for (let i = 0; i < numSpecifiers; ++i) {
    const rand = Math.ceil(Math.random() * NUM_MISSION_VALUES);
    const T = resolveSpecifierTypeConflicts(specTypes, rand);
    specTypes.push(T);
  }

  let specs = specTypes.reduce(
    (specs: MissionSpecifier, specT: MissionType): MissionSpecifier => {
      const rand = Math.ceil(Math.random() * numSpecifiers);
      let detail: AllDetails = {
        value: rand,
      };
      // if (specT & MissionType.adventurer) detail = locSpecJoin(specs, detail);

      if (Math.ceil(Math.random() * 5) === 5) {
        detail.bonus = Math.ceil(Math.random() * 50 * numSpecifiers);
      }

      return buildMission(specT, specs, detail);
    },
    {}
  );

  specs = resolveValueConflicts(specs, minimumCatches(specs));
  return specs;
};

const resolveSpecifierTypeConflicts = (
  specTypes: MissionType[],
  specT: MissionType
): MissionType => {
  if (!specTypes.includes(specT)) return specT;
  const a = specTypes.find((val) => val & MissionType.biologist);
  const b = specTypes.find((val) => val & MissionType.adventurer);
  const c = specTypes.find((val) => val & MissionType.angler);

  if (a && b && c) return MissionType.biologist;
  if (a && specT & a) return MissionType.adventurer;
  if (b && specT & b) return MissionType.biologist;
  return specT;
};

const resolveValueConflicts = (
  specs: MissionSpecifier,
  minimumCatches: number
): MissionSpecifier => {
  if (specs.angler && specs.angler.details[0].value <= minimumCatches) {
    specs.angler.details[0].value += minimumCatches;
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
  val: MissionType,
  specs: MissionSpecifier,
  spec: StandardDetail
): MissionSpecifier => {
  switch (val) {
    case MissionType.biologist:
      specs.biologist
        ? specs.biologist.details.push(spec)
        : (specs.biologist = {
            details: [spec],
            call: (details: AllDetails[]): Description[] => {
              return classList
                .sort(() => 0.5 - Math.random())
                .slice(0, details.length)
                .map((val: string, idx: number): Description => {
                  return {
                    text: `${details[idx].value} ${val}`,
                  };
                });
            },
          });

      break;
    case MissionType.adventurer:
      specs.adventurer
        ? specs.adventurer.details.push(spec)
        : (specs.adventurer = {
            details: [spec],
            call: (details: AllDetails[]): Description[] => {
              return details.map((detail: LocationDetail) => {
                return {
                  pretext: "from",
                  text: `${detail.value} different locations`,
                };
              });
            },
          });
      break;
    case MissionType.angler:
      specs.angler
        ? specs.angler.details.push(spec)
        : (specs.angler = {
            details: [spec],
            call: (details: AllDetails[]): Description[] => {
              return details.map((detail: StandardDetail) => {
                return {
                  pretext: "a total of",
                  text: `${detail.value} fish`,
                };
              });
            },
          });
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

export const assignMissions = (difficulty: Difficulty): MissionSpecifier[] => {
  const diffs = [...Array(difficulty + 1).keys()];
  diffs.splice(0, 1);
  return diffs.map((val) => generateSpecifier(val));
};

const main = async () => {
  const level = 100;
  const maxDiff = maxDifficulty(level);
  const missions = assignMissions(maxDiff);

  for (let i = 0; i < maxDiff; i++) {
    const desc = generateDescription(missions[i]);
    console.log(JSON.stringify(missions[i], null, 2));
    console.log(JSON.stringify(desc, null, 2));
    console.log("---------------------------------");
  }
};

main().catch((err: any) => console.log(err));
