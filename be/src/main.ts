import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  cors: {
    origin: ['http://localhost:3000'], // FE user & admin
    credentials: true,
  },
});

 app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
 
  
  

app.enableCors({
  origin: ['http://localhost:3000'], // 👈 FE chạy ở đây
  credentials: true,
});

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Delia App API')
    .setDescription('API quản lý hệ thống thời trang cao cấp')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('dashboard')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api là endpoint

app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });  
app.useStaticAssets(join(__dirname, '..', 'public'));
await app.listen(3001, '0.0.0.0');
app.setGlobalPrefix('api');
}
bootstrap();