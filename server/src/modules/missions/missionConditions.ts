type StandardDetail = {
  value: number;
  bonus?: number;
};

const NUM_MISSION_SPECIFIERS = 3;
export type StandardSpecifier = {
  variety?: StandardDetail;
  newVal?: StandardDetail;
  amount?: StandardDetail;
};

export enum DetailType {
  variety = 1,
  newVal,
  amount,
}

const mapDetail = (
  val: DetailType,
  detail: StandardDetail
): StandardSpecifier => {
  switch (val) {
    case DetailType.variety:
      return { variety: detail };
    case DetailType.newVal:
      return { newVal: detail };
    case DetailType.amount:
      return { amount: detail };
  }
};

export enum Difficulty {
  easy = 1,
  medium,
  hard,
  expert,
}

const NUM_MISSION_VALUES = 3;
export enum MissionValueType {
  biologist = 1,
  adventurer,
  angler,
}

const mapMission = (
  val: MissionValueType,
  specs: MissionSpecifier,
  spec: StandardSpecifier
): MissionSpecifier => {
  switch (val) {
    case MissionValueType.biologist:
      specs.biologist ? specs.biologist.push(spec) : (specs.biologist = [spec]);
    case MissionValueType.adventurer:
      specs.adventurer
        ? specs.adventurer.push(spec)
        : (specs.adventurer = [spec]);
    case MissionValueType.angler:
      specs.angler ? specs.angler.push(spec) : (specs.angler = [spec]);
  }
  return specs;
};

export type MissionSpecifier = {
  biologist?: StandardSpecifier[];
  adventurer?: StandardSpecifier[];
  angler?: StandardSpecifier[];
  difficulty: Difficulty;
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

export const generateSpecifier = (difficulty: Difficulty): MissionSpecifier => {
  const numSpecifiers: number = Math.ceil(Math.random() * difficulty);
  const specTypes: MissionValueType[] = [];

  for (let i = 0; i < numSpecifiers; ++i) {
    specTypes.push(Math.ceil(Math.random() * NUM_MISSION_VALUES));
  }

  const specs = specTypes.reduce(
    (specs: MissionSpecifier, specT: MissionValueType): MissionSpecifier => {
      let det: StandardDetail = {
        value: Math.ceil(Math.random() * difficulty),
      };
      if (Math.ceil(Math.random() * 3) === 3) {
        det.bonus = Math.ceil(Math.random() * 25 * difficulty);
      }
      const rand = Math.random() * NUM_MISSION_SPECIFIERS;
      const spec = mapDetail(rand, det);

      return mapMission(specT, specs, spec);
    },
    { difficulty }
  );

  return specs;
};
