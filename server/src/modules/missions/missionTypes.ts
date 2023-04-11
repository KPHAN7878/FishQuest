export const NUM_MISSION_VALUES = 3;
export const MAX_MISSIONS = 3;

// Note: would be best to just use dates to not rely on other entites
// if possible
export type MissionValueSnapshot = {
  angler?: { value: number };
  biologist?: {
    [fish: string]: number;
  };
  adventurer?: {
    lastCatchDate: Date;
  };
};

export type StandardDetail = {
  value: number;
  bonus?: number;
};

export type LocationDetail = {
  joinWith?: MissionEnum.biologist | MissionEnum.adventurer;
  index?: number;
} & StandardDetail;

export type SpeciesDetail = {
  species?: string;
} & StandardDetail;

export type AnyDetail = LocationDetail & StandardDetail & SpeciesDetail;

export type StandardDescGen =
  | {
      call: (details: AnyDetail[]) => Description[];
    }
  | undefined;

export type MissionSpecifier = {
  angler?: { details: StandardDetail[] } & StandardDescGen;
  biologist?: { details: SpeciesDetail[] } & StandardDescGen;
  adventurer?: { details: LocationDetail[] } & StandardDescGen; // no more than one
  [_: string]: any;
};

export type Missions = "biologist" | "adventurer" | "angler";
export enum MissionEnum {
  biologist = 1,
  adventurer,
  angler,
}

export const missionMap = {
  [MissionEnum.biologist]: "biologist",
  [MissionEnum.adventurer]: "adventurer",
  [MissionEnum.angler]: "angler",
} as Record<MissionEnum, string>;

export type Description = {
  pretext?: string;
  text: string;
  postext?: string;
  plural?: boolean;
};

export enum Difficulty {
  easy = 1,
  medium,
  hard,
  expert,
}

export type MissionProgress = {
  currentValue: number;
  completionValue: number;
  complete: boolean;
};

export type MissionEntityPrototype = {
  missionSpecifier: string;
  description: string;
  difficulty: Difficulty;
  deadline: Date;
};

export type DigestedProgress = {
  fullCompletion: boolean;
  bonusXp: number;
};
