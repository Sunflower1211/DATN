import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from './jwt/jwt.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { ApplyModule } from './apply/apply.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { EmailService } from './email/email.service';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: 'process.env', isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        UsersModule,
        JwtModule,
        PostsModule,
        ApplyModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: process.env.EMAIL_HOST,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                },
                defaults: {
                    from: 'Tìm việc 24/7',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController, PostsController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude({ path: 'users/login', method: RequestMethod.POST }, { path: 'users/register', method: RequestMethod.POST })
            .forRoutes('*');
    }
}
