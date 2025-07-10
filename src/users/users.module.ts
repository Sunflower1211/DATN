import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/schema/user.schema';
import { JwtModule } from 'src/jwt/jwt.module';
import { Code, CodeSchema } from 'src/schema/code.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
            {
                name: Code.name,
                schema: CodeSchema,
            },
        ]),
        JwtModule
    ],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
