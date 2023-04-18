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
  note: string;
  location: number[];
  imageUri: string;
}
