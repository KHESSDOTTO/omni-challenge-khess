import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Exclui propriedades que não tem "decorators"
    transform: true, // Transforma payload em objetos do tipo definido em classes DTO
    forbidNonWhitelisted: true, // "Levanta" erro se valores fora dos especificados no DTO são passados
  }));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
