import { Injectable } from "@nestjs/common";
import { CatchEntity } from "./catch.entity";
import { Repository } from "typeorm";
import { Catch, Submission } from "./catch.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorRes, FieldError, PaginatedCursor } from "../../types";
import { dataSource, paginateLimit, __prod__ } from "../../constants";
import { Prediction } from "../prediction/prediction.entity";
import { Model } from "../../utils/ImageProc";
import { UserEntity } from "../user/user.entity";
import { MissionsService } from "../missions/missions.service";

@Injectable()
export class CatchService {
  private classifier: Model = new Model({ verbose: true });
  constructor(
    @InjectRepository(CatchEntity)
    private readonly catchRepository: Repository<CatchEntity>,
    private readonly missionsService: MissionsService
  ) {}

  async submitCatch(sub: Submission, user: UserEntity): Promise<any> {
    const data = sub.imageBase64.split(";base64,").pop() as string;

    const image = await this.classifier.jimpFromData(data);
    const modelOutput = await this.classifier.submitInference(image);
    var numArr = sub.location.split(",");

    var finalArr = [];
    finalArr.push(parseFloat(numArr[0]));
    finalArr.push(parseFloat(numArr[1]));

    const prediction: Prediction = Prediction.create({
      status: true,
      species: "",
      modelOutput: JSON.stringify(modelOutput),
      userId: user.id,
    });

    const catchEntry: CatchEntity = CatchEntity.create({
      location: finalArr,
      imageUri: sub.imageUri,
      user,
      prediction,
    });
    const res = { ...prediction, ...catchEntry } as CatchEntity & Prediction;

    return {
      ...res,
      missions: await this.missionsService.allChecks(res).then((val: any) => {
        this.catchRepository.save(catchEntry);
        return val;
      }),
    };
  }

  async getAll(
    { cursor, limit }: PaginatedCursor,
    { id: myId }: UserEntity
  ): Promise<{ catches: CatchEntity[]; hasMore: boolean }> {
    const [realLimit, realLimitPlusOne] = paginateLimit(limit);

    const catches = await dataSource.query(
      `
      select
      json_build_object(
        'id', c."id",
        'note', c."note",
        'imageUri', c."imageUri",
        'location', c."location",
        'species', p."species"
      ) catch
      from prediction
      p inner join catch_entity c on c."predictionId" = p.id
      inner join user_entity u on u.id = p."userId"
      ${
        cursor
          ? `where c."createdAt" < '${cursor}' and p."userId" = ${myId}`
          : ""
      }
      order by c."createdAt" DESC
      limit ${realLimitPlusOne}

      `
    );

    return {
      catches: catches.slice(0, realLimit),
      hasMore: catches.length === realLimitPlusOne,
    };
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

  async testSubmitCatch(
    testCatch: Catch,
    filepath: string
  ): Promise<CatchEntity> {
    const testCatchEntry = CatchEntity.create(testCatch as Catch);

    console.log(testCatchEntry);

    testCatchEntry["imageUri"] = filepath;

    await this.catchRepository.save(testCatchEntry);

    return testCatchEntry;
  }
}
