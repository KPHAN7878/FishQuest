import { Injectable } from "@nestjs/common";
import { CatchEntity } from "./catch.entity";
import { Repository } from "typeorm";
import { Pred, Submission } from "./catch.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError } from "../../types";
import { __prod__ } from "../../constants";
import { Prediction } from "../prediction/prediction.entity";
import { Model } from "../../utils/ImageProc";

@Injectable()
export class CatchService {
  private classifier: Model = new Model({ verbose: true });
  constructor(
    @InjectRepository(CatchEntity)
    private readonly catchRepository: Repository<CatchEntity>
  ) {}

  async submitCatch(sub: Submission): Promise<CatchEntity & Prediction> {
    const data = sub.imageBase64.split(";base64,").pop() as string;

    const image = await this.classifier.jimpFromData(data);
    const modelOutput = await this.classifier.submitInference(image);
    console.log(modelOutput);

    const catchEntry: CatchEntity = CatchEntity.create();
    // await this.catchRepository.save(catchEntry);
    const prediction: Prediction = Prediction.create();

    return {} as any;
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
}
