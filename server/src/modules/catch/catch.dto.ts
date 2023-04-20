import { IsString } from "class-validator";

export class Submission {
  @IsString()
  imageBase64: string;
  @IsString()
  imageUri: string;
  @IsString()
  location: string;
  //location: number[];
}

export class Pred {
  score?: number;
  status?: boolean;
  species?: string;
}

export class Catch {
  creatorId: number;
  notes: string;
  location: number[];
  imageUri: string;
}

export class AdditionalInfo {
  id: number;
  notes?: string;
  weight?: number;
  bait?: string;
  // species?: string;
}
