import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Kasir Backend')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      in: 'header',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    // 1. Definisikan asal (Origin) yang diizinkan
    origin: [
      'http://localhost:8000',
      'http://192.168.18.111:8000',
      'http://192.168.18.187:3000',
    ],

    // 2. Definisikan method yang diizinkan (default: GET, HEAD, PUT, POST, DELETE, PATCH)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    // 3. Izinkan kredensial (cookies, header Authorization)
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();

