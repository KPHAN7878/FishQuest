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
