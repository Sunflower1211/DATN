import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from './jwt/jwt.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: 'process.env', isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        UsersModule,
        JwtModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .exclude(
            { path: 'users/login', method: RequestMethod.POST },
            { path: 'users/register', method: RequestMethod.POST },
        )
        .forRoutes('*');
    }
}

