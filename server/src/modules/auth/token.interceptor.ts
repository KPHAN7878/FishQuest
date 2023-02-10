import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TokenInput } from "../user/user.dto";
import { AuthService } from "./auth.service";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = await this.authService.validateToken(
      request.body as TokenInput
    );

    request.token = token;

    return next.handle().pipe(map((value: any) => value));
  }
}
