import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  ValidationPipe,
  ValidationPipeOptions,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { ValidationError } from "class-validator";

@Injectable()
export default class ClassValidatorPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions | undefined) {
    super(options);
  }
  async transform(value: any, metaData: ArgumentMetadata): Promise<any> {
    const { metatype }: any = metaData;

    const object = plainToClass(metatype, value);
    const errors = await this.validate(object);

    if (errors.length > 0) {
      throw new HttpException(
        { errors: this.mapErrors(errors) },
        // `validation failed: ${this.mapErrors(errors)}`,
        HttpStatus.BAD_REQUEST
      );
    }

    return value;
  }

  private mapErrors(errors: ValidationError[]) {
    return errors.map((error: ValidationError) => {
      let message = "";
      for (let key in error.constraints) {
        message += error.constraints[key];
      }
      return { field: error.property, message };
    });
  }
}
