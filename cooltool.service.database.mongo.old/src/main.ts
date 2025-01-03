import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';


declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('API for managing users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Microservice Configuration
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.MICROSERVICE_HOST || '127.0.0.1', // Use environment variable for flexibility
      port: parseInt(process.env.MICROSERVICE_PORT || '3001'), // Avoid conflicts with different ports
    },
  });

  await app.startAllMicroservices();

  // Main HTTP Server
  const httpPort = parseInt(process.env.PORT || '3002'); // HTTP server uses a different port from the microservice

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(httpPort);
  console.log(`HTTP server running on: http://localhost:${httpPort}`);
  console.log(`Microservice running on: ${process.env.MICROSERVICE_HOST || '127.0.0.1'}:${process.env.MICROSERVICE_PORT || '3001'}`);

  // Hot Module Replacement (HMR)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
