import { IsString } from "class-validator";

export class Submission {
  @IsString()
  imageBase64: string;
  @IsString()
  imageUri: string;
  @IsString()
  location: string;
}

export class Pred {
  score?: number;
  status?: boolean;
  species?: string;
}

export class Catch {
  creatorId: number;
  comment: string;
  location: number[];
  imageUri: string;
  //imageBase64: string;
  //creatorUsername: string;
  //predDataId: number;
}
