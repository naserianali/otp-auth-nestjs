import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class DbConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      port: this.configService.get("Db.port"),
      host: this.configService.get("Db.host"),
      type: "postgres",
      username: this.configService.get("Db.username"),
      password: this.configService.get("Db.password"),
      database: this.configService.get("Db.database"),
      synchronize: this.configService.get("Db.synchronize"),
      entities: ["dist/**/*.entity{.ts,.js}"],
    };
  }
}
