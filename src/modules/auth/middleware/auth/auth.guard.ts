import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { isJWT } from "class-validator";
import { AuthService } from "../../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    request.user = await this.authService.verifyUserToken(token);
    return true;
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === "")
      throw new UnauthorizedException("Login to your account");
    const [bearer, token] = authorization.split(" ");
    if (bearer.toLowerCase() !== "bearer" || !token || !isJWT(token))
      throw new UnauthorizedException("Login to your account");
    return token;
  }
}
