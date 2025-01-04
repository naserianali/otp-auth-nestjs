import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
  App = "App",
  Db = "Db",
  Jwt = "Jwt",
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
  port: 3000,
}));

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: 5432,
  host: "localhost",
  database: "otp-auth",
  username: "postgres",
  password: "root",
  synchronize: true,
}));

const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
  secretToken: "e970cdcabe691a6b9ced7a3d6f5a8509",
  refreshToken: "7a9b46ab6d983a85dd4d9a1aa64a3945",
}));
export const ConfigService = [AppConfig, DbConfig , JwtConfig];
