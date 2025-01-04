import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const port = appConfig.get("App.port");
  await app.listen(port , ()=>{
    console.log(`localhost:${port}`);
  });
}

bootstrap();
