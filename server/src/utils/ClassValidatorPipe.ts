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
    let errors: ValidationError[];

    try {
      errors = await this.validate(object);
    } catch (err) {
      return value;
    }

    if (errors && errors.length > 0) {
      throw new HttpException(
        { errors: this.mapErrors(errors) },
        HttpStatus.OK
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
