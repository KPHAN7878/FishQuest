import { ErrorRes } from "../../types";
import { CatchEntity } from "./catch.entity";
import { Prediction } from "../prediction/prediction.entity";
import { Session } from "express-session";
import { Request } from "express";
import { IsString } from "class-validator";

export class Submission {
  @IsString()
  time: string;
  @IsString()
  location: string;
  @IsString()
  imageBase64: string;
  @IsString()
  date: string;
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
