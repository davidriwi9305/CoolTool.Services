import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('API for managing orders')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Microservice Configuration
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.MICROSERVICE_HOST || '127.0.0.1', // Use environment variable for flexibility
      port: parseInt(process.env.MICROSERVICE_PORT || '3003'), // Avoid conflicts with different ports
    },
  });

  await app.startAllMicroservices();

  // Main HTTP Server
  const httpPort = parseInt(process.env.PORT || '3004'); // HTTP server uses a different port from the microservice
  await app.listen(httpPort);
  console.log(`HTTP server running on: http://localhost:${httpPort}`);
  console.log(`Microservice running on: ${process.env.MICROSERVICE_HOST || '127.0.0.1'}:${process.env.MICROSERVICE_PORT || '3003'}`);

  // Hot Module Replacement (HMR)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
