import { Module } from "@nestjs/common";
import { AppConfigModule } from "./modules/config/app.config.module";
import { DbConfig } from "./config/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './modules/user/user.module';
import { OtpModule } from './modules/otp/otp.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: DbConfig,
      inject: [DbConfig],
    }),
    UserModule,
    OtpModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [],
  providers: [DbConfig],
})
export class AppModule {}
