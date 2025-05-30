import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()

    const config = new DocumentBuilder()
        .setTitle('Kasir Backend')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            in: 'header'
        })
        .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, documentFactory)

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
