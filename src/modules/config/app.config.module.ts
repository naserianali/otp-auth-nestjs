import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "../../config/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: ConfigService,
      isGlobal: true,
    }),
  ],
})
export class AppConfigModule {}
