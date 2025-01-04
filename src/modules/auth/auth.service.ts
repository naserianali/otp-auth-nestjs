import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SendCodeDto } from "./dto/send-code.dto";
import { UserEntity } from "../user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OtpEntity } from "../otp/entities/otp.entity";
import * as crypto from "node:crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TTokenPayload } from "./types/payload.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private jtwService: JwtService,
    private configService: ConfigService,
  ) {}

  async sendCode(sendCodeDto: SendCodeDto) {
    const { mobile } = sendCodeDto;
    const expiredAt = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = crypto.randomInt(10000, 99999).toString();
    let user = await this.userRepository.findOneBy({ mobile });
    if (!user) {
      let user = this.userRepository.create({
        mobile,
      });
      await this.userRepository.save(user);
    }
    let otp = await this.otpRepository.findOneBy({
      login: mobile,
    });
    if (otp) {
      if (otp.expiredAt > new Date())
        throw new BadRequestException("code is not expired");
      otp.expiredAt = expiredAt;
      otp.code = code;
    } else {
      otp = this.otpRepository.create({
        code: code,
        login: mobile,
        expiredAt: expiredAt,
      });
    }
    await this.otpRepository.save(otp);
    return {
      message: "otp send successfully",
    };
  }

  async checkCode(sendCodeDto: SendCodeDto) {
    const { code, mobile } = sendCodeDto;
    let user = await this.userRepository.findOneBy({ mobile });
    if (!user) throw new BadRequestException("user not found");
    const otp = await this.otpRepository.findOneBy({ login: mobile });
    if (!otp) throw new BadRequestException("code is not found");
    if (otp.code !== code) throw new BadRequestException("code is not valid");
    if (otp.expiredAt < new Date())
      throw new BadRequestException("code is expired");
    if (!user.mobileVerified)
      await this.userRepository.update(user, {
        mobileVerified: true,
      });
    await this.otpRepository.remove(otp);
    const payload = {
      id: user.id,
      mobile: user.mobile,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const { accessToken, refreshToken } = this.createUserToken(payload);
    return {
      accessToken,
      refreshToken,
      message: "login successfully",
    };
  }

  createUserToken(payload: TTokenPayload) {
    console.log(this.configService.get("Jwt.secretToken"));
    const accessToken = this.jtwService.sign(payload, {
      secret: this.configService.get("Jwt.secretToken"),
      expiresIn: "30d",
    });
    const refreshToken = this.jtwService.sign(payload, {
      secret: this.configService.get("Jwt.refreshToken"),
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyUserToken(token: string) {
    try {
      const payload = this.jtwService.verify<TTokenPayload>(token, {
        secret: this.configService.get("Jwt.secretToken"),
      });
      if (typeof payload === "object" && payload?.id) {
        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user) throw new UnauthorizedException("Login to your account");
        return user;
      }
      throw new UnauthorizedException("Login to your account");
    }catch (error) {
      throw new UnauthorizedException("Login to your account");
    }
  }
}
