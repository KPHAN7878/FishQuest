import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = this.authService.validateToken(request.body);

    request.token = token;
    return next.handle().pipe(map((value: any) => value));
  }
}
