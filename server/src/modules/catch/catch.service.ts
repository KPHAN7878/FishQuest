import { Injectable } from "@nestjs/common";
import { CatchEntity } from "./catch.entity";
import { Repository } from "typeorm";
import { Catch, Submission } from "./catch.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError } from "../../types";
import { __prod__ } from "../../constants";
import { Prediction } from "../prediction/prediction.entity";
import { Model } from "../../utils/ImageProc";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class CatchService {
  private classifier: Model = new Model({ verbose: true });
  constructor(
    @InjectRepository(CatchEntity)
    private readonly catchRepository: Repository<CatchEntity>
  ) {}

  async submitCatch(
    sub: Submission,
    user: UserEntity
  ): Promise<CatchEntity & Prediction> {
    const data = sub.imageBase64.split(";base64,").pop() as string;

    const image = await this.classifier.jimpFromData(data);
    const modelOutput = await this.classifier.submitInference(image);

    const prediction: Prediction = Prediction.create({
      status: true,
      species: "",
      modelOutput: JSON.stringify(modelOutput),
      userId: user.id,
    });

    const catchEntry: CatchEntity = CatchEntity.create({
      location: [], // change later
      imageUri: sub.imageUri,
      user,
      prediction,
    });
    await this.catchRepository.save(catchEntry);

    return { ...prediction, ...catchEntry } as CatchEntity & Prediction;
  }

  async getAll(): Promise<{ catches: CatchEntity[]; paginated?: boolean }> {
    return { catches: await CatchEntity.find() }; // {where: ... }
  }

  async getCatch(id: number): Promise<CatchEntity | ErrorRes> {
    const catchEntry = await CatchEntity.findOne({
      where: { id },
    });

    if (catchEntry === null) {
      const error: FieldError = { message: "Couldnt fetch user", field: "id" };
      return { errors: [error] };
    }

    return catchEntry;
  }

  //TEST saving catch to database
  async testSubmitCatch(
    testCatch: Catch,
    filepath: string
  ): Promise<CatchEntity> {
    const testCatchEntry = CatchEntity.create(testCatch as Catch);

    console.log(testCatchEntry);

    testCatchEntry["imageUri"] = filepath;

    await this.catchRepository.save(testCatchEntry);

    return testCatchEntry;
    //return {} as any;
  }
}
