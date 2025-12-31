import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // Static assets for local uploads
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });

    // CORS - Dynamic origin support for development and production
    const isDev = process.env.NODE_ENV !== 'production';
    const allowedOrigins = (process.env.FRONTEND_URL || process.env.FRONTEND_URLS || 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

    app.enableCors({
        origin: [
            'http://localhost:3000',
            /^http:\/\/localhost:\d+$/,
            /^https?:\/\/.*\.sslip\.io$/,
            'https://sociopulse.fr',
            'https://www.sociopulse.fr',
            'https://api.sociopulse.fr',
            ...allowedOrigins,
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    // Global Exception Filter - standardized error responses
    app.useGlobalFilters(new AllExceptionsFilter());

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger API Docs
    const config = new DocumentBuilder()
        .setTitle('Les Extras V2 API')
        .setDescription('API pour la plateforme Sociopulse V2 - Médico-social B2B2C')
        .setVersion('2.0')
        .addBearerAuth()
        .addTag('auth', 'Authentification et gestion des utilisateurs')
        .addTag('matching', 'Moteur de matching SOS Renfort')
        .addTag('video', 'Gestion des sessions vidéo Educat\'heure')
        .addTag('wall', 'Fil d\'actualité et annonces')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = process.env.PORT || 4000;
    // 👇 CRITICAL: Bind to 0.0.0.0 for Docker container accessibility
    await app.listen(port, '0.0.0.0');

    const appUrl = await app.getUrl();
    logger.log(`🚀 API running on: ${appUrl}`);
    logger.log(`📚 Swagger docs: ${appUrl}/docs`);
    logger.log(`🌐 API endpoint: ${appUrl}/api/v1`);
}

bootstrap();
