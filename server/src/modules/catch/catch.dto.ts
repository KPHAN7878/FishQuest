import { ErrorRes } from "../../types";
import { CatchEntity } from "./catch.entity";
import { Prediction } from "../prediction/prediction.entity";
import { Session } from "express-session";
import { Request } from "express";
import { IsDate, IsString } from "class-validator";

export class Submission {
  @IsString()
  time: string;
  @IsString()
  location: string;
  @IsString()
  imageBase64: string;
  @IsDate()
  date: string;
}

export class Pred {
  score?: number;
  status?: boolean;
  species?: string;
}
