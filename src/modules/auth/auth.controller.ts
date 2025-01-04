import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SendCodeDto } from "./dto/send-code.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("send-code")
  sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendCode(sendCodeDto);
  }

  @Post("check-code")
  checkCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.checkCode(sendCodeDto);
  }
}
